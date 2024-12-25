package com.hms.HotelServer.services.auth;

import com.hms.HotelServer.dto.SignupRequest;
import com.hms.HotelServer.dto.UserDto;

public interface AuthService {

    UserDto createUser(SignupRequest signupRequest);
}
