package com.hms.HotelServer.services.customer.room;

import com.hms.HotelServer.dto.RoomsResponseDto;

public interface RoomService {
    RoomsResponseDto getAvailableRooms(int pageNumber);
}
