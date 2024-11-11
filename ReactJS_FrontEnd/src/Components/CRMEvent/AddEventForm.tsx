import '@mantine/dates/styles.css'
import classes from '../../CSS/button.module.css';

import { useState, useEffect, useContext } from 'react';
import dayjs from 'dayjs';

import {AddEventAddress} from '../../serverConfig.tsx'

import axios from 'axios';

import { useDisclosure } from '@mantine/hooks';
import { ColorInput , Drawer, Button, Center, TextInput, Group, Checkbox, Container, MultiSelect, Divider, Popover, Text, Notification } from '@mantine/core';
import { Transition} from '@mantine/core';

import { useForm, isNotEmpty, matches } from '@mantine/form';
import { DateTimePicker } from '@mantine/dates';

import {IconCalendarPlus} from "@tabler/icons-react"

import { EventTypeContext } from '../Context/EventTypeContext.tsx';
import { EventContext } from '../Context/EventContext.tsx';
import { catchErrorMessageHandling } from '../../catchErrorMessageHandling.tsx';

import { convertDateFormat, dateToString } from '../../dateFormatConverter.tsx';


export default function AddEventButton (){

  const notifyShowTime:number = 3000;

  const [formToggle, { open: formOpen, close: formClose }] = useDisclosure(false);

  const [showNotification, setShowNotification] = useState<boolean>(false);
  
  const [notifcationMessage, setNotificationMessage] = useState<string>("");

  const [isDone, setIsDone] = useState<boolean>(false);

  const [typeValueStringArrayForm, setTypeValueStringArrayForm] = useState<string[]>([]);

  const { eventTypes } = useContext(EventTypeContext);
  const { addEvent } = useContext(EventContext);
  
  const form = useForm({

    initialValues: {
      eventName: '',
      startDate: null,
      endDate: null,
      colorHex: '#8a8a8a',
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
  
  function IconButton () {

    const [iconNameToggle, { close, open }] = useDisclosure(false);

    return (

        <Popover position="top" withArrow shadow="md" opened={iconNameToggle}>
          <Popover.Target>
              <Button className={classes.MenuButtons} onClick={formOpen} onMouseEnter={open} onMouseLeave={close}> 
                  <IconCalendarPlus stroke={1.75} size={30}/>
              </Button>
          </Popover.Target>

          <Popover.Dropdown style={{ pointerEvents: 'none' }}>
              <Text size="sm">Add Event</Text>
          </Popover.Dropdown>
      </Popover>

    )
  }

//----------------------------------------------------------------------
    
    const addEventDB = async (e: React.MouseEvent<HTMLButtonElement> ) => {

      e.preventDefault();

      form.validate();

      if(!form.isValid()){
        return ;
      }

      try{

        const response = await axios.post(AddEventAddress, 
          {
            name: form.getInputProps("eventName").value, 

            //startDate and endDate has to be string so that back-end can handle them easier.
            startDate: dateToString (form.getInputProps("startDate").value) , 
            endDate: dateToString(form.getInputProps("endDate").value), 
                
            colorHex: form.getInputProps("colorHex").value, 
            isDone: isDone,
            types: typeValueStringArrayForm
          }

        );

        console.log("New event added to DB: ", response.data)
        
         addEvent({
          id: response.data.id,
          name: response.data.name, 

          //2024-08-15T00:00:00 to 2024-08-15 00:00
          //startDate: dateToString(form.getInputProps("startDate").value, true), 
          //endDate: dateToString(form.getInputProps("endDate").value, true), 
          
          startDate: response.data.startDate, 
          endDate: response.data.endDate, 
              
          isDone: response.data.isDone,
          types: response.data.types,

          colorHex: response.data.colorHex

        });
        
        setNotificationMessage("Event " + response.data.name + " (" + response.data.id + ") " + " Added !");

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
                <Drawer.Header><h1>Add Event</h1></Drawer.Header>
              </Center>

              <form onSubmit={ form.onSubmit(() => {}) }>
                
                <TextInput     
                  withAsterisk                  
                  
                  key={form.key('eventName')}
                  {...form.getInputProps('eventName')}

                  label="Event Name"                  
                  
                />

                <Group justify="center" gap="xs" grow>
                  <DateTimePicker

                    key={form.key('startDate')}
                    {...form.getInputProps('startDate')}

                    withAsterisk
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

                  value={typeValueStringArrayForm}
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
                  <Button className={classes.FormButton} onClick={addEventDB} type="submit">Add</Button>
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

      <IconButton></IconButton>

      </>
      )
}