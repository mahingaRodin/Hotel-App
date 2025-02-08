package com.hms.HotelServer.services.customer.booking;

import com.hms.HotelServer.dto.ReservationDto;
import com.hms.HotelServer.dto.ReservationResponseDto;

public interface BookingService {
    boolean postReservation(ReservationDto reservationDto);
    ReservationResponseDto getAllReservationByUserId(Long userId, int pageNumber);
}
