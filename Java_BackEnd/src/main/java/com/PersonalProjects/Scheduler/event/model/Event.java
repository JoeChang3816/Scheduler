package com.PersonalProjects.Scheduler.event.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.PersonalProjects.Scheduler.eventType.model.EventType;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;

//Model folder create all entities, getter setter and constructor 

@Entity
public class Event {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	private String name;

	//When fetching, turn the format from Array format to string format
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm a")
	private LocalDateTime startDate;	
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm a")
	private LocalDateTime endDate ;
	
	private String colorHex ;		
	private Boolean isDone;			
	
	@ManyToMany
	@JoinTable(
			name = "event_type_table", 
			joinColumns = @JoinColumn(name= "event_id"),
			inverseJoinColumns = @JoinColumn(name="type_id")
			)
	private Set<EventType> types;
	
	
	//---------------

	public Event() {
	}
	
	//---------------
			
	public int getId() {
			
		return this.id;
	}

	//---------------
	
	public void setTypes(Set<EventType> eventTypeList) {
			
		this.types = eventTypeList;
	}
		
	public Set<String> getTypes() {
		
		Set<String> result = new HashSet<>();
		
		for(EventType type : this.types) {
			result.add(type.getName());
		}
		
		return result;
	}

	//---------------
	

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	//---------------

	public LocalDateTime getStartDate() {
		return startDate;
	}

	public void setStartDate(String StringDate) {
		
		this.startDate = LocalDateTime.parse(StringDate);
		
	}
	
	//---------------
	
	public LocalDateTime getEndDate() {
		return endDate;
	}

	public void setEndDate(String StringDate) {
		
		//Sometimes the endDate is empty
		if(StringDate != null && !StringDate.isEmpty()) {
			this.endDate = LocalDateTime.parse(StringDate);
		}else {
			this.endDate = null;
		}

	}

	//---------------
	
	public String getColorHex() {
		return colorHex;
	}

	public void setColorHex(String colorHex) {
		this.colorHex = colorHex;
	}
	
	//---------------

	public Boolean getIsDone() {
		return isDone;
	}

	public void setIsDone(Boolean isDone) {
		this.isDone = isDone;
	}
	

}
