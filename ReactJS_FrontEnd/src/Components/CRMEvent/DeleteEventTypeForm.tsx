import '@mantine/dates/styles.css'
import classes from '../../CSS/button.module.css';

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { DeleteEventTypesAddress } from '../../serverConfig.tsx';

import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button, Center, MultiSelect, Group, Container, Notification, Transition, Popover, Text} from '@mantine/core';
import { useForm, isNotEmpty } from '@mantine/form';

import {IconPlaylistX} from "@tabler/icons-react"

import { EventTypeContext } from '../Context/EventTypeContext.tsx';
import { catchErrorMessageHandling } from '../../catchErrorMessageHandling.tsx';


export default function DeleteEventTypeButton (){

    const notifyShowTime:number = 16000;  // Show notification for 3 seconds

    const form = useForm({
      initialValues: {
        eventTypeName: []
      },

      validate:{
        eventTypeName: isNotEmpty()
      }

    });

    const [formToggle, { open: formOpen, close: formClose }] = useDisclosure(false);

    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notificationMessage, setNotificationMessage] = useState("");

    const { eventTypes, resetEventTypes, addDeletedEventType } = useContext(EventTypeContext);

    const deleteEventTypeDB = async (e: React.MouseEvent<HTMLButtonElement>) => {

        e.preventDefault();
        
        form.validate();

        if(!form.isValid()){
          return ;
        }
          
        const targets = form.getInputProps('eventTypeName').value;

        const encodedNames = targets.map((name: string) => encodeURIComponent(name));

        const queryString = encodedNames.map((name: string) => `eventTypeName=${name}`).join('&');
        //eventTypeName=Testing&eventTypeName=Life%20Goal
                
        try {

          await axios.delete(DeleteEventTypesAddress + "?" + queryString);

          //Update Local state (remove targeted types from state)
          const updatedEventTypes = eventTypes.filter(eventType => !targets.includes(eventType));
          
          addDeletedEventType(targets);
          
          resetEventTypes(updatedEventTypes);
          
          form.reset();
          // Sets initial values, used when form is reset
          form.setInitialValues({eventTypeName: []});

          setNotificationMessage("Event type " + targets + " deleted");

        } catch (error) {
          
          catchErrorMessageHandling(error, setNotificationMessage);

        }

          setShowNotification(true);

      }



    // That little Icon appears on the main page
    function IconButton () {

      const [iconNameToggle, { close, open }] = useDisclosure(false);

      return (
          <Popover position="top" withArrow shadow="md" opened={iconNameToggle}>
              <Popover.Target>
                  <Button className={classes.MenuButtons} onClick={formOpen} onMouseEnter={open} onMouseLeave={close}> 
                      <IconPlaylistX stroke={1.75} size={30}/>
                  </Button>
              </Popover.Target>
              <Popover.Dropdown style={{ pointerEvents: 'none' }}>
                  <Text size="sm">Delete Event Type</Text>
              </Popover.Dropdown>
          </Popover>

      )
    }

    useEffect(() => {
        if (showNotification) {
            const timer = setTimeout(() => { setShowNotification(false) }, notifyShowTime);

            return () => clearTimeout(timer);
        }

    }, [showNotification]);



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
              <Drawer.Header><h1>Delete Event Types</h1></Drawer.Header>
            </Center>

            <form onSubmit={form.onSubmit((values) => console.log(values))}>
              
            <MultiSelect

                label="Event Type(s)"
                data={eventTypes}

                clearable
                searchable
                hidePickedOptions

                key={form.key('eventTypeName')}
                {...form.getInputProps('eventTypeName')}
                >
                  
                </MultiSelect>     

              <Group justify="flex-end" mt="md" mb="md">
                <Button className={classes.FormButton} onClick={ deleteEventTypeDB } type="submit">Submit</Button>
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