import React from 'react';

interface CertificateProps {
  attendeeName: string;
  seminarTitle: string;
  seminarDate: string;
  speakerName: string;
  backgroundImageUrl: string | null;
}

const Certificate: React.FC<CertificateProps> = ({
  attendeeName,
  seminarTitle,
  seminarDate,
  speakerName,
  backgroundImageUrl
}) => {
  const containerStyle: React.CSSProperties = backgroundImageUrl
    ? { backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: '#f7f2e9', border: '10px solid #c9a96e' };
  
  const textShadow = backgroundImageUrl ? '0 1px 3px rgba(0,0,0,0.5)' : 'none';

  return (
    <div
      className="w-full max-w-4xl aspect-[1.414] p-12 flex flex-col items-center justify-between text-center font-serif shadow-lg"
      style={containerStyle}
    >
      <div>
        <h1 className="text-5xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif", textShadow }}>
          Certificate of Completion
        </h1>
        <p className="mt-4 text-xl text-gray-700" style={{ textShadow }}>This certificate is proudly presented to</p>
      </div>

      <p className="text-6xl font-semibold text-blue-800" style={{ fontFamily: "'Great Vibes', cursive", textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
        {attendeeName}
      </p>

      <div className="text-xl text-gray-700" style={{ textShadow }}>
        <p>for successfully completing the seminar</p>
        <h2 className="text-3xl font-bold my-2 text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>{seminarTitle}</h2>
        <p>held on {new Date(seminarDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.</p>
      </div>

      <div className="w-full flex justify-around mt-8 border-t-2 border-gray-400 pt-4">
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-700" style={{ fontFamily: "'Great Vibes', cursive", textShadow }}>{speakerName}</p>
          <p className="text-sm text-gray-500 uppercase tracking-widest font-sans" style={{ textShadow }}>Seminar Speaker</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-gray-700" style={{ fontFamily: "'Great Vibes', cursive", textShadow }}>Official Seal</p>
          <p className="text-sm text-gray-500 uppercase tracking-widest font-sans" style={{ textShadow }}>Government Agency</p>
        </div>
      </div>
    </div>
  );
};

export default Certificate;