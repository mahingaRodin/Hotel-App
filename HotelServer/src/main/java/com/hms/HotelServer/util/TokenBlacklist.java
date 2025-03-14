package com.hms.HotelServer.util;

import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class TokenBlacklist {
    private final Set<String> blacklistedTokens = new HashSet<>();

    public boolean isBlacklisted(String jwt) {
        return blacklistedTokens.contains(jwt);
    }

    public void addToBlackList(String token) {
        blacklistedTokens.add(token);
    }

    public boolean isBlackListed(String jwt) {
        return blacklistedTokens.contains(jwt);
    }
}