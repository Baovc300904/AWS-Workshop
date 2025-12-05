package com.se182393.baidautien.configuration;

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

import javax.crypto.spec.SecretKeySpec;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final String[] PUBLIC_ENDPOINTS = {"/users","/auth/log-in","/auth/introspect","/auth/logout","/auth/refresh","/users/forgot-password","/users/reset-password"};

    @Value("${jwt.signerKey}")
    private String signerKey;

    @Autowired
    private CustomJwtDecoder customJwtDecoder;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {

        httpSecurity.authorizeHttpRequests(request -> request.requestMatchers(HttpMethod.POST,PUBLIC_ENDPOINTS).permitAll()
                .requestMatchers(HttpMethod.POST,"/cart/**").permitAll()
                .requestMatchers(HttpMethod.POST,"/users/request-phone-otp").permitAll()
                .requestMatchers(HttpMethod.POST,"/email/request-otp").permitAll()
                .requestMatchers(HttpMethod.POST,"/payment/momo/create").permitAll()
                .requestMatchers(HttpMethod.POST,"/payment/momo/create-with-items").permitAll()
                .requestMatchers(HttpMethod.POST,"/payment/momo/callback").permitAll()
                .requestMatchers(HttpMethod.POST,"/payment/momo/test-success/**").permitAll()
                .requestMatchers(HttpMethod.POST,"/users/forgot-password/phone/**").permitAll()
                .requestMatchers(HttpMethod.POST,"/admin/games/**").permitAll()
                .requestMatchers(HttpMethod.PUT,"/admin/games/**").permitAll()
                .requestMatchers(HttpMethod.DELETE,"/admin/games/**").permitAll()
                .requestMatchers(HttpMethod.GET,"/maintenance/reseed-categories").permitAll()
                .requestMatchers(HttpMethod.POST,"/maintenance/reseed-categories").permitAll()
                .requestMatchers(HttpMethod.POST,"/ratings/**").permitAll()
                .requestMatchers(HttpMethod.GET,"/ratings/**").permitAll()
//                .requestMatchers(HttpMethod.GET,"/users").hasRole(Role.ADMIN.name())
                .requestMatchers(HttpMethod.GET,"/category","/category/**").permitAll()
                .requestMatchers(HttpMethod.GET,"/games","/games/**").permitAll()
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
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOriginPattern("http://localhost:*");
        config.addAllowedOriginPattern("http://127.0.0.1:*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
