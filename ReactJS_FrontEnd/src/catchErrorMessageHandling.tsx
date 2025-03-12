import axios from "axios";
import { Dispatch } from "react";
import { SetStateAction } from "react";

export function catchErrorMessageHandling( error:any, setNotificationMessage?: Dispatch<SetStateAction<string>> ) {

  if(setNotificationMessage != undefined){

    if (axios.isAxiosError(error) && setNotificationMessage != undefined){
              
        if(error.response) {
        setNotificationMessage(error.response.data);

        }else if(error.request){
        
        setNotificationMessage("No response received from server.");

        }else {

        setNotificationMessage(error.message);

        }

      }else{

        setNotificationMessage('What have you done ?..... 💀');
        //Maybe it happenes after Request/Post/Get
      }

      return

    }

    /////////////////////////

    if(setNotificationMessage == undefined){

      if (axios.isAxiosError(error) && setNotificationMessage != undefined){
              
        if(error.response) {
        console.log(error.response.data);

        }else if(error.request){
        
          console.log("No response received from server.");

        }else {

          console.log(error.message);

        }

      }else{

        console.log('What have you done ?..... 💀');
        //Maybe it happenes after Request/Post/Get
      }
      

    }
    
}