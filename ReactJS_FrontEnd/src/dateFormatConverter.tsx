//  "YYYY-MM-DD hh:mm" to "YYYY-MM-DDTHH:mm±HHMM" or "2000-01-31T20:59+0800"


export function convertDateFormat(date: Date | null , offset: string = '+0800'): string | null{
     
    if (!date) {
      return null;
    }

    // Get the UTC date components
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hour = String(date.getUTCHours()).padStart(2, '0');
    const minute = String(date.getUTCMinutes()).padStart(2, '0');
  
    // Parse the offset
    const offsetSign = offset.startsWith('-') ? -1 : 1;
    const offsetHours = parseInt(offset.slice(1, 3), 10) * offsetSign;
    const offsetMinutes = parseInt(offset.slice(3, 5), 10) * offsetSign;
  
    // Adjust the time according to the offset
    const adjustedDate = new Date(Date.UTC(year, Number(month) - 1, Number(day), Number(hour), Number(minute)));
    adjustedDate.setHours(adjustedDate.getUTCHours() + offsetHours);
    adjustedDate.setMinutes(adjustedDate.getUTCMinutes() + offsetMinutes);
  
    // Format the adjusted date components
    const adjustedYear = adjustedDate.getUTCFullYear();
    const adjustedMonth = String(adjustedDate.getUTCMonth() + 1).padStart(2, '0');
    const adjustedDay = String(adjustedDate.getUTCDate()).padStart(2, '0');
    const adjustedHour = String(adjustedDate.getUTCHours()).padStart(2, '0');
    const adjustedMinute = String(adjustedDate.getUTCMinutes()).padStart(2, '0');
  
    // Combine into the desired format
    const formattedDate = `${adjustedYear}-${adjustedMonth}-${adjustedDay}T${adjustedHour}:${adjustedMinute}${offset}`;
  
    return formattedDate;
}

//Reversing
//Basically to replace toISOString due to inaccurate timezoned
//And that string format: 2024-08-15T00:00:00 will be able to pass the back-end's LocalDateTime.parse()
export function dateToString(date: Date | null, displayState?: boolean) {

  let dateAsString ;
  
  if(!date){
    return "";
  }

  date = new Date(date);
  date.setTime(date.getTime() - (date.getTimezoneOffset() * 60000));
  dateAsString =  date.toISOString().substring(0, 19);

  if(displayState == undefined){
    return dateAsString;
  }
  
  else{

    dateAsString = dateAsString.replace("T", " ").substring(0, 16)

    if( parseInt( dateAsString.substring(11, 13) ) >= 12){
      dateAsString += " PM";
    }else{
      dateAsString += " AM";
    }

    return dateAsString;
      
  }
}
  