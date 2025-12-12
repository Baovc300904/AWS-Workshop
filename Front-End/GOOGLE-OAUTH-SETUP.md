# 🔐 Google OAuth Setup Guide

## 📋 Tổng quan

Dự án đã có sẵn khung Google OAuth hoàn chỉnh. Bạn chỉ cần setup Google Cloud Console và Backend API.

## 🎯 Files đã tạo:

1. **`src/services/googleAuth.ts`** - Google OAuth helper functions
2. **`src/pages/GoogleCallbackPage.tsx`** - Callback page xử lý redirect
3. **Login/Register pages** - Đã integrate Google button

## 🚀 Setup Steps

### **1. Google Cloud Console Setup**

#### A. Tạo OAuth 2.0 Credentials

1. Truy cập: https://console.cloud.google.com/
2. Tạo hoặc chọn Project
3. Vào **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Chọn **Web application**
6. Điền thông tin:
   - **Name**: Game Store Web Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:5173
     http://localhost:3000
     https://yourdomain.com
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:5173/auth/google/callback
     http://localhost:3000/auth/google/callback
     https://yourdomain.com/auth/google/callback
     ```
7. Click **Create**
8. **Copy CLIENT_ID** được tạo ra

#### B. Configure OAuth Consent Screen

1. Vào **APIs & Services** → **OAuth consent screen**
2. Chọn **External** (hoặc Internal nếu dùng Google Workspace)
3. Điền thông tin:
   - **App name**: Game Store
   - **User support email**: your-email@example.com
   - **App logo**: (optional)
   - **Scopes**: 
     - `openid`
     - `profile` 
     - `email`
4. **Test users** (nếu app chưa publish):
   - Thêm email test users
5. Save

---

### **2. Frontend Configuration**

Mở file `src/services/googleAuth.ts` và thay:

```typescript
export const GOOGLE_CONFIG = {
  CLIENT_ID: 'YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com', // ← Paste CLIENT_ID ở đây
  // ... rest of config
};
```

---

### **3. Backend API Setup**

Tạo endpoint trong Spring Boot backend:

#### A. Dependencies (pom.xml)

```xml
<!-- Google OAuth Client -->
<dependency>
    <groupId>com.google.api-client</groupId>
    <artifactId>google-api-client</artifactId>
    <version>2.2.0</version>
</dependency>
<dependency>
    <groupId>com.google.oauth-client</groupId>
    <artifactId>google-oauth-client-jetty</artifactId>
    <version>1.34.1</version>
</dependency>
```

#### B. Application Properties

```properties
# Google OAuth
google.oauth.client-id=YOUR_CLIENT_ID.apps.googleusercontent.com
google.oauth.client-secret=YOUR_CLIENT_SECRET
google.oauth.redirect-uri=http://localhost:8080/identity/auth/google/callback
```

#### C. Google OAuth Controller

```java
@RestController
@RequestMapping("/identity/auth/google")
public class GoogleOAuthController {

    @Value("${google.oauth.client-id}")
    private String clientId;

    @Value("${google.oauth.client-secret}")
    private String clientSecret;

    @Value("${google.oauth.redirect-uri}")
    private String redirectUri;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    /**
     * Exchange authorization code for token
     */
    @PostMapping("/callback")
    public ApiResponse<GoogleAuthResponse> handleCallback(@RequestBody GoogleCallbackRequest request) {
        try {
            // 1. Exchange code for access token
            GoogleTokenResponse tokenResponse = exchangeCodeForToken(request.getCode());
            
            // 2. Get user info from Google
            GoogleUserInfo userInfo = getUserInfo(tokenResponse.getAccessToken());
            
            // 3. Find or create user in your database
            User user = userService.findOrCreateGoogleUser(userInfo);
            
            // 4. Generate JWT token
            String jwtToken = jwtService.generateToken(user);
            
            // 5. Return response
            GoogleAuthResponse response = GoogleAuthResponse.builder()
                .token(jwtToken)
                .user(UserDTO.from(user))
                .build();
            
            return ApiResponse.<GoogleAuthResponse>builder()
                .result(response)
                .build();
                
        } catch (Exception e) {
            throw new AppException(ErrorCode.GOOGLE_AUTH_FAILED);
        }
    }

    private GoogleTokenResponse exchangeCodeForToken(String code) throws IOException {
        GoogleAuthorizationCodeTokenRequest tokenRequest = new GoogleAuthorizationCodeTokenRequest(
            new NetHttpTransport(),
            JacksonFactory.getDefaultInstance(),
            "https://oauth2.googleapis.com/token",
            clientId,
            clientSecret,
            code,
            redirectUri
        );
        
        return tokenRequest.execute();
    }

    private GoogleUserInfo getUserInfo(String accessToken) throws IOException {
        String url = "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + accessToken;
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForObject(url, GoogleUserInfo.class);
    }
}

// DTO Classes
@Data
class GoogleCallbackRequest {
    private String code;
}

@Data
@Builder
class GoogleAuthResponse {
    private String token;
    private UserDTO user;
}

@Data
class GoogleUserInfo {
    private String sub;          // Google user ID
    private String email;
    private String name;
    private String given_name;   // First name
    private String family_name;  // Last name
    private String picture;      // Profile picture URL
    private Boolean email_verified;
}
```

#### D. User Service - Find or Create User

```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public User findOrCreateGoogleUser(GoogleUserInfo googleUser) {
        // Try to find existing user by email
        Optional<User> existingUser = userRepository.findByEmail(googleUser.getEmail());
        
        if (existingUser.isPresent()) {
            return existingUser.get();
        }
        
        // Create new user from Google info
        User newUser = User.builder()
            .username(generateUsernameFromEmail(googleUser.getEmail()))
            .email(googleUser.getEmail())
            .firstName(googleUser.getGiven_name())
            .lastName(googleUser.getFamily_name())
            .password(generateRandomPassword()) // Random password for OAuth users
            .roles(Set.of(Role.USER))
            .emailVerified(googleUser.getEmail_verified())
            .build();
        
        return userRepository.save(newUser);
    }
    
    private String generateUsernameFromEmail(String email) {
        String base = email.split("@")[0];
        // Add random suffix if username exists
        while (userRepository.existsByUsername(base)) {
            base = base + new Random().nextInt(1000);
        }
        return base;
    }
    
    private String generateRandomPassword() {
        // Generate secure random password for OAuth users
        return UUID.randomUUID().toString();
    }
}
```

---

### **4. Testing**

#### A. Test Flow

1. Start Backend: `mvn spring-boot:run`
2. Start Frontend: `npm run dev`
3. Mở http://localhost:5173/login
4. Click **"Đăng nhập với Google"**
5. Popup Google OAuth sẽ mở
6. Chọn tài khoản Google
7. Authorize app
8. Popup đóng, user được redirect về app với token

#### B. Debug

Check console logs:
```javascript
// Frontend
console.log('Google code:', code);
console.log('Token response:', result);

// Backend  
log.info("Google user info: {}", userInfo);
log.info("JWT token generated: {}", jwtToken);
```

---

### **5. Security Notes** ⚠️

1. **NEVER** commit `CLIENT_SECRET` to Git
2. Use environment variables in production:
   ```bash
   GOOGLE_CLIENT_ID=xxx
   GOOGLE_CLIENT_SECRET=xxx
   ```
3. Enable **CSRF protection** (đã có sẵn trong code với `state`)
4. Validate `redirect_uri` in backend
5. Use HTTPS in production

---

### **6. Production Deployment**

#### Frontend
```env
VITE_GOOGLE_CLIENT_ID=your_client_id
```

#### Backend
```yaml
google:
  oauth:
    client-id: ${GOOGLE_CLIENT_ID}
    client-secret: ${GOOGLE_CLIENT_SECRET}
    redirect-uri: https://yourdomain.com/identity/auth/google/callback
```

---

## 🎯 Current Status

✅ Frontend Google OAuth flow - **DONE**  
✅ Callback page handler - **DONE**  
✅ Popup-based authentication - **DONE**  
⏳ Backend API endpoint - **TODO** (follow guide above)  
⏳ Google Cloud Console setup - **TODO** (follow guide above)

---

## 📞 Support

Nếu gặp vấn đề:
1. Check browser console for errors
2. Check backend logs
3. Verify Google Cloud Console settings
4. Check redirect URIs match exactly

---

## 🔗 References

- [Google OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Spring Security OAuth2](https://spring.io/guides/tutorials/spring-boot-oauth2/)
