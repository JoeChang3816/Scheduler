package com.PersonalProjects.Scheduler.eventType.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.PersonalProjects.Scheduler.eventType.model.EventType;

public interface EventTypeRepos extends JpaRepository<EventType, Integer>{
	
	//Check if there is duplicated type
	boolean existsByName(String name);
	
    EventType findByName(String name);
    
    void deleteByName(String name);
}
