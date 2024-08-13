import React, { useEffect, useRef } from 'react';
import { pdfjs } from 'pdfjs-dist';

const PdfViewer = ({ fileData }) => {
  const canvasRef = useRef();

  useEffect(() => {
    Promise.resolve() // Ensure pdfjs is loaded
      .then(() => {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
      })
      .then(() => {
        const loadPdf = async () => {
          // ... rest of your loadPdf function
        };
  
        loadPdf();
      })
      .catch((error) => {
        console.error('Error loading PDF.js:', error);
      });
  }, [fileData]);

  return <canvas ref={canvasRef} />;
};

export default PdfViewer;
