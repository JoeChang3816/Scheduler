package com.PersonalProjects.Scheduler.event.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import com.PersonalProjects.Scheduler.event.model.Event;

public interface EventRepos extends JpaRepository<Event, Integer>{
	
	Event findById(int eventId);
	
	public void deleteEventById(int eventId);
	}
 