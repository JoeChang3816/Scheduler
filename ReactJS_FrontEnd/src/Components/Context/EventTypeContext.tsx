import { createContext, useState } from "react";

export const EventTypeContext = createContext<{ eventTypes: string[], deletedEventTypes: string[], addEventType: (type: string) => void, resetEventTypes:(types: string[]) => void, addDeletedEventType:(type: string[]) => void  }>({
    eventTypes: [],
    deletedEventTypes: [],
    addEventType: () => {},
    resetEventTypes : () => {},
    addDeletedEventType: ()=>{}
  });
  

export function EventTypeContextProvider ({children}: any){

    //Share between AddEventForm.tsx and AddEventTypeForm.tsx
    const [eventTypes, setEventTypes] = useState<string[]>([]);
    const [deletedEventTypes, setDeletedEventTypes] = useState<string[]>([]);
    
    const addEventType = (newType: string ) => {
        setEventTypes(prevTypes => [...prevTypes, newType]);
    };

    //Mainly for deletion
    const resetEventTypes = (newTypeArray: string[]) =>{
        setEventTypes(newTypeArray);
    };

    //its string[] because in deleteEventTypeForm, "targets" is an array, not just one string
    const addDeletedEventType = (newDeletedTypes: string[]) => {

        newDeletedTypes.map( (type) => {

            setDeletedEventTypes(prevTypes => [...prevTypes, type]);
            
        }
    )
  }


  return (

    <EventTypeContext.Provider value={{eventTypes, deletedEventTypes, addEventType, resetEventTypes, addDeletedEventType}}>
        {children}
    </EventTypeContext.Provider>
  )

}