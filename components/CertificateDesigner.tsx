import React, { useState, useRef } from 'react';
import { Card } from './ui/Card';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { Spinner } from './ui/Spinner';
import { generateCertificateDesign } from '../services/geminiService';
import Certificate from './Certificate';

interface CertificateDesignerProps {
    onDesignGenerated: (imageUrl: string) => void;
    currentBackgroundUrl: string | null;
}

const CertificateDesigner: React.FC<CertificateDesignerProps> = ({ onDesignGenerated, currentBackgroundUrl }) => {
  const [prompt, setPrompt] = useState('Create a professional certificate background. Use a formal blue and gold color scheme with Philippines government-inspired seal elements. The design should be clean and elegant. Leave the center of the certificate blank to accommodate text content.');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError("Image size should be less than 4MB.");
        return;
      }
      setImageFile(file);
      setError(null);
    }
  };
  
  const handleRemoveImage = () => {
    setImageFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleSubmit = async () => {
    if (!prompt) {
      setError('Please provide a prompt.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await generateCertificateDesign(prompt, imageFile);
      onDesignGenerated(result);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      console.error("Certificate generation failed:", e);
      setError(`Failed to generate certificate: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
        <Card>
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Certificate Background Designer</h3>
                <div className="space-y-6">
                <Textarea
                    label="Design Prompt"
                    name="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    placeholder="Describe the certificate background..."
                />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Sample Certificate (Optional)
                    </label>
                    <div className="mt-1 flex items-center">
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        className="hidden"
                    />
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        Choose File
                    </Button>
                    {imageFile && (
                        <div className="flex items-center ml-3">
                           <span className="text-sm text-gray-600">{imageFile.name}</span>
                           <button onClick={handleRemoveImage} className="ml-2 text-red-500 hover:text-red-700 text-xs font-semibold">REMOVE</button>
                        </div>
                    )}
                    </div>
                     <p className="text-xs text-gray-500 mt-1">Provide an image to inspire the AI's design.</p>
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? <Spinner /> : 'Generate Background'}
                    </Button>
                </div>

                {error && (
                    <div className="p-3 rounded-md bg-red-100 text-red-800 text-sm">
                    {error}
                    </div>
                )}
                </div>
            </div>
        </Card>

        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Preview</h3>
            <Card>
                <div className="p-4 bg-gray-200 flex justify-center items-center">
                    {loading ? (
                         <div className="w-full max-w-4xl aspect-[1.414] flex flex-col items-center justify-center bg-white">
                             <Spinner />
                             <p className="mt-2 text-gray-600">Generating design...</p>
                         </div>
                    ) : (
                        <Certificate
                            attendeeName="[Sample Attendee Name]"
                            seminarTitle="[Sample Seminar Title]"
                            seminarDate={new Date().toISOString().split('T')[0]}
                            speakerName="[Sample Speaker Name]"
                            backgroundImageUrl={currentBackgroundUrl}
                        />
                    )}
                </div>
            </Card>
        </div>
    </div>
  );
};

export default CertificateDesigner;
