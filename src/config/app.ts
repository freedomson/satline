export const APP_TITLE = "Paseeo";
export const APP_SLOGAN = "We are all one!";
export const APP_SEPARATOR = ":";
export const APP_SMS_TEMPLATE = {
    whatsapp: false,
    sms: true,
    template: "Dear {{attendees}}, this is a reminder for {{event}} on {{date}} at {{time}}.\nHappens {{delta}}!\nHave a wonderful day.\n{{location}}"
};
export const APP_DATA_KEYS = {
    DAILY_MESSAGES: 'APP_DAILY_MESSAGES',
    SMS_TEMPLATE: 'APP_SMS_TEMPLATE',
    EMITTER: 'APP_EMITTER'
};
export const APP_ANDROID_MAP = 'https://www.google.com/maps/place/'

export const AUTHORIZATION_DENIED = -1;
export const AUTHORIZATION_GRANTED = 1;

// TODO: proper translations
// Only status page is using this
export const TRANSLATIONS = {
    en: {
        events : {
            title:      'Title',
            senddate:   'Reminder',
            date:       'Event Date',
            attendees:   'Attendees',
            location:   'Location'
        },
        home : {
            on: `${APP_TITLE} is running.`,
            off: `${APP_TITLE} is stopped.`,
            authorized: `Permissions granted.`,
            notAuthorized: `Permissions not granted.`,
            dailyEvents: `Today's events!`,
            noDailyEvents: `Enjoy your free time.`
        },
        template : {
            label_whatsapp: "Whatsapp",
            label_sms: "SMS",
        },
        status : {
            label: "Event Update",
            description: `The above switch controls the subscription for reminders of ${APP_TITLE} events.\n\nDeactivating subscriber will halt ${APP_TITLE} engine.\n\nWhen active, ${APP_TITLE} will immediately start listening to your event reminders.`
        },
        help : {
            calendar : {
                label: "Calendar Events",
                description: `Messages are delivered based on the native calendar events configuration.\nEvent attendees will receive a message, at the same time other reminders, such as emails were setup.`
            },
            contactMobile : {
                label: "Contact Mobile Number",
                description: `Contacts must have a valid mobile number.\nOnly contacts with mobile numbers are elected.`
            },
            contactEmail : {
                label: "Contact Email",
                description: `Contacts must have an email address.\nContacts without an email address, can't be elected as attendees.\nThis is a OS restriction (android).`
            },
            silence : {
                label: "Silence Reminders",
                description: `It's possible to silence the message reminders.\nJust open the status configuration page and use the on/off switch.`
            },
            location : {
                label: "Event Location",
                description: `Please select a location for the calendar event and it will available in the message template.`
            }
        },
    }
};
export const PAGES = { 
    STATUS:     {name:'Power',     icon: 'power'},
    ABOUT:      {name:'About Us',      icon: 'favorite'},
    TEMPLATE:   {name:'Settings',   icon: 'settings'},
    HELP:       {name:'Help Me',       icon: 'help'},
    HOME:       {name:'Home',       icon: 'menu'},
}