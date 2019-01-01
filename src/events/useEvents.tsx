import React, { useEffect, useState, useLayoutEffect } from 'react'
import { useReceiver } from "../containers/useReceiver";
import {DailyEvents} from "./DailyEvents"

export let useEvents = () => {

    let dailyEvents = DailyEvents()

    const getEvents = async () => {
        let tmpevents = await dailyEvents.get()
        setEvents(tmpevents)
        return tmpevents
    }

    const [events, setEvents] = useState(() => {
        return getEvents();
      });

    return {
        events: events,
        getEvents: getEvents
    }
}
