package com.se182393.baidautien.configuration;

import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final String[] PUBLIC_ENDPOINTS = {
            "/users",
            "/auth/login",
            "/auth/log-in",
            "/auth/token",
            "/auth/register",
            "/auth/google-login",
            "/auth/introspect",
            "/auth/logout",
            "/auth/refresh",
            "/users/forgot-password",
            "/users/reset-password",
            "/payment/momo/confirm/**",
            "/payment/momo/status/**",
            "/payment/momo/callback",
            "/topup/momo/confirm",
            "/topup/momo/callback",
            "/topup/status/**",
            "/games/image",
            "/actuator/**"
    };

    @Value("${jwt.signerKey}")
    private String signerKey;

    @Autowired
    private CustomJwtDecoder customJwtDecoder;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {

        httpSecurity.authorizeHttpRequests(request -> request
                // Allow CORS preflight requests
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Allow actuator endpoints
                .requestMatchers(HttpMethod.GET,"/actuator/**").permitAll()
                .requestMatchers(HttpMethod.POST,PUBLIC_ENDPOINTS).permitAll()
                .requestMatchers(HttpMethod.POST,"/cart/**").permitAll()
                .requestMatchers(HttpMethod.POST,"/users/request-phone-otp").permitAll()
                .requestMatchers(HttpMethod.POST,"/users/create-with-roles").permitAll()  // Cho phép tạo admin
                .requestMatchers(HttpMethod.POST,"/email/request-otp").permitAll()
                .requestMatchers(HttpMethod.POST,"/payment/momo/create").permitAll()
                .requestMatchers(HttpMethod.POST,"/payment/momo/create-with-items").permitAll()
                .requestMatchers(HttpMethod.POST,"/payment/momo/callback").permitAll()
                .requestMatchers(HttpMethod.GET,"/payment/momo/callback").permitAll()
                .requestMatchers(HttpMethod.GET,"/payment/momo/status/**").permitAll()
                .requestMatchers(HttpMethod.POST,"/payment/momo/test-success/**").permitAll()
                .requestMatchers(HttpMethod.POST,"/topup/momo").authenticated()
                .requestMatchers(HttpMethod.POST,"/topup/momo/callback").permitAll()
                .requestMatchers(HttpMethod.GET,"/topup/momo/callback").permitAll()
                .requestMatchers(HttpMethod.GET,"/topup/**").authenticated()
                .requestMatchers(HttpMethod.POST,"/users/forgot-password/email/**").permitAll()
                .requestMatchers(HttpMethod.POST,"/admin/games/**").hasAnyRole("ADMIN", "MOD")
                .requestMatchers(HttpMethod.PUT,"/admin/games/**").hasAnyRole("ADMIN", "MOD")
                .requestMatchers(HttpMethod.DELETE,"/admin/games/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET,"/maintenance/reseed-categories").permitAll()
                .requestMatchers(HttpMethod.POST,"/maintenance/reseed-categories").permitAll()
                .requestMatchers(HttpMethod.POST,"/ratings/**").permitAll()
                .requestMatchers(HttpMethod.GET,"/ratings/**").permitAll()
                // S3 endpoints
                .requestMatchers(HttpMethod.POST,"/s3/upload").permitAll()
                .requestMatchers(HttpMethod.POST,"/s3/upload/game-image").permitAll()
                .requestMatchers(HttpMethod.DELETE,"/s3/delete").permitAll()
                .requestMatchers(HttpMethod.GET,"/s3/**").permitAll()
                // Avatar upload (authenticated)
                .requestMatchers(HttpMethod.POST,"/users/avatar").authenticated()
                .requestMatchers(HttpMethod.DELETE,"/users/avatar").authenticated()
                // User endpoints - /users/myInfo requires authentication
                .requestMatchers(HttpMethod.GET,"/users/myInfo").authenticated()
                .requestMatchers(HttpMethod.POST,"/users/avatar").authenticated()
                .requestMatchers(HttpMethod.DELETE,"/users/avatar").authenticated()
                .requestMatchers(HttpMethod.GET,"/users").hasAnyRole("ADMIN", "MOD")
                .requestMatchers(HttpMethod.GET,"/users/**").permitAll()
                .requestMatchers(HttpMethod.GET,"/category","/category/**").permitAll()
                .requestMatchers(HttpMethod.GET,"/games","/games/**").permitAll()
                .requestMatchers(HttpMethod.POST,"/games/image").permitAll()
                .requestMatchers(HttpMethod.POST,"/games").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,"/games/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE,"/games/**").hasRole("ADMIN")
                .anyRequest().authenticated());


        // cai này cho phép là cái token chung 1 chữ kí sẽ đc truy cập endpoint khác nhập thông qua bearer
        //con cái jwwtauthentication để converted chữ Scope thành chữ role của jwt cho dễ nhận bik thôi á mà
        //còn cái authenticationEntryPoint là để bắt lỗi token giả mạo hoặc là không đúng ( lỗi đặc biệt)
        httpSecurity.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(customJwtDecoder)
                .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
        );


        // enable CORS for frontend and disable CSRF for API
        httpSecurity.cors(cors -> {}) ;
        httpSecurity.csrf(AbstractHttpConfigurer::disable);

        return httpSecurity.build();
    }



    //cái JwtGranted thì gọi lúc bắt đầu hình thành token thường xài trong config
    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {

        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");
        jwtGrantedAuthoritiesConverter.setAuthoritiesClaimName("scope");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }


    // cái này giúp decoder cái token để xaif cho bearer truy cập endpoint k khai báo o tren
    @Bean
    JwtDecoder jwtDecoder() {
        SecretKeySpec  secretKey = new SecretKeySpec(signerKey.getBytes(), "HS512");
      return   NimbusJwtDecoder
              .withSecretKey(secretKey)
              .macAlgorithm(MacAlgorithm.HS512)
              .build();

    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    // Allow frontend dev server (localhost/127.0.0.1 on any port) to access APIs during development
    // and production domain
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOriginPattern("http://localhost:*");
        config.addAllowedOriginPattern("http://127.0.0.1:*");
        config.addAllowedOriginPattern("https://keygamezspace.space");
        config.addAllowedOriginPattern("https://www.keygamezspace.space");
        config.addAllowedOriginPattern("http://keygamezspace.space");
        config.addAllowedOriginPattern("http://www.keygamezspace.space");
        config.addAllowedOriginPattern("https://www.awstestgamexyz.space");
        config.addAllowedOriginPattern("https://awstestgamexyz.space");
        config.addAllowedOriginPattern("http://www.awstestgamexyz.space");
        config.addAllowedOriginPattern("http://awstestgamexyz.space");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
