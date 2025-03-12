import '@mantine/dates/styles.css'
import classes from '../../CSS/button.module.css';

import { useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';

import {UpdateEventAddress} from '../../serverConfig.tsx'
import { IconPencil } from '@tabler/icons-react';

import axios from 'axios';

import { useDisclosure } from '@mantine/hooks';
import { ColorInput , Drawer, Button, Center, TextInput, Group, Checkbox, Container, MultiSelect, Divider, Notification } from '@mantine/core';
import { Transition} from '@mantine/core';

import { useForm, matches, isNotEmpty } from '@mantine/form';
import { DateTimePicker } from '@mantine/dates';

import { EventTypeContext } from '../Context/EventTypeContext.tsx';
import { EventContext } from '../Context/EventContext.tsx';
import { catchErrorMessageHandling } from '../../catchErrorMessageHandling.tsx';

import { convertDateFormat, dateToString } from '../../dateFormatConverter.tsx';
import { EventInterface } from './DBObjects.tsx';

interface EventCardProps {
    preFill: EventInterface,
}
  
export default function EditEventButton ({preFill}: EventCardProps){

  const notifyShowTime:number = 3000;

  const [formToggle, { open: formOpen, close: formClose }] = useDisclosure(false);

  const [showNotification, setShowNotification] = useState<boolean>(false);
  
  const [notifcationMessage, setNotificationMessage] = useState<string>("");

  const [isDone, setIsDone] = useState<boolean>(preFill.isDone);

  const [typeValueStringArrayForm, setTypeValueStringArrayForm] = useState<string[]>(preFill.types);

  const { eventTypes } = useContext(EventTypeContext);
  const { events, resetEvents, addEvent } = useContext(EventContext);

  
  const form = useForm({

    initialValues: {
      eventName: preFill.name,
      startDate: dayjs(preFill.startDate).toDate(),
      endDate: (preFill.endDate==null) ? null: dayjs(preFill.endDate).toDate(),
      colorHex: preFill.colorHex
    },

    validate:{
        eventName: isNotEmpty('Must be filled'),
        startDate: isNotEmpty('Must be filled'),
        colorHex: matches(/^#([0-9a-f]{3}){1,2}$/, 'Enter a valid hex color'),
    }

  });
  
//----------------------------------------------------------------------

  //For notifcation's transition effect
  useEffect(() => {
    if (showNotification) {
        const timer = setTimeout(() => { setShowNotification(false) }, notifyShowTime);

        return () => clearTimeout(timer);
    }

  }, [showNotification]);

//----------------------------------------------------------------------
    
    const updateEventDB = async (e: React.MouseEvent<HTMLButtonElement> ) => {

      e.preventDefault();

      form.validate();

      if(!form.isValid()){
        return ;
      }

      try{
        
        const response = await axios.put(UpdateEventAddress,
            
        {
            name: form.getInputProps("eventName").value, 

            //startDate and endDate has to be string so that back-end can handle them easier.
            startDate: dateToString (form.getInputProps("startDate").value) , 
            endDate: dateToString(form.getInputProps("endDate").value), 
                
            colorHex: form.getInputProps("colorHex").value, 
            isDone: isDone,
            types: typeValueStringArrayForm
        },

        {
            params: {
                id: preFill.id
                }
        }
        
        );

        console.log("Event " + preFill.id + " updated");
                
        
        //Idea:
        //Remove the old one.
        //Add the new one.
        //Because sometimes the whole date slot needs to be rearranged.

        const updatedEvents = events.filter(event => event.id != response.data.id);
        resetEvents(updatedEvents);

        addEvent({
          id: response.data.id,
          name: response.data.name, 

          startDate: response.data.startDate, 
          endDate: response.data.endDate, 
              
          isDone: response.data.isDone,
          types: response.data.types,

          colorHex: response.data.colorHex

        });

        setNotificationMessage("Event " + preFill.id + " updated");

        }catch(error){

          catchErrorMessageHandling(error, setNotificationMessage)

        }

        setShowNotification(true);

    }

//----------------------------------------------------------------------

    return (
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
                <Drawer.Header><h1>Edit Event</h1></Drawer.Header>
              </Center>

              <form onSubmit={ form.onSubmit(() => {}) }>
                
                <TextInput     
                                                  
                  key={form.key('eventName')}
                  {...form.getInputProps('eventName')}

                  label="Event Name"                  
                  
                />

                <Group justify="center" gap="xs" grow>
                  <DateTimePicker

                    key={form.key('startDate')}
                    {...form.getInputProps('startDate')}

                    mt="md"
                    label="Start Date"
                    valueFormat="YYYY-MM-DD hh:mm"
                  />

                  <DateTimePicker

                    minDate={dayjs( convertDateFormat(form.getInputProps('startDate').value) ).toDate()} //where will the date begins
                    
                    key={form.key('endDate')}
                    {...form.getInputProps('endDate')}

                    mt="md"
                    label="End Date"

                    valueFormat="YYYY-MM-DD hh:mm"
                    clearable

                  />
                </Group>

                <Checkbox
                  mt="md"
                  label="Done ?"
                  color="gray"

                  checked={isDone}
                  onChange= { () => setIsDone(!isDone)}

                /> 

                <Divider mt="md" mb="md"></Divider>

                  <MultiSelect

                  label="Type(s)"
                  data={eventTypes}

                  clearable
                  searchable
                  hidePickedOptions

                  defaultValue={preFill.types}

                  onChange={setTypeValueStringArrayForm}

                  >
                  </MultiSelect>


                <Group mt= "md" gap="xs" >
                  <ColorInput


                    className={classes.ColorInput}
                    variant="unstyled"
                    label="Label Color"                    
                    
                    key={form.key('colorHex')}
                    {...form.getInputProps('colorHex')}

                  />

                </Group>

                <Group justify="flex-end" mt="md">
                  <Button className={classes.FormButton} onClick={updateEventDB} type="submit">Update</Button>
                </Group>

                <Group mt="xl">
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
                          style={{...transitionStyle, zIndex: -1 }}
                          onClose={()=>setShowNotification(false)}
                        >
                                
                          {notifcationMessage}
                                    
                        </Notification>

                      )

                    }
                  
                  </Transition>

                </Group>
        
              </form>

            </Container >

          </Drawer.Content>
        
      </Drawer.Root>

      <IconPencil onClick={formOpen}> Edit </IconPencil>

      </>
      )
}