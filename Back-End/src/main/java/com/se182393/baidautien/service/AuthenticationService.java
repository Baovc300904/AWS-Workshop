package com.se182393.baidautien.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.se182393.baidautien.dto.request.AuthenticationRequest;
import com.se182393.baidautien.dto.request.IntrospectRequest;
import com.se182393.baidautien.dto.request.LogoutRequest;
import com.se182393.baidautien.dto.request.RefreshRequest;
import com.se182393.baidautien.dto.response.AuthenticationResponse;
import com.se182393.baidautien.dto.response.IntrospectResponse;
import com.se182393.baidautien.entity.InvalidatedToken;
import com.se182393.baidautien.entity.User;
import com.se182393.baidautien.exception.AppException;
import com.se182393.baidautien.exception.ErrorCode;
import com.se182393.baidautien.repository.InvalidatedTokenRepository;
import com.se182393.baidautien.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;


@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    UserRepository userRepository;
    InvalidatedTokenRepository  invalidatedTokenRepository;



    @NonFinal
    @Value("${jwt.signerKey}")
    protected   String SIGNER_KEY;

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException,ParseException {
        var token = request.getToken();
        boolean isValid = true;

        try {
            verfiyToken(token);


        }catch (AppException e){

            return IntrospectResponse.builder()
                    .valid(false)
                    .build();
        }

        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }


    @Transactional(readOnly = true)
    public AuthenticationResponse authenticated(AuthenticationRequest request)  {

        var user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticated = passwordEncoder.matches(request.getPassword(),user.getPassword());

        if(!authenticated)
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        var signToken = verfiyToken(request.getToken());

        String jit = signToken.getJWTClaimsSet().getJWTID();
        Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(jit)
                .expiryTime(expiryTime)
                .build();

        invalidatedTokenRepository.save(invalidatedToken);
    }


    @Transactional(readOnly = true)
    public AuthenticationResponse refreshTokenn(RefreshRequest request) throws ParseException, JOSEException {
        var signJWT = verfiyToken(request.getToken());

        var jit = signJWT.getJWTClaimsSet().getJWTID();
        var expiryTime = signJWT.getJWTClaimsSet().getExpirationTime();


        InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                .id(jit)
                .expiryTime(expiryTime)
                .build();

        invalidatedTokenRepository.save(invalidatedToken);


        var username = signJWT.getJWTClaimsSet().getSubject();

        var user = userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)
        );

        var token = generateToken(user);

        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }


    private SignedJWT verfiyToken(String token) throws ParseException, JOSEException {



        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expityTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

       if (!(verified && expityTime.after(new Date())))
           throw new AppException(ErrorCode.UNAUTHORIZED);

     if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
         throw new AppException(ErrorCode.UNAUTHENTICATED);

        return  signedJWT;
    }

    private String generateToken(User user)  {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("minhkhoi.com")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope",buildScope(user))
                .build();


        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header,payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY));
            return jwsObject.serialize();
        }catch (JOSEException e){
            log.error("Cannot create token",e);
            throw new RuntimeException(e);
        }
    }


    private String buildScope(User user){

        //cái này là 1 dạng tiên tiến hơn của Set<String> thay vì phải ghi thẳng ra Set.of("ADMIN","USER"), thì chỉ cần ghi 1 dấu cách
        StringJoiner stringJoiner = new StringJoiner(" ");


        if(!CollectionUtils.isEmpty(user.getRoles()))
            user.getRoles().forEach(role-> {
                stringJoiner.add("ROLE_" +role.getName());
                if(!CollectionUtils.isEmpty(role.getPermissions()))
            role.getPermissions().forEach(permission -> stringJoiner.add(permission.getName()));
            });

        String scope = stringJoiner.toString();
        log.info("Final scope: {}", scope);
        return scope;
    }

}
