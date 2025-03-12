import { Card, Text, Badge, Group, Checkbox, Popover, Menu, ActionIcon, rem, Flex, Button  } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { EventInterface } from '../CRMEvent/DBObjects';
import { useContext, useEffect, useState } from 'react';
import { EventTypeContext } from '../Context/EventTypeContext'; 
import axios from 'axios';
import { catchErrorMessageHandling } from '../../catchErrorMessageHandling';
import { EventContext } from '../Context/EventContext';
import { DeleteEventAddress, EventDoneAddress } from '../../serverConfig';
import EditEventButton from '../CRMEvent/EditEventForm';
import { IconTrash } from '@tabler/icons-react';


interface EventCardProps {
  eventPara: EventInterface,
}

export default function EventCard ({eventPara}: EventCardProps){

  const { events, resetEvents} = useContext(EventContext);

  if(eventPara.types.length != 0){

    const { eventTypes, deletedEventTypes} = useContext(EventTypeContext);

    //EventCard needs update after every event Type deletion
    useEffect( ()=>{

      //event's string type array is not related to "eventTypes"
      //find a way to furthur delete event's string type array "effectively"
      const updatedTypes = thisTypes.filter(type => !deletedEventTypes.includes(type));

      setThisTypes(updatedTypes); //To trigger component re-render, it needs useState

    }, [eventTypes])

  }
  
  const [thisTypes, setThisTypes] = useState< string[] > (eventPara.types);

  const [done, setDone] = useState<boolean>(eventPara.isDone);

  function Time(){


    let startTime = eventPara.startDate.substring(11, 19);
    
    //No endDate
    if(eventPara.endDate == null || eventPara.endDate == ''){

      return(
        <>
          <Group mt="xs" justify="space-between">
            <Text mt="xs" c="dimmed" size='xs'>Start</Text>
            <Text mt="xs" size='md' c={done? "dimmed" : undefined}>{startTime}</Text>
          </Group>
        </>
      )
    }

    let endTime = eventPara.endDate.substring(11, 19);
  
    return(
      <>

      <Group mt="xs" justify="space-between">
        <Text mt="xs" c="dimmed" size='xs'>Start</Text>
        <Text mt="xs" size='md' c={done? "dimmed" : undefined}>{startTime}</Text>
      </Group>

      <Group justify="space-between">
        <Text mt="xs" c="dimmed" size='xs'>End</Text>
        <Text mt="xs" size='md' c={done? "dimmed" : undefined}>{endTime}</Text>
      </Group>

      </>)

  }

  function Type(){
          
      return(
        <>
          {thisTypes.length > 0 && (
            <Text mt="xs" c="dimmed" size='xs' >Type</Text>
          )}

          {
            thisTypes.map(type => {

              return <Text key={type} c={done? "dimmed" : undefined}> {type} </Text>;
              
            })
          }

        </>
      )
  }

  async function handleDoneOnChange(){

    try{

      //The second parameter is null because I am not sending a request body.
      await axios.post(EventDoneAddress, null, { params:{check: !done, id: eventPara.id} });
      console.log(eventPara.name, "checked: ", !done)
      setDone(!done)

    }catch(err){

      catchErrorMessageHandling(err);

    }

  }


  async function confirmDeletion(){

    try{
      
      await axios.delete(DeleteEventAddress, {params:{eventID: eventPara.id} })
      resetEvents(events.filter( (event) => event.id !== eventPara.id));

    }catch(err){
      catchErrorMessageHandling(err);

    }
    
  }


    return (
      <>
        <Card shadow="md" radius="md" padding="xs" >


            <Badge fullWidth tt="none" color={eventPara.colorHex} radius="sm" size="xl">
              <Text td={done ? 'line-through' : undefined}>{eventPara.name}</Text>
            </Badge>
          
            <Time/>

            <Type/>

            <Group justify="space-between" mt="xl">

              <Checkbox
              label={done ? 'Done' : undefined}
              color="gray" 
              checked={done}
              onChange={handleDoneOnChange}/>

              <Text c="dimmed" size='xs' ta="right">{eventPara.id}</Text>

            </Group>

            <Group justify="space-between" mt="md">
              
              <ActionIcon size="xs" color="rgba(148, 148, 148, 1)"  variant="subtle">

                <EditEventButton preFill={eventPara} ></EditEventButton>

              </ActionIcon>

              <Popover position="bottom" withArrow shadow="md">

                <Popover.Target>
                  <ActionIcon size="xs" color="rgba(148, 148, 148, 1)"  variant="subtle">
                    <IconTrash></IconTrash>
                  </ActionIcon>                
                </Popover.Target>

                <Popover.Dropdown>
                  <Text size="xs">Delete confirm ?</Text>
                    <Button onClick={confirmDeletion} mt="sm" variant="default">Yes</Button>
                </Popover.Dropdown>
                
              </Popover>

            </Group>


            
        </Card>

      </>
    )
  }
  
  