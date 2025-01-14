import events from "events";

export interface scheduleModifiedEvent {
  year: number;
  month: number;
}

export const Emitter = new events.EventEmitter();
