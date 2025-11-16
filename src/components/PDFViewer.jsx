import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';

export default function PDFViewer() {
  const { pdfDocument, fileName } = useAppStore();
  const [pages, setPages] = useState([]);

  useEffect(() => {
    if (pdfDocument) {
      loadPages();
    }
  }, [pdfDocument]);

  const loadPages = async () => {
    const pdfjsLib = await import('pdfjs-dist');
    // Set worker if not already set
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.394/build/pdf.worker.min.mjs';
    }
    
    const loadedPages = [];
    
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;
      
      // Get text content for this page
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      
      loadedPages.push({ canvas, pageNumber: i, text: pageText });
    }
    
    setPages(loadedPages);
  };


  return (
    <div data-pdf-viewer className="h-full overflow-y-auto overflow-x-hidden" style={{ backgroundColor: '#1A1A1A' }}>
      <div className="max-w-3xl mx-auto p-6">
        <div className="mb-4 card gradient-border">
          <div className="window-controls">
            <div className="window-dot window-dot-red"></div>
            <div className="window-dot window-dot-yellow"></div>
            <div className="window-dot window-dot-green"></div>
          </div>
          <h2 className="text-xl" style={{ fontFamily: 'Poppins, sans-serif', color: '#FFFFFF' }}>{fileName}</h2>
        </div>
        
        <div className="card gradient-border space-y-6">
          {pages.map(({ canvas, pageNumber }) => (
            <div key={pageNumber} className="pb-6 last:pb-0" style={{ borderBottom: '1px solid #FF4081' }}>
              <div className="mb-3 text-sm px-3 py-1 rounded-lg inline-block" style={{ fontFamily: 'Poppins, sans-serif', color: '#FF4081', backgroundColor: '#1A1A1A' }}>
                📄 Page {pageNumber}
              </div>
              <div className="flex justify-center mb-4">
                <img
                  src={canvas.toDataURL()}
                  alt={`Page ${pageNumber}`}
                  className="max-w-full h-auto rounded-lg"
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

