import '@mantine/dates/styles.css'
import classes from '../../CSS/button.module.css';

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import {AddEventTypeAddress} from '../../serverConfig.tsx'

import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button, Center, TextInput, Group, Container, Notification, Transition, Popover, Text} from '@mantine/core';
import { useForm, isNotEmpty } from '@mantine/form';

import {IconPlaylistAdd} from "@tabler/icons-react"

import { EventTypeContext } from '../Context/EventTypeContext.tsx';

import { catchErrorMessageHandling } from '../../catchErrorMessageHandling.tsx';

export default function AddEventTypeButton (){

    const notifyShowTime:number = 3000;  // Show notification for 3 seconds

    const form = useForm({

      initialValues:{
        eventTypeName: ''
      },

      validate:{
        eventTypeName: isNotEmpty('Must be filled')
      }

    });

    const { addEventType } = useContext(EventTypeContext);

    const [formToggle, { open: formOpen, close: formClose }] = useDisclosure(false);

    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [notificationMessage, setNotificationMessage] = useState<string>("");

    function IconButton () {

        const [iconNameToggle, { close, open }] = useDisclosure(false);

        return (
            <Popover position="top" withArrow shadow="md" opened={iconNameToggle}>
                <Popover.Target>
                    <Button className={classes.MenuButtons} onClick={formOpen} onMouseEnter={open} onMouseLeave={close}> 
                        <IconPlaylistAdd stroke={1.75} size={30}/>
                    </Button>
                </Popover.Target>
                <Popover.Dropdown style={{ pointerEvents: 'none' }}>
                    <Text size="sm">Add Event Type</Text>
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

    const addEventTypeDB = async (e: React.MouseEvent<HTMLButtonElement> ) => {

        e.preventDefault();
        
        form.validate();

        if(!form.isValid()){
          return ;
        }

        const DTO = {
          name: form.getInputProps("eventTypeName").value
        };

        try {
          
          await axios.post(AddEventTypeAddress,  DTO );

          //Context
          addEventType(form.getInputProps("eventTypeName").value);

          setNotificationMessage("Type " + DTO.name + " Added !");
          
        } catch (error) {

          catchErrorMessageHandling(error, setNotificationMessage);
        
        }

      setShowNotification(true);

    }
    

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
              <Drawer.Header><h1>Add Event Types</h1></Drawer.Header>
            </Center>

            <form onSubmit={form.onSubmit((values) => console.log(values))}>
              
              <TextInput
                withAsterisk
                mb = "md"
                label="Event Type Name"
                key={form.key('eventTypeName')}
                {...form.getInputProps('eventTypeName')}

              />

              <Group justify="flex-end" mt="md" mb="md">
                <Button className={classes.FormButton} onClick={addEventTypeDB} type="submit">Add</Button>
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