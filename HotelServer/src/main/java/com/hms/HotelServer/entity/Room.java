package com.hms.HotelServer.entity;

import com.hms.HotelServer.dto.RoomDto;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String type;
    private Long price;
    private Boolean available;


    public RoomDto getRoomDto() {
        RoomDto roomDto = new RoomDto();

        roomDto.setId(id);
        roomDto.setName(name);
        roomDto.setType(type);
        roomDto.setAvailable(available);
        roomDto.setPrice(price);

        return roomDto;
    }
}
