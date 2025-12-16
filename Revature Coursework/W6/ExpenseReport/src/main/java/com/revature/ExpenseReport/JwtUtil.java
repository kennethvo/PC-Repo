package com.revature.ExpenseReport;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component  
public class JwtUtil {
    // Fields 
    private static final String secret = "thisIsMySuperSecretSecuritySecret";
    private static final SecretKey key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    private static final long expiration = 3600; // seconds/hour

    // Constructor

    // Methods
    public String generateToken(String username){
        return Jwts.builder()
            .subject(username)
            .issuedAt( new Date())
            .expiration(new Date(System.currentTimeMillis() + (expiration * 1000)))
            .signWith(key)
            .compact();
    }

    public boolean validateToken(String token){
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token); // throws exception if invalid
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token){
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();
    }
}
