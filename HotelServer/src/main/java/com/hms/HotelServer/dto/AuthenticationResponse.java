package com.hms.HotelServer.dto;

import com.hms.HotelServer.enums.UserRole;
import lombok.Data;

@Data
public class AuthenticationResponse {
   private String jwt;
   private Long userId;
   private UserRole userRole;

}
