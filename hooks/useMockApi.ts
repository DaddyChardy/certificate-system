
import { useState, useCallback } from 'react';
import { Seminar, Attendee, NewSeminar, NewAttendee, AttendanceStatus } from '../types';

const initialSeminars: Seminar[] = [
  {
    id: 'seminar-1',
    title: 'Digital Transformation in Public Service',
    date: '2024-08-15',
    speaker: 'Dr. Juan Dela Cruz',
    description: 'Exploring the impact of technology on governance and public administration in the Philippines.',
  },
  {
    id: 'seminar-2',
    title: 'Leadership and Governance in the New Normal',
    date: '2024-09-10',
    speaker: 'Sec. Maria Reyes',
    description: 'Strategies for effective leadership amidst contemporary challenges.',
  },
];

const initialAttendees: Attendee[] = [
  {
    id: 'attendee-1',
    fullName: 'Ana Santos',
    email: 'ana.santos@gov.ph',
    contactNumber: '09171234567',
    agency: 'Department of Information and Communications Technology',
    position: 'IT Officer',
    seminarId: 'seminar-1',
    status: AttendanceStatus.Registered,
  },
  {
    id: 'attendee-2',
    fullName: 'Benito Carlos',
    email: 'b.carlos@gov.ph',
    contactNumber: '09209876543',
    agency: 'Civil Service Commission',
    position: 'Director',
    seminarId: 'seminar-1',
    status: AttendanceStatus.Completed,
  },
];

export interface UseMockApiReturn {
    seminars: Seminar[];
    attendees: Attendee[];
    loading: boolean;
    error: string | null;
    getSeminars: () => Promise<Seminar[]>;
    addSeminar: (seminar: NewSeminar) => Promise<Seminar>;
    getAttendees: (seminarId: string) => Promise<Attendee[]>;
    addAttendee: (attendee: NewAttendee) => Promise<Attendee>;
    updateAttendeeStatus: (attendeeId: string, status: AttendanceStatus) => Promise<Attendee>;
    sendBulkCertificates: (seminarId: string) => Promise<{ success: boolean; message: string }>;
}


export const useMockApi = (): UseMockApiReturn => {
  const [seminars, setSeminars] = useState<Seminar[]>(initialSeminars);
  const [attendees, setAttendees] = useState<Attendee[]>(initialAttendees);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const simulateApiCall = <T,>(action: () => T, delay: number = 500): Promise<T> => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setError(null);
      setTimeout(() => {
        try {
          const result = action();
          setLoading(false);
          resolve(result);
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
          setError(errorMessage);
          setLoading(false);
          reject(new Error(errorMessage));
        }
      }, delay);
    });
  };

  const getSeminars = useCallback(() => simulateApiCall(() => seminars), [seminars]);
  
  const addSeminar = useCallback((seminar: NewSeminar) => simulateApiCall(() => {
    const newSeminar: Seminar = { ...seminar, id: `seminar-${Date.now()}` };
    setSeminars(prev => [...prev, newSeminar]);
    return newSeminar;
  }), []);

  const getAttendees = useCallback((seminarId: string) => simulateApiCall(() => {
      return attendees.filter(a => a.seminarId === seminarId);
  }), [attendees]);

  const addAttendee = useCallback((attendee: NewAttendee) => simulateApiCall(() => {
      const newAttendee: Attendee = { ...attendee, id: `attendee-${Date.now()}`, status: AttendanceStatus.Registered };
      setAttendees(prev => [...prev, newAttendee]);
      return newAttendee;
  }), []);

  const updateAttendeeStatus = useCallback((attendeeId: string, status: AttendanceStatus) => simulateApiCall(() => {
      let updatedAttendee: Attendee | null = null;
      setAttendees(prev => prev.map(a => {
        if (a.id === attendeeId) {
          updatedAttendee = { ...a, status };
          return updatedAttendee;
        }
        return a;
      }));
      if (!updatedAttendee) throw new Error('Attendee not found');
      return updatedAttendee;
  }), []);

  const sendBulkCertificates = useCallback((seminarId: string) => simulateApiCall(() => {
    console.log(`Simulating bulk certificate sending for seminar ${seminarId}...`);
    const completedAttendees = attendees.filter(a => a.seminarId === seminarId && a.status === AttendanceStatus.Completed);
    if(completedAttendees.length === 0) {
        return { success: false, message: 'No attendees have completed the seminar yet.' };
    }
    console.log(`Sending certificates to ${completedAttendees.length} attendees.`);
    // In a real app, this would trigger an email service.
    return { success: true, message: `Successfully sent certificates to ${completedAttendees.length} completed attendees.` };
  }, 1500), [attendees]);

  return { seminars, attendees, loading, error, getSeminars, addSeminar, getAttendees, addAttendee, updateAttendeeStatus, sendBulkCertificates };
};
