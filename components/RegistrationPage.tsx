
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';
import { NewAttendee, Seminar } from '../types';

const RegistrationPage: React.FC = () => {
  const { seminars, addAttendee, loading: apiLoading, getSeminars } = useAppContext();
  const [formState, setFormState] = useState<Omit<NewAttendee, 'seminarId'> & { seminarId: string | '' }>({
    fullName: '',
    email: '',
    contactNumber: '',
    agency: '',
    position: '',
    seminarId: '',
  });
  const [localLoading, setLocalLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchSeminars = async () => {
      setLocalLoading(true);
      await getSeminars();
      if(seminars.length > 0 && formState.seminarId === '') {
        setFormState(prev => ({...prev, seminarId: seminars[0].id}));
      }
      setLocalLoading(false);
    };
    fetchSeminars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus(null);
    if (Object.values(formState).some(value => value === '')) {
      setSubmissionStatus({ message: 'All fields are required.', type: 'error' });
      return;
    }

    try {
      await addAttendee(formState as NewAttendee);
      setSubmissionStatus({ message: 'Registration successful! You will receive a confirmation email shortly.', type: 'success' });
      setFormState({ fullName: '', email: '', contactNumber: '', agency: '', position: '', seminarId: seminars.length > 0 ? seminars[0].id : '' });
    } catch (error) {
      setSubmissionStatus({ message: 'Registration failed. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Seminar Registration</h2>
          <p className="text-gray-600 mb-6">Fill out the form below to register for an upcoming government seminar.</p>

          {localLoading ? (
            <div className="flex justify-center items-center h-40">
                <Spinner />
            </div>
          ) : seminars.length === 0 ? (
            <p className="text-center text-gray-500">No seminars are currently available for registration.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input name="fullName" label="Full Name" value={formState.fullName} onChange={handleChange} placeholder="Juan Dela Cruz" required />
                <Input name="email" label="Email Address" type="email" value={formState.email} onChange={handleChange} placeholder="juan.delacruz@gov.ph" required />
                <Input name="contactNumber" label="Contact Number" value={formState.contactNumber} onChange={handleChange} placeholder="09123456789" required />
                <Input name="agency" label="Agency / Organization" value={formState.agency} onChange={handleChange} placeholder="e.g., Civil Service Commission" required />
                <Input name="position" label="Position / Designation" value={formState.position} onChange={handleChange} placeholder="e.g., Director IV" required />
                <Select name="seminarId" label="Select Seminar" value={formState.seminarId} onChange={handleChange} required>
                  {seminars.map(seminar => (
                    <option key={seminar.id} value={seminar.id}>{seminar.title}</option>
                  ))}
                </Select>
              </div>

              {submissionStatus && (
                <div className={`p-4 rounded-md text-sm ${submissionStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {submissionStatus.message}
                </div>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={apiLoading}>
                  {apiLoading ? <Spinner /> : 'Register'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
};

export default RegistrationPage;
