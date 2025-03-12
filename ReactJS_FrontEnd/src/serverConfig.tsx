const Port: number = 8014;

export const serverAddress: string = "http://localhost:" + Port + "/" ;


//Event

export const AddEventAddress: string = serverAddress + "event/add";

export const GetEventAddress: string = serverAddress + "event/getAll";

export const UpdateEventAddress: string = serverAddress + "event/updateEvent";

export const DeleteEventAddress: string = serverAddress + "event/delete";

export const EventDoneAddress: string = serverAddress + "event/checkDone";

//EventType

export const AddEventTypeAddress: string = serverAddress + "eventtype/add";

export const GetEventTypesAddress: string = serverAddress + "eventtype/getAll";

export const DeleteEventTypesAddress: string = serverAddress + "eventtype/delete";


