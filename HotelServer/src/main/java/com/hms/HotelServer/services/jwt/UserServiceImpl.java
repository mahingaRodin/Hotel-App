package com.hms.HotelServer.services.jwt;

import com.hms.HotelServer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private  final UserRepository userRepository;

    public UserDetailsService userDetailsService() {
        return username -> userRepository.findFirstByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}