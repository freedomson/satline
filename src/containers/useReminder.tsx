import React, { useEffect, useState } from 'react'
import { useReceiver } from "./useReceiver";
import { CalendarGetEvents } from "./CalendarGetEvents";

export let useReminder = (eventProcessors) => {
    
    const [eventId, setEventId] = useState(0);
    const [events, setEvents] = useState([]);

    let calendarEvents = CalendarGetEvents()

    let eventProcessor = async (id) => {
        console.log("[SMSC][REMINDER] Fired callback for event id:" + id)
        setEventId(id)
        let events = await calendarEvents.getEvents(id)
        console.log("[SMSC][REMINDER] Events",events)
        eventProcessors.forEach(processor => {
            processor(events)
        });
    }
    
    console.log("[SMSC][REMINDER] Receiver")
    useReceiver(eventProcessor);

    return {
        eventId: eventId,
        events: events
    }
}
