import { createContext, Dispatch, SetStateAction, useState } from "react";
import { EventInterface } from "../CRMEvent/DBObjects";

export const EventContext = createContext<{ events: EventInterface[], addEvent:(event:EventInterface)=> void, resetEvents:(newEventArray: EventInterface[])=>void, setEvents:Dispatch<SetStateAction<EventInterface[]>> }>({
  events: [],
  addEvent: ()=> {},
  resetEvents: () => {},
  setEvents: ()=>{}
});

export default function EventContextProvider ({children}: any){

    const [events, setEvents] = useState<EventInterface[]>([]);

    const addEvent = (newEvent: EventInterface) => {
      setEvents(prevEvent => [...prevEvent, newEvent])
    }
  
    //Mainly for deletion
    const resetEvents = (newEventArray: EventInterface[]) =>{
      setEvents(newEventArray);
    };

    return (

        <EventContext.Provider value={ {events, addEvent, resetEvents, setEvents} }>
            {children}
        </EventContext.Provider>
      )
      
}

