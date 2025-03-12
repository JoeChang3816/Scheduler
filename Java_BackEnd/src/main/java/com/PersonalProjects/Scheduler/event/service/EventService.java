package com.PersonalProjects.Scheduler.event.service;

import java.util.Set;

import com.PersonalProjects.Scheduler.event.EventDTO;
import com.PersonalProjects.Scheduler.event.model.Event;

public interface EventService {
	
	public Event saveEvent(EventDTO event);
	
	public Set<Event> getAllEvent();

	void deleteEventById(int eventID) throws Exception;
	
	Event toggleDone(int eventId, boolean toggledDoneBoolean);
	
	Event updateEvent(int eventId, EventDTO updatedEventDTO);
}
