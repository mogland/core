export enum ScheduleType {
  // code, // run code in schedule
  url = 'url', // fetch url in schedule
  event = 'event', // trigger event
}

export enum AfterSchedule {
  store = 'store', // store data from event
  url = 'url',
  none = 'none',
  // email, // send email from event
  // webhook, // send webhook from event
}
