import React, { useState } from 'react';
import SeminarManager from './SeminarManager';
import AttendeeManager from './AttendeeManager';
import CertificateDesigner from './CertificateDesigner';
import Certificate from './Certificate';
import { Attendee } from '../types';
import { useAppContext } from '../context/AppContext';
import { Button } from './ui/Button';

const AdminDashboard: React.FC = () => {
  const { seminars } = useAppContext();
  const [selectedSeminarId, setSelectedSeminarId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'attendees' | 'designer'>('attendees');
  
  // State for certificate design and printing
  const [certificateBackgroundUrl, setCertificateBackgroundUrl] = useState<string | null>(null);
  const [printingAttendee, setPrintingAttendee] = useState<Attendee | null>(null);

  const selectedSeminar = seminars.find(s => s.id === selectedSeminarId);

  const handlePrintRequest = (attendee: Attendee) => {
    setPrintingAttendee(attendee);
  };
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <SeminarManager
            selectedSeminarId={selectedSeminarId}
            onSeminarSelect={setSelectedSeminarId}
          />
        </div>
        <div className="lg:col-span-2">
          {selectedSeminarId ? (
            <div>
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('attendees')}
                    className={`${
                      activeTab === 'attendees'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Manage Attendees
                  </button>
                  <button
                    onClick={() => setActiveTab('designer')}
                    className={`${
                      activeTab === 'designer'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Certificate Designer
                  </button>
                </nav>
              </div>
              {activeTab === 'attendees' && (
                <AttendeeManager 
                  selectedSeminarId={selectedSeminarId}
                  certificateTemplateUrl={certificateBackgroundUrl}
                  onPrintCertificate={handlePrintRequest}
                />
              )}
              {activeTab === 'designer' && (
                <CertificateDesigner 
                  onDesignGenerated={setCertificateBackgroundUrl}
                  currentBackgroundUrl={certificateBackgroundUrl}
                />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-white rounded-lg shadow-sm p-8">
                <p className="text-gray-500 text-center">Select a seminar to manage attendees or design certificates.</p>
            </div>
          )}
        </div>
      </div>

      {printingAttendee && selectedSeminar && (
         <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50 p-4">
            <div className="bg-white p-4 rounded-lg shadow-2xl mb-4 w-full max-w-5xl">
                <div id="printable-certificate" className="flex justify-center">
                    <Certificate
                        attendeeName={printingAttendee.fullName}
                        seminarTitle={selectedSeminar.title}
                        seminarDate={selectedSeminar.date}
                        speakerName={selectedSeminar.speaker}
                        backgroundImageUrl={certificateBackgroundUrl}
                    />
                </div>
            </div>
            <div className="flex space-x-4">
                <Button onClick={handlePrint}>Print Certificate</Button>
                <Button variant="outline" onClick={() => setPrintingAttendee(null)}>Close</Button>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;