package com.PersonalProjects.Scheduler.eventType.service;

import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.PersonalProjects.Scheduler.eventType.EventTypeDTO;
import com.PersonalProjects.Scheduler.eventType.model.EventType;

@Service
public interface EventTypeService {
	
	public EventType saveEventType(EventTypeDTO eventTypeDTO) throws Exception;
	
	public List<EventType> getAllEventType();
	
	public void deleteEventTypeByName(String eventTypeNames);
}
