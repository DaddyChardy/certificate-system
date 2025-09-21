import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from './ui/Card';
import { Spinner } from './ui/Spinner';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { NewSeminar } from '../types';

interface SeminarManagerProps {
  selectedSeminarId: string | null;
  onSeminarSelect: (id: string | null) => void;
}

const SeminarManager: React.FC<SeminarManagerProps> = ({ selectedSeminarId, onSeminarSelect }) => {
  const { seminars, loading, getSeminars, addSeminar } = useAppContext();
  const [isCreating, setIsCreating] = useState(false);
  const [newSeminar, setNewSeminar] = useState<NewSeminar>({
    title: '',
    date: '',
    speaker: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getSeminars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedSeminarId && seminars.length > 0) {
      onSeminarSelect(seminars[0].id);
    }
  }, [seminars, selectedSeminarId, onSeminarSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSeminar(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (Object.values(newSeminar).some(v => v.trim() === '')) {
      alert("All fields are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      await addSeminar(newSeminar);
      setIsCreating(false);
      setNewSeminar({ title: '', date: '', speaker: '', description: '' });
    } catch (e) {
      console.error("Failed to add seminar", e);
      alert("There was an error saving the seminar. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setNewSeminar({ title: '', date: '', speaker: '', description: '' });
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Manage Seminars</h3>
          {!isCreating && (
            <Button onClick={() => setIsCreating(true)} className="px-3 py-1 text-sm">
              + New
            </Button>
          )}
        </div>

        {isCreating && (
          <div className="p-4 mb-6 space-y-4 border rounded-lg bg-gray-50/70">
            <h4 className="font-medium text-gray-800">Create New Seminar</h4>
            <Input name="title" label="Seminar Title" value={newSeminar.title} onChange={handleInputChange} placeholder="e.g., Advanced Public Speaking" required />
            <Input name="date" label="Date" type="date" value={newSeminar.date} onChange={handleInputChange} required />
            <Input name="speaker" label="Speaker" value={newSeminar.speaker} onChange={handleInputChange} placeholder="e.g., Sec. Maria Reyes" required />
            <Textarea name="description" label="Description" value={newSeminar.description} onChange={handleInputChange} rows={3} placeholder="A brief summary of the seminar." required />
            <div className="flex justify-end space-x-2 pt-2">
              <Button onClick={handleCancel} variant="outline">Cancel</Button>
              <Button onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : 'Save Seminar'}
              </Button>
            </div>
          </div>
        )}

        {loading && seminars.length === 0 ? (
          <div className="flex justify-center items-center p-4">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-3">
            {seminars.map((seminar) => (
              <div
                key={seminar.id}
                onClick={() => onSeminarSelect(seminar.id)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedSeminarId === seminar.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                <p className="font-semibold">{seminar.title}</p>
                <p className={`text-sm ${selectedSeminarId === seminar.id ? 'text-blue-100' : 'text-gray-500'}`}>{seminar.date} | {seminar.speaker}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default SeminarManager;
