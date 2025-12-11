package com.se182393.baidautien.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.se182393.baidautien.dto.response.InventoryResponse;
import com.se182393.baidautien.dto.response.TransactionResponse;
import com.se182393.baidautien.entity.Game;
import com.se182393.baidautien.entity.Inventory;
import com.se182393.baidautien.entity.Transaction;
import com.se182393.baidautien.entity.TransactionStatus;
import com.se182393.baidautien.entity.TransactionType;
import com.se182393.baidautien.entity.User;
import com.se182393.baidautien.repository.GameRepository;
import com.se182393.baidautien.repository.InventoryRepository;
import com.se182393.baidautien.repository.TransactionRepository;
import com.se182393.baidautien.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TransactionService {

    TransactionRepository transactionRepository;
    UserRepository userRepository;
    GameRepository gameRepository;
    InventoryRepository inventoryRepository;

    /**
     * Tạo transaction mới
     */
    @Transactional
    public Transaction createTransaction(User user, TransactionType type, Double amount, 
                                        String description, String gameId, String orderId) {
        Transaction transaction = Transaction.builder()
                .user(user)
                .type(type)
                .paymentMethod("MOMO")
                .amount(amount)
                .status(TransactionStatus.PENDING)
                .description(description)
                .gameId(gameId)
                .orderId(orderId)
                .build();
        
        return transactionRepository.save(transaction);
    }

    /**
     * Xử lý nạp tiền thành công
     */
    @Transactional
    public void processDeposit(String transactionUUID, String momoTransId) {
        // transactionUUID là UUID primary key, không phải transactionId
        Transaction transaction = transactionRepository.findById(transactionUUID)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        if (transaction.getStatus() == TransactionStatus.SUCCESS) {
            log.warn("Transaction {} already processed", transactionUUID);
            return;
        }

        User user = transaction.getUser();
        Double currentBalance = user.getBalance() != null ? user.getBalance() : 0.0;
        user.setBalance(currentBalance + transaction.getAmount());
        userRepository.save(user);

        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setTransactionId(momoTransId); // Lưu MoMo transId để tra cứu
        transaction.setPaymentMethod("MOMO");
        transactionRepository.save(transaction);

        log.info("Deposit processed: User {} balance updated to {}", user.getId(), user.getBalance());
    }

    /**
     * Xử lý mua game thành công
     */
    @Transactional
    public void processPurchase(String transactionId, String momoTransId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        if (transaction.getStatus() == TransactionStatus.SUCCESS) {
            log.warn("Transaction {} already processed", transactionId);
            return;
        }

        User user = transaction.getUser();
        Game game = gameRepository.findById(transaction.getGameId())
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // Tạo license key và thêm vào inventory
        String licenseKey = generateLicenseKey(game);
        Inventory inventory = Inventory.builder()
                .user(user)
                .game(game)
                .licenseKey(licenseKey)
                .transactionId(transaction.getId())
                .purchasedAt(LocalDateTime.now())
                .activated(false)
                .build();
        inventoryRepository.save(inventory);

        transaction.setStatus(TransactionStatus.SUCCESS);
        transaction.setTransactionId(momoTransId);
        transactionRepository.save(transaction);

        log.info("Purchase processed: User {} bought game {}", user.getId(), game.getName());
    }

    /**
     * Xử lý thanh toán thất bại
     */
    @Transactional
    public void processFailedPayment(String transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        
        transaction.setStatus(TransactionStatus.FAILED);
        transactionRepository.save(transaction);

        log.info("Payment failed for transaction {}", transactionId);
    }

    /**
     * Lấy lịch sử giao dịch của user
     */
    public List<TransactionResponse> getUserTransactionHistory(User user) {
        List<Transaction> transactions = transactionRepository.findByUserOrderByCreatedAtDesc(user);
        return transactions.stream()
                .map(this::toTransactionResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy tất cả giao dịch (Admin)
     */
    public List<TransactionResponse> getAllTransactions() {
        List<Transaction> transactions = transactionRepository.findAllByOrderByCreatedAtDesc();
        return transactions.stream()
                .map(this::toTransactionResponse)
                .collect(Collectors.toList());
    }

    /**
     * Lấy inventory của user
     */
    public List<InventoryResponse> getUserInventory(User user) {
        List<Inventory> inventories = inventoryRepository.findByUserOrderByPurchasedAtDesc(user);
        return inventories.stream()
                .map(this::toInventoryResponse)
                .collect(Collectors.toList());
    }

    /**
     * Generate license key cho game
     */
    private String generateLicenseKey(Game game) {
        String prefix = game.getName().substring(0, Math.min(3, game.getName().length())).toUpperCase();
        String uuid = UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
        return prefix + "-" + uuid.substring(0, 4) + "-" + uuid.substring(4, 8) + "-" 
               + uuid.substring(8, 12) + "-" + uuid.substring(12, 16);
    }

    /**
     * Convert Transaction entity to TransactionResponse
     */
    private TransactionResponse toTransactionResponse(Transaction transaction) {
        String userName = transaction.getUser().getFirstName() + " " + transaction.getUser().getLastName();
        String gameName = null;
        
        if (transaction.getGameId() != null) {
            gameName = gameRepository.findById(transaction.getGameId())
                    .map(Game::getName)
                    .orElse(null);
        }

        return TransactionResponse.builder()
                .id(transaction.getId())
                .userId(transaction.getUser().getId())
                .userName(userName)
                .transactionId(transaction.getTransactionId())
                .type(transaction.getType())
                .paymentMethod(transaction.getPaymentMethod())
                .amount(transaction.getAmount())
                .status(transaction.getStatus())
                .description(transaction.getDescription())
                .gameId(transaction.getGameId())
                .gameName(gameName)
                .orderId(transaction.getOrderId())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }

    /**
     * Convert Inventory entity to InventoryResponse
     */
    private InventoryResponse toInventoryResponse(Inventory inventory) {
        return InventoryResponse.builder()
                .id(inventory.getId())
                .gameId(inventory.getGame().getId())
                .gameName(inventory.getGame().getName())
                .gameImage(inventory.getGame().getImage())
                .licenseKey(inventory.getLicenseKey())
                .purchasedAt(inventory.getPurchasedAt())
                .activated(inventory.getActivated())
                .activatedAt(inventory.getActivatedAt())
                .transactionId(inventory.getTransactionId())
                .pricePaid(inventory.getGame().getPrice()) // Can be enhanced to store actual price paid
                .build();
    }
}
