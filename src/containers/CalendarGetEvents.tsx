import RNCalendarEvents from 'react-native-calendar-events';  
import simpleContacts from 'react-native-simple-contacts'  

export let CalendarGetEvents = () => {

    async function getEvents(id) {
        try {
            console.log("[SMSC][GETEVENTS] Get calendar events for id:" + id)
            const event = await RNCalendarEvents.findEventById(String(id));
            const events =[event];
            console.log("[SMSC][GETEVENTS] Get calendar events", events)
            let eventPromises = events.map(async (event)=>{
                if (event.attendees.length) {
                    const attendeePromises = event.attendees.map(async attendee => {
                        const resp = await simpleContacts.getContactsByFilter(attendee.email)
                        attendee.contacts=JSON.parse(resp)
                        return attendee
                    })
                    event.attendees = await Promise.all(attendeePromises)
                }
                return event
            })
            const finalEvents = await Promise.all(eventPromises)
            console.log("[SMSC][GETEVENTS] Response calendar events for id:" + id)
            return finalEvents
        } catch (err) {
            console.warn(err);
        } 
    }

    return {
        getEvents: getEvents
    }
}
