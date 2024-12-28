package com.hms.HotelServer.controller.admin;

import com.hms.HotelServer.dto.RoomDto;
import com.hms.HotelServer.services.admin.rooms.RoomsService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class RoomsController {

    private final RoomsService roomsService;

    @PostMapping("/room")
    public ResponseEntity<?> postRoom(@RequestBody RoomDto roomDto) {
        boolean success = roomsService.postRoom(roomDto);
        if(success) {
            return ResponseEntity.status(HttpStatus.OK).build();
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/rooms/{pageNumber}")
    public ResponseEntity<?> getAllRooms(@PathVariable int pageNumber) {
        return ResponseEntity.ok(roomsService.getAllRooms(pageNumber));

    }

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
