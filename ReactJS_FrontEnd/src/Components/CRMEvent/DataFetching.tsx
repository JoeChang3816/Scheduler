import { useContext, useEffect } from "react";
import { EventTypeContext } from "../Context/EventTypeContext";
import { EventInterface, EventTypeInterface } from "./DBObjects";
import { GetEventAddress, GetEventTypesAddress } from "../../serverConfig";
import axios from "axios";
import { EventContext } from "../Context/EventContext";

export default function DataFetching(){

    const {eventTypes, addEventType} = useContext(EventTypeContext);
    const {events, setEvents} = useContext(EventContext);
    
     //Get data (eventTypes) from database 
    useEffect(() => {
            
        function fetchEventTypeData () {


        //Already done, everytime when you saved code, this useEffect will be triggered
        if( eventTypes.length > 0 ) return;
                    
            // Fetch data from the server when the component mounts
            const fetchData = async () => {
                
                try {
                const response = await axios.get<EventTypeInterface[]>(GetEventTypesAddress);

                    //Convert the objects array back to strings array, then pass to context.
                    response.data.map(iteratedEventType => addEventType(iteratedEventType.name));

                } catch (err) {
                    console.error(err);
                };

            }

            fetchData();
        }

        //--------------

        function fetchEventData(){

        //Already done, everytime when you saved code, this useEffect will be triggered
            if( events.length > 0 ) return;
                
            // Fetch data from the server when the component mounts
            const fetchData = async () => {
                
                try {
                const response = await axios.get<EventInterface[]>(GetEventAddress);
        
                setEvents(response.data);
        
                } catch (err) {
                    console.error(err);
                };

            }

            fetchData();    

        }

        //--------------

        fetchEventTypeData();
        fetchEventData();


    }, []);


    return(<></>)
}