
export enum AttendanceStatus {
  Registered = 'Registered',
  Completed = 'Completed',
}

export interface Attendee {
  id: string;
  fullName: string;
  email: string;
  contactNumber: string;
  agency: string;
  position: string;
  seminarId: string;
  status: AttendanceStatus;
}

export interface Seminar {
  id: string;
  title: string;
  date: string;
  speaker: string;
  description: string;
}

export type NewAttendee = Omit<Attendee, 'id' | 'status'>;
export type NewSeminar = Omit<Seminar, 'id'>;
