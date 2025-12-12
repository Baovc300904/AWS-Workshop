package com.se182393.baidautien.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminReportResponse {
    Long totalTransactions;
    Long successfulTransactions;
    Long failedTransactions;
    Double totalRevenue;
    Double totalDeposits;
    Double totalGameSales;
    Long totalUsers;
    Long totalGames;
    Long totalOrders;
}
