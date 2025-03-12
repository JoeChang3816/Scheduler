import { Divider, Title, Container, Group  } from '@mantine/core';

import { EventInterface } from "../CRMEvent/DBObjects";  // Adjust the import path as necessary
import EventCard from "./EventCard";

interface DateSlotProps {
    date: string;
    eventsProps: EventInterface[];
}

export default function DateSlot( {date, eventsProps}: DateSlotProps ) {

    //Sorting eventsProps by time in ascending order
    eventsProps.sort((a, b) => {

        const timeToMinutes = (time: string) => {

            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };
    
        const timeA = timeToMinutes(a.startDate.substring(11, 16));
        const timeB = timeToMinutes(b.startDate.substring(11, 16));
    
        //"05:22" becomes 5 * 60 + 22 = 322 minutes.
        //"17:22" becomes 17 * 60 + 22 = 1042 minutes.
        
        return timeA - timeB;

    });


    //Grouping eventsProps by their time
    const newEventList = 
    eventsProps.reduce((acc, event) => {

        const time = event.startDate.substring(11, 16);
        if (!acc[time]) {
            acc[time] = [];
        }
        acc[time].push(event);

        return acc;

    }, {} as { [time: string]: EventInterface[] });

        
    // newEventList = 
    // {
    //  "00:00": [
    //      { id: 1, startDate: "2024-08-01 00:00", name: "A" },
    //      { id: 2, startDate: "2024-08-01 00:00", name: "B" },
    //      { id: 4, startDate: "2024-08-01 00:00", name: "D" }
    //  ],
    //  "01:34": [
    //      { id: 3, startDate: "2024-08-01 01:34", name: "C" },
    //      { id: 5, startDate: "2024-08-01 01:34", name: "E" }
    //  ],
    //  Prop/key: Array
    // }


    //Not important, but this can make sure events with the same time can stay in the same position in a group
    //in new to old order
    //Its for when the user wants to delete the targeted within the targeted
    
    function DisplayEventCards ({time}: {time: string}) {

        newEventList[time].sort(
            
            (a, b) => {

                if (a.id === undefined) return 1;
                if (b.id === undefined) return -1;
                
                return b.id - a.id;
        
            });

        return(
            <>
                {
                    newEventList[time].map( (event) => (

                        <EventCard key={event.id} eventPara={event}/>
                        
                    )) 
                }
            </>
        )
    }

    return (
        
        <div>

            <Container fluid mb={20} >
                <Title c="dark.3" order={4} >{date}</Title>
            </Container>

            <Divider size="md" />

            {

                Object.keys(newEventList).map( (thisTime) => (

                    //bg="var(--mantine-color-green-light)"

                    <Group align="flex-start" key={thisTime} mt={30} mb={30} p={10} >
                        
                        <DisplayEventCards time={thisTime}/>

                    </Group>

                )


                )

            }

            

        
        </div>
    );

} 


