package com.hms.HotelServer.services.auth;


import com.hms.HotelServer.dto.SignupRequest;
import com.hms.HotelServer.dto.UserDto;
import com.hms.HotelServer.entity.User;
import com.hms.HotelServer.enums.UserRole;
import com.hms.HotelServer.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements  AuthService{
    private  final UserRepository userRepository;


    @PostConstruct
    public void createAnAdminAccount() {
        Optional<User> adminAccount = userRepository.findByUserRole(UserRole.ADMIN);
        if(adminAccount.isEmpty()) {

            User user = new User();
            user.setEmail("amdin@test.com");
            user.setName("Admin");
            user.setUserRole(UserRole.ADMIN);
            user.setPassword(new BCryptPasswordEncoder().encode("admin"));
            userRepository.save(user);
            System.out.println("Admin account created successfully");

        } else {
            System.out.println("Admin account already exist");
        }
    }



    public UserDto createUser(SignupRequest signupRequest) {
        if(userRepository.findFirstByEmail(signupRequest.getEmail()).isPresent()) {
            throw new  EntityExistsException("User Already Present With Email" + signupRequest.getEmail());
        }

        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setName(signupRequest.getName());
        user.setUserRole(UserRole.CUSTOMER);
        user.setPassword(new BCryptPasswordEncoder().encode(signupRequest.getPassword()));
        User createdUser = userRepository.save(user);
        return createdUser.getUserDto();
    }

}
