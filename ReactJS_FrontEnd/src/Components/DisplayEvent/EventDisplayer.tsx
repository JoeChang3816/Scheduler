import { useContext, useEffect, useState } from "react";
import { EventContext } from "../Context/EventContext"; 
import { EventInterface } from "../CRMEvent/DBObjects";
import DateSlot from "./DateSlot";
import { Container } from "@mantine/core";

export default function EventDisplayer (){

    const { events } = useContext(EventContext)

    const [dates, setDates] = useState<string[]>([]);

    const [eventsByDate, setEventsByDate] = useState<{ [key: string]: EventInterface[] }>({});
    
    useEffect(()=>{

        if(events.length <= 0) return;
        
        console.log("event list:", events)
        console.log("now adding new date slots");

        //Set is to remove duplicates dates
        const uniqueDates = Array.from(new Set(events.map(event => event.startDate.substring(0, 10))));

        //Sorting time in ascending order
        uniqueDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        //This won't cause loop beacause the dependcy is "events". not "dates"
        setDates( uniqueDates );

        const groupedEvents = uniqueDates.reduce((dates, date) => {
            dates[date] = events.filter(event => event.startDate.substring(0, 10) === date);
            return dates;

            //dates = [key: string]: EventInterface[], formart are defined below
        }, {} as { [key: string]: EventInterface[] });

        setEventsByDate(groupedEvents);

    },[events]);

    //1: extracting the dates(string) from all of the events
    //2: removing duplicated dates by using Sets
    //3: sorting the dates in ascending order
    //4: grouping the events by their start date

    //5: storing the grouped events into eventsByDate[]

    //Note: eventsByDate[date] = array of corresponding events,
    //      those events will be sorted by "time" in DateSlot
    
return (

    <>
        {dates.map(date => (

        //bg="var(--mantine-color-pink-light)"
        <Container key={date} fluid >

            <DateSlot key={date} date={date} eventsProps={eventsByDate[date]} />

        </Container>

        ))}

    </>
)

}