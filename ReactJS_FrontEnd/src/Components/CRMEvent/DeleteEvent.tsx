import '@mantine/dates/styles.css'
import classes from '../../CSS/button.module.css';

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { DeleteEventAddress } from '../../serverConfig.tsx';

import { useDisclosure } from '@mantine/hooks';
import { NumberInput, Drawer, Button, Center, TextInput, Group, Container, Notification, Transition, Popover, Text} from '@mantine/core';
import { useForm, isNotEmpty } from '@mantine/form';

import {IconCalendarX} from "@tabler/icons-react"

import { catchErrorMessageHandling } from '../../catchErrorMessageHandling.tsx';
import { EventContext } from '../Context/EventContext.tsx';


export default function DeleteEventForm(){

    const notifyShowTime:number = 16000;  // Show notification for 3 seconds

    const form = useForm({
      initialValues: {
        eventID: ''
      },

      validate:{
        eventID: isNotEmpty(),
      }

    });

    const [formToggle, { open: formOpen, close: formClose }] = useDisclosure(false);

    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notificationMessage, setNotificationMessage] = useState("");

    const { events, resetEvents } = useContext(EventContext);

    //----------------------------------------------------------------------

    useEffect(() => {
      if (showNotification) {
          const timer = setTimeout(() => { setShowNotification(false) }, notifyShowTime);
  
          return () => clearTimeout(timer);
      }
  
    }, [showNotification]);
    
  //----------------------------------------------------------------------

    async function HandleDeleteEvent () {

      form.validate()

      if(!form.isValid()){
        return ;
      }

      try{
        
        await axios.delete(DeleteEventAddress, {params:{eventID: form.getInputProps('eventID').value} });

        const updatedEvents = events.filter(event => event.id != form.getInputProps('eventID').value);
        
        resetEvents(updatedEvents);

        form.reset();
        // Sets initial values, used when form is reset
        form.setInitialValues({eventID: ''});

        setNotificationMessage("Event Deleted.");

      }catch(error){

        catchErrorMessageHandling(error, setNotificationMessage);

      }  
      
      setShowNotification(true);

    }
    
//----------------------------------------------------------------------

    function IconButton () {

        const [iconNameToggle, { close, open }] = useDisclosure(false);
  
        return (
            <Popover position="top" withArrow shadow="md" opened={iconNameToggle}>
                <Popover.Target>
                    <Button className={classes.MenuButtons} onClick={formOpen} onMouseEnter={open} onMouseLeave={close}> 
                        <IconCalendarX stroke={1.75} size={30}/>
                    </Button>
                </Popover.Target>
                <Popover.Dropdown style={{ pointerEvents: 'none' }}>
                    <Text size="sm">Delete Event</Text>
                </Popover.Dropdown>
            </Popover>
  
        )
      }

  //----------------------------------------------------------------------


    return(

        <>
        
        <Drawer.Root
        position="right"
        opened={formToggle}
        onClose={formClose}
        offset={20}
    >

      <Drawer.Overlay />
      
        <Drawer.Content>
          
          <Container>

            <Center>
              <Drawer.Header><h1>Delete Event</h1></Drawer.Header>
            </Center>

            <form onSubmit={form.onSubmit((values) => console.log(values))}>
              
                <NumberInput     
                  withAsterisk                  
                  hideControls 

                  key={form.key('eventID')}
                  {...form.getInputProps('eventID')}

                  label="Event ID"                  
                  
                />

              <Group justify="flex-end" mt="md" mb="md">
                <Button className={classes.FormButton} onClick={ HandleDeleteEvent } type="submit">Submit</Button>
              </Group>

              <Group>
                <Transition
                    mounted={showNotification}  //true = showup ani or false = disapear ani
                    transition="fade"
                    duration={100}
                    timingFunction="ease"
                >
                    {
                        (transitionStyle)=>(
                            <Notification 
                                withBorder 
                                withCloseButton={false} 
                                radius="lg" 
                                px={30} 
                                h={60}
                                style={{...transitionStyle}}
                                onClose={()=>setShowNotification(false)}
                            >
                            
                                {notificationMessage}
                                
                            </Notification>
                        )
                    }
              
                 </Transition>

              </Group>
      
            </form>

          </Container>

        </Drawer.Content>
      
    </Drawer.Root>

    <IconButton></IconButton>
        
        </>
    )
    
}