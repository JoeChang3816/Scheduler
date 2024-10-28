package com.PersonalProjects.Scheduler.eventType.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.PersonalProjects.Scheduler.eventType.EventTypeDTO;
import com.PersonalProjects.Scheduler.eventType.model.EventType;
import com.PersonalProjects.Scheduler.eventType.repos.EventTypeRepos;


@Service
public class EventTypeServiceImp implements EventTypeService{

	@Autowired
	private EventTypeRepos ER;
	
	@Override
	public EventType saveEventType(EventTypeDTO eventTypeDTO) throws Exception {
        
		EventType newEventType = new EventType();
		
		if (ER.existsByName(eventTypeDTO.getName())) {
            throw new Exception("Type already exists in Database");
        }
		
		newEventType.setName(eventTypeDTO.getName());
		
		return ER.save(newEventType);
	}
	
	public List<EventType> getAllEventType() {
		// TODO Auto-generated method stub
		return ER.findAll();
	}
	
    @Transactional
	public void deleteEventTypeByName(String eventTypeNames) {
	
			ER.deleteByName(eventTypeNames);
			
		}
	}

