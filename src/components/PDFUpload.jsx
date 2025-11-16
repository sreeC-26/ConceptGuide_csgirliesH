import { useRef, useState } from 'react';
import { useAppStore } from '../store/useAppStore';

export default function PDFUpload() {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const { setPdfData } = useAppStore();

  const handleFileSelect = async (file) => {
    if (file && file.type === 'application/pdf') {
      await loadPDF(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const loadPDF = async (file) => {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      
      // Use jsdelivr CDN with correct path for version 5.4.394
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.394/build/pdf.worker.min.mjs';
      
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        useSystemFonts: true,
        verbosity: 0
      });
      const pdf = await loadingTask.promise;
      
      // Extract text from all pages - store per page
      let fullText = '';
      const pageTexts = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        pageTexts.push(pageText);
        fullText += pageText + '\n\n';
      }

      setPdfData({
        fullText,
        pageTexts,
        pageCount: pdf.numPages,
        fileName: file.name,
        pdfFile: file,
        pdfDocument: pdf,
      });
    } catch (error) {
      console.error('Error loading PDF:', error);
      console.error('Error details:', error.message, error.stack);
      alert(`Failed to load PDF: ${error.message || 'Unknown error'}. Please check the browser console for details.`);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-8" style={{ backgroundColor: '#1A1A1A' }}>
      <div
        className={`w-full max-w-2xl gradient-border rounded-lg p-12 text-center transition-all duration-200 ${
          isDragging ? 'scale-105' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="window-controls">
          <div className="window-dot window-dot-red"></div>
          <div className="window-dot window-dot-yellow"></div>
          <div className="window-dot window-dot-green"></div>
        </div>
        <svg
          className="mx-auto h-20 w-20 mb-4 transition-transform duration-200 hover:scale-110"
          style={{ color: '#FF4081' }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <h3 className="text-3xl mb-2" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF' }}>
          📄 Upload a PDF document
        </h3>
        <p className="mb-6 text-sm" style={{ fontFamily: 'Poppins, sans-serif', color: '#F5D9E4' }}>
          Drag and drop your PDF here, or click to browse
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-primary"
        >
          Choose File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>
    </div>
  );
}

