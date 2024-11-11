

export interface EventTypeInterface {

    id: number,
    name: string

}

export interface EventInterface {

    name: string,
    startDate: string,
    endDate: string,
    isDone: boolean,
    colorHex: string,

    id: number,
    types: string[] 
}
