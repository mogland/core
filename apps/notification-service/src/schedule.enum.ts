export enum ScheduleType {
  // code, // run code in schedule
  url, // fetch url in schedule
  event, // trigger event
}

export enum AfterSchedule {
  store, // store data from event
  url,
  // email, // send email from event
  // webhook, // send webhook from event
}
