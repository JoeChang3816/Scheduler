package com.PersonalProjects.Scheduler.event.controller;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.PersonalProjects.Scheduler.event.EventDTO;
import com.PersonalProjects.Scheduler.event.model.Event;
import com.PersonalProjects.Scheduler.event.service.EventServiceImp;

//Mapping all Https methods

@RestController
@RequestMapping("/event")
@CrossOrigin
public class EventController {
	
	@Autowired
	private EventServiceImp ES;
	
	@PostMapping("/add")
	public ResponseEntity<Event> add(@RequestBody EventDTO eventDTO){
		
		Event savedEvent = ES.saveEvent(eventDTO);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(savedEvent);
		
	}
	
	@PostMapping("/checkDone")
	public ResponseEntity<Event> checkedDone(@RequestParam("check") boolean toggledDoneBoolean, 
											 @RequestParam("id") int eventID){
		
		Event updatedEvent = ES.toggleDone(eventID, toggledDoneBoolean);
		
		return ResponseEntity.ok(updatedEvent);
		
	}

	@GetMapping("/getAll")
	public Set<Event> getAllEvent(){
		
		return ES.getAllEvent();	
	}
	
	@PutMapping("/updateEvent")
	public ResponseEntity<Event> updateEvent(@RequestParam("id") int eventID,
											@RequestBody EventDTO updatedEventDTO){
		
		Event updatedEvent = ES.updateEvent(eventID, updatedEventDTO);
		
		return ResponseEntity.ok(updatedEvent);
	}
	
	
	@Transactional
	@DeleteMapping("/delete")
	public ResponseEntity<Object> deleteEvent(@RequestParam("eventID") int eventID){
		
		try {
			ES.deleteEventById(eventID);
			return ResponseEntity.ok().build();
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
		
	}
}
