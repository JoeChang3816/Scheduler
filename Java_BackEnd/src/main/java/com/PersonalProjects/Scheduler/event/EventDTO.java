package com.PersonalProjects.Scheduler.event;

import java.util.Set;

//DTO is used for capturing the data from form submission.
public class EventDTO {
		
	private String name;

	private String startDate;	
	
	private String endDate ;
	
	private String colorHex ;		
	private Boolean isDone;
	
	private Set<String> types;
	
//-------------------------------------
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
//-------------------------------------

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String StringDate) {
		this.startDate = StringDate;
	}

//-------------------------------------

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String StringDate) {
		this.endDate = StringDate;
	}
	
//-------------------------------------


	public String getColorHex() {
		return colorHex;
	}

	public void setColorHex(String colorHex) {
		this.colorHex = colorHex;
	}
	
//-------------------------------------


	public Boolean getIsDone() {
		return isDone;
	}

	public void setIsDone(Boolean isDone) {
		this.isDone = isDone;
	}
	
//-------------------------------------


	public Set<String> getTypes() {
		return types;
	}

	public void setTypes(Set<String> eventTypeNames) {
		this.types = eventTypeNames;
	}

//-------------------------------------


}
