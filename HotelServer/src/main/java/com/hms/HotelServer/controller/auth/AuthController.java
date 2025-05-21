package com.hms.HotelServer.controller.auth;

import com.hms.HotelServer.dto.AuthenticationRequest;
import com.hms.HotelServer.dto.AuthenticationResponse;
import com.hms.HotelServer.dto.SignupRequest;
import com.hms.HotelServer.dto.UserDto;
import com.hms.HotelServer.entity.User;
import com.hms.HotelServer.repository.UserRepository;
import com.hms.HotelServer.services.auth.AuthService;
import com.hms.HotelServer.services.jwt.UserService;
import com.hms.HotelServer.util.JwtUtil;
import com.hms.HotelServer.dto.LogoutRequest;
import com.hms.HotelServer.util.TokenBlacklist;
import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private  final UserService userService;
    private final TokenBlacklist tokenBlacklist;

    @PostMapping("/signup")
    public ResponseEntity<?> signupUser(@RequestBody SignupRequest signupRequest) {
            try {
                UserDto createdUser = authService.createUser(signupRequest);
                return new ResponseEntity<>(createdUser, HttpStatus.OK);
            } catch (EntityExistsException entityExistsException) {
                return new ResponseEntity<>("User Already Exists!", HttpStatus.NOT_ACCEPTABLE);
            } catch (Exception e) {
                return new ResponseEntity<>("User Not Created. Please try again later", HttpStatus.BAD_REQUEST);
            }
    }

    @PostMapping("/login")
    public AuthenticationResponse createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(), authenticationRequest.getPassword()));
        } catch (BadCredentialsException e) {
            throw  new BadCredentialsException("Incorrect username or password");
        }

        final UserDetails userDetails = userService.userDetailsService().loadUserByUsername(authenticationRequest.getEmail());

        Optional<User> optionalUser = userRepository.findFirstByEmail(userDetails.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);

        AuthenticationResponse authenticationResponse = new AuthenticationResponse();

        if(optionalUser.isPresent()) {
            authenticationResponse.setJwt(jwt);
            authenticationResponse.setUserRole(optionalUser.get().getUserRole());
            authenticationResponse.setUserId(optionalUser.get().getId());
        }
        return ResponseEntity.ok(authenticationResponse).getBody();
    }

    @PostMapping("logout")
    public ResponseEntity<?> logoutUser(@RequestBody LogoutRequest logoutRequest) {
        String token = logoutRequest.getToken();
        tokenBlacklist.addToBlackList(token);
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logout Successful!");
    }
}
