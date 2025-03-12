package com.PersonalProjects.Scheduler.eventType.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.PersonalProjects.Scheduler.eventType.EventTypeDTO;
import com.PersonalProjects.Scheduler.eventType.model.EventType;
import com.PersonalProjects.Scheduler.eventType.service.EventTypeServiceImp;

import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/eventtype")
@CrossOrigin(origins = "http://localhost:5173")
public class EventTypeController {
	
	@Autowired
	private EventTypeServiceImp ES;
	
	@PostMapping("/add")
	public ResponseEntity<Object> add(@RequestBody EventTypeDTO eventTypeDTO){
		
		try {		
			EventType newType = ES.saveEventType(eventTypeDTO);
			return ResponseEntity.status(HttpStatus.CREATED).body(newType);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	
	}
	
	@GetMapping("/getAll")
	public List<EventType> getAllEventType(){
		
		return ES.getAllEventType();	
	}
	
    @Transactional
	@DeleteMapping("/delete")
	public ResponseEntity<?> deleteEventType(@RequestParam("eventTypeName") List<String> eventTypeNames) {
		
		try {
			eventTypeNames.forEach(eventTypeName -> {
                ES.deleteEventTypeByName(eventTypeName);
            });
			
            return ResponseEntity.ok().build();
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting event types: " + e.getMessage());
        }
    }
	
}
