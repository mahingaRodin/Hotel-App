package com.hms.HotelServer.controller.customer;


import com.hms.HotelServer.services.admin.rooms.RoomsService;
import com.hms.HotelServer.services.customer.room.RoomService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/customer")
public class RoomController {
    private final RoomService roomService;
    private final RoomsService roomsService;


    @GetMapping("/rooms/{pageNumber}")
    public ResponseEntity<?> getAvailableRooms(@PathVariable int pageNumber) {
        return ResponseEntity.ok(roomService.getAvailableRooms(pageNumber));
    }
    @GetMapping("/get-room/{id}")
    public ResponseEntity<?> getRoomById(@PathVariable Long id) {
        try{
            return ResponseEntity.ok(roomsService.getRoomById(id));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went Wrong!");
        }
    }
}
