import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Attendee, AttendanceStatus } from '../types';
import { Card } from './ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/Table';
import { Spinner } from './ui/Spinner';
import { Button } from './ui/Button';

interface AttendeeManagerProps {
  selectedSeminarId: string;
  certificateTemplateUrl: string | null;
  onPrintCertificate: (attendee: Attendee) => void;
}

const AttendeeManager: React.FC<AttendeeManagerProps> = ({ selectedSeminarId, certificateTemplateUrl, onPrintCertificate }) => {
  const { getAttendees, updateAttendeeStatus, sendBulkCertificates } = useAppContext();
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingCerts, setSendingCerts] = useState(false);
  const [certStatus, setCertStatus] = useState<{ message: string; success: boolean } | null>(null);

  const seminar = useAppContext().seminars.find(s => s.id === selectedSeminarId);

  useEffect(() => {
    if (selectedSeminarId) {
      const fetchAttendees = async () => {
        setLoading(true);
        try {
          const fetchedAttendees = await getAttendees(selectedSeminarId);
          setAttendees(fetchedAttendees);
        } catch (error) {
          console.error('Failed to fetch attendees:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchAttendees();
    }
  }, [selectedSeminarId, getAttendees]);

  const handleStatusChange = async (attendeeId: string, newStatus: AttendanceStatus) => {
    try {
      await updateAttendeeStatus(attendeeId, newStatus);
      // Refresh list
      const fetchedAttendees = await getAttendees(selectedSeminarId);
      setAttendees(fetchedAttendees);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleSendCertificates = async () => {
    setSendingCerts(true);
    setCertStatus(null);
    try {
        const result = await sendBulkCertificates(selectedSeminarId);
        setCertStatus(result);
    } catch (error) {
        setCertStatus({ message: 'An error occurred while sending certificates.', success: false });
    } finally {
        setSendingCerts(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="flex justify-center items-center p-8">
          <Spinner />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Attendees for "{seminar?.title}"</h3>
              <p className="text-sm text-gray-500">{attendees.length} participant(s)</p>
            </div>
            <Button onClick={handleSendCertificates} disabled={sendingCerts}>
              {sendingCerts ? <Spinner/> : 'Email Certificates'}
            </Button>
        </div>
         {!certificateTemplateUrl && (
            <div className="p-3 my-4 rounded-md text-sm bg-yellow-100 text-yellow-800">
                Note: Please generate a certificate design in the "Certificate Designer" tab to enable printing.
            </div>
        )}
        {certStatus && (
            <div className={`p-3 my-4 rounded-md text-sm ${certStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {certStatus.message}
            </div>
        )}

        {attendees.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendees.map(attendee => (
                <TableRow key={attendee.id}>
                  <TableCell>{attendee.fullName}</TableCell>
                  <TableCell>{attendee.email}</TableCell>
                  <TableCell>
                    <select
                      value={attendee.status}
                      onChange={(e) => handleStatusChange(attendee.id, e.target.value as AttendanceStatus)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value={AttendanceStatus.Registered}>Registered</option>
                      <option value={AttendanceStatus.Completed}>Completed</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    {attendee.status === AttendanceStatus.Completed && (
                       <Button 
                         variant="outline" 
                         className="text-xs px-2 py-1"
                         disabled={!certificateTemplateUrl}
                         onClick={() => onPrintCertificate(attendee)}
                       >
                         Print Certificate
                       </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-500 py-8">No attendees registered for this seminar yet.</p>
        )}
      </div>
    </Card>
  );
};

export default AttendeeManager;