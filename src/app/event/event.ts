export class Event {
    users: string[];
    Id: string;
    open: boolean;
    hasSchedule: boolean;
    scheduleFinalized:boolean;
}

export class EventDate {
        Id: string;
        eventId:string;
        manId:string;
        womanId:string;
        round:number;
}