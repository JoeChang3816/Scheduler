package com.PersonalProjects.Scheduler.event.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.PersonalProjects.Scheduler.event.EventDTO;
import com.PersonalProjects.Scheduler.event.model.Event;
import com.PersonalProjects.Scheduler.event.repos.EventRepos;
import com.PersonalProjects.Scheduler.eventType.model.EventType;
import com.PersonalProjects.Scheduler.eventType.repos.EventTypeRepos;

@Service
public class EventServiceImp implements EventService{

	@Autowired
	private EventRepos ER;
	
	@Autowired
	private EventTypeRepos ETR;
		
	@Override
	public Event saveEvent(EventDTO eventDTO) {
		
		Event newEvent = new Event();
		
		newEvent.setName(eventDTO.getName());
		newEvent.setStartDate(eventDTO.getStartDate());

		if(eventDTO.getEndDate() == "") {
			newEvent.setEndDate(null);
		}else {
			newEvent.setEndDate(eventDTO.getEndDate());
		}
		
		newEvent.setColorHex(eventDTO.getColorHex());
		newEvent.setIsDone(eventDTO.getIsDone());
	
		newEvent.setTypes(stringSetToEventTypeSet(eventDTO.getTypes()));
		
		return ER.save(newEvent);
		
	}
	
	@Override
	public Set<Event> getAllEvent() {
		
		return new HashSet<>(ER.findAll());
	}

	@Transactional
	public void deleteEventById(int eventID) throws Exception{
		
		if(ER.findById(eventID) != null) {
			ER.deleteById(eventID);
			
		}else {
			
			throw new Exception("Event doesn't exist in database");
		}
	}
	
	public Event toggleDone(int eventId, boolean toggledDoneBoolean) {
		
		 Event updatedEvent = ER.findById(eventId);
		 updatedEvent.setIsDone(toggledDoneBoolean);
		
		return ER.save(updatedEvent);
	}
	
	public Event updateEvent(int eventId, EventDTO updatedEventDTO) {
		
		 Event updatedEvent = ER.findById(eventId);
		 
		 updatedEvent.setName(updatedEventDTO.getName());

		 
		 updatedEvent.setStartDate(updatedEventDTO.getStartDate());
		 updatedEvent.setEndDate(updatedEventDTO.getEndDate());

		 updatedEvent.setIsDone(updatedEventDTO.getIsDone());
		 
		 updatedEvent.setTypes(stringSetToEventTypeSet(updatedEventDTO.getTypes()));
		 
		 updatedEvent.setColorHex(updatedEventDTO.getColorHex());
		 
		return ER.save(updatedEvent);
	}
	
	
	public Set<EventType> stringSetToEventTypeSet (Set<String> Types) {
		
		//String[] to Set<EventType>
		Set<EventType> eventTypes = new HashSet<>();
				
			for (String typeName : Types) {
				EventType eventType = ETR.findByName(typeName);
				eventTypes.add(eventType);
			}
				
		return eventTypes;
	}


}
