package com.hms.HotelServer.dto;

import com.hms.HotelServer.enums.UserRole;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String email;
    private String name;
    private UserRole userRole;
}