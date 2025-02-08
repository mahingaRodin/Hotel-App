package com.hms.HotelServer.services.admin.reservation;

import com.hms.HotelServer.dto.ReservationResponseDto;

public interface ReservationService {
    ReservationResponseDto getAllReservations(int pageNumber);
    boolean changeReservationStatus(Long id , String status);
}
