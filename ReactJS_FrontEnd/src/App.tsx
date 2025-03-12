import './CSS/App.css';
import classes from './CSS/button.module.css';

import '@mantine/core/styles.css';

import { createTheme, MantineProvider, Group, Container, Affix, Transition, Button, rem } from '@mantine/core';

import AddEventForm from './Components/CRMEvent/AddEventForm.tsx'
import AddEventTypeButton from './Components/CRMEvent/AddEventTypeForm.tsx'
import DeleteEventTypeButton from './Components/CRMEvent/DeleteEventTypeForm.tsx'
import DeleteForm from './Components/CRMEvent/DeleteEvent.tsx';

import EventDisplayer from './Components/DisplayEvent/EventDisplayer.tsx';

import { EventTypeContextProvider } from './Components/Context/EventTypeContext.tsx';
import DataFetching from './Components/CRMEvent/DataFetching.tsx';
import EventContextProvider from './Components/Context/EventContext.tsx';
import Scroll from './Components/Scroll.tsx';


const theme = createTheme({
  fontFamily: 'Open Sans, sans-serif',
  focusRing: "always",
  cursorType: 'pointer',
  fontSmoothing: true,


  //make all buttons have gray outline when focused
  focusClassName: classes.focus

});

///////////////////////////////

function App (){

  //Not useState is allowed here.

  //----------------------------------------------------------------------
  //Creating a component XXXXXContextProvider for storing Context 
  //the purpose is to avoid all children which do not use corresponding context to be rerendered

  return (

    <>
    
    <MantineProvider theme={theme} defaultColorScheme="auto" >
      
      <EventTypeContextProvider>
        <EventContextProvider>

          <DataFetching></DataFetching>

          <Group justify="center">

              <AddEventForm></AddEventForm>
              <DeleteForm></DeleteForm>
              
              <AddEventTypeButton></AddEventTypeButton>
              <DeleteEventTypeButton></DeleteEventTypeButton>

          </Group>

          {/* bg="var(--mantine-color-blue-light)" */}
            <Container fluid mt={50} p={10} >

                <EventDisplayer></EventDisplayer>
              
            </Container>
          
        </EventContextProvider>

      </EventTypeContextProvider>

      <Scroll></Scroll>

    </MantineProvider>


    </>

  )
}

export default App