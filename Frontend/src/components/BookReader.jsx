
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button'; // Assuming this is your Shadcn Button
import { IoMdClose } from 'react-icons/io';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { FiMinimize, FiMaximize } from "react-icons/fi"; // Corrected import for FiMaximize
import { TbBrandZoom } from "react-icons/tb";
import { TbZoomInAreaFilled } from "react-icons/tb";
import { TbZoomOutAreaFilled } from "react-icons/tb";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Setup PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function BookReader({ pdfUrl, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1.0); // New state for zoom level
  const wrapperRef = useRef(null);
  const [magnifierEnabled, setMagnifierEnabled] = useState(false);
  const [hoverInfo, setHoverInfo] = useState({
    mouseX: 0,
    mouseY: 0,
    side: null, // "left" or "right"
  });
  const leftContainer = useRef(null);
  const rightContainer = useRef(null);

  const leftPageRef = useRef(null);
  const rightPageRef = useRef(null);


  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  const goNext = () => {
    setCurrentPage((prev) => Math.min(prev + 2, numPages - (numPages % 2 === 0 ? 0 : 1))); // Adjusted for two-page view
  };

  const goPrev = () => {
    setCurrentPage((prev) => Math.max(prev - 2, 1)); // Adjusted for two-page view
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.1, 3.0)); // Max zoom 3.0
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5)); // Min zoom 0.5
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      wrapperRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
    }
  };

  const toggleMagnifier = () => {
    setMagnifierEnabled(!magnifierEnabled);
    setHoverInfo({
      mouseX: 0,
      mouseY: 0,
      side: null, // "left" or "right"
    });
  };

  const handleMouseMove = (e, side, containerRef) => {
    if (!magnifierEnabled || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    setHoverInfo({
      mouseX: e.clientX,
      mouseY: e.clientY,
      side,
    });
  };

  useEffect(() => {
    const exitHandler = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener('fullscreenchange', exitHandler);
    return () => document.removeEventListener('fullscreenchange', exitHandler);
  }, []);

  // Removed basePageWidth and basePageHeight as `scale` will handle sizing
  // The containers should primarily adapt to the size of the rendered Page components.

  return (
    <div
      ref={wrapperRef}
      className="w-full h-screen max-h-screen fixed inset-0 z-50 flex justify-center items-center overflow-hidden"
    >
      <div className={`relative w-full h-full flex flex-col items-center bg-black/70 py-6 px-4 overflow-auto`}>
        {/* Top Right Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-40 bg-black p-2 rounded-md">
          <p
            onClick={onClose}
            className={`flex items-center border rounded-md justify-center p-1 text-black bg-white cursor-pointer`}
          >
            <IoMdClose className="h-5 w-5" />
          </p>
          <p
            onClick={toggleFullscreen}
            className={`flex items-center border rounded-md justify-center p-1 text-black bg-white cursor-pointer`}
          >
            {isFullscreen ? <FiMinimize className="h-5 w-5 " /> : <FiMaximize className="h-5 w-5" />}
          </p>
          <p
            onClick={toggleMagnifier}
            className={`flex items-center border rounded-md justify-center p-1 text-black bg-white cursor-pointer`}
          >
            {magnifierEnabled ? <TbZoomInAreaFilled className="h-5 w-5" /> : <TbZoomOutAreaFilled className="h-5 w-5" />}
          </p>
          {/* New Zoom In/Out Buttons */}
          <p
            onClick={zoomIn}
            className={`flex items-center border rounded-md justify-center p-1 text-black bg-white cursor-pointer`}
          >
            <ZoomIn className="h-5 w-5" />
          </p>
          <p
            onClick={zoomOut}
            className={`flex items-center border rounded-md justify-center p-1 text-black bg-white cursor-pointer`}
          >
            <ZoomOut className="h-5 w-5" />
          </p>
        </div>

        {/* PDF Viewer */}
        <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <div className="flex justify-center items-start gap-2 bg-black rounded-md ">
            {/* Left Page */}
            <div
              className="bg-white shadow rounded-l-md border p-1 flex justify-center items-center " // Added overflow-hidden
              onMouseMove={(e) => handleMouseMove(e, 'left', leftContainer)}
              onMouseLeave={() => setHoverInfo({ mouseX: 0, mouseY: 0, side: null })}
              ref={leftContainer}
            >
              {numPages ? (
                <>
                  <div ref={leftPageRef} className="react-pdf__Page__canvas-wrapper"> {/* Wrapper for canvas */}
                    <Page
                      pageNumber={currentPage}
                      scale={scale} // Apply scale here
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                      className="pdf-page-canvas" // Add a class for potential direct canvas styling
                    />
                  </div>
                  {magnifierEnabled && hoverInfo.side === 'left' && (
                    <Magnifier
                      mouseX={hoverInfo.mouseX}
                      mouseY={hoverInfo.mouseY}
                      pageRef={leftPageRef}
                    />
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Blank Page
                </div>
              )}
            </div>


            {/* Right Page */}
            <div
              className="bg-white shadow rounded-r-md border p-1 flex justify-center items-center " // Added overflow-hidden
              onMouseMove={(e) => handleMouseMove(e, 'right', rightContainer)}
              onMouseLeave={() => setHoverInfo({ mouseX: 0, mouseY: 0, side: null })}
              ref={rightContainer}
            >
              {numPages && currentPage + 1 <= numPages ? (
                <>
                  <div ref={rightPageRef} className="react-pdf__Page__canvas-wrapper"> {/* Wrapper for canvas */}
                    <Page
                      pageNumber={currentPage + 1}
                      scale={scale} // Apply scale here
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                      className="pdf-page-canvas" // Add a class for potential direct canvas styling
                    />
                  </div>
                  {magnifierEnabled && hoverInfo.side === 'right' && (
                    <Magnifier
                      mouseX={hoverInfo.mouseX}
                      mouseY={hoverInfo.mouseY}
                      pageRef={rightPageRef}
                    />
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Blank Page
                </div>
              )}
            </div>

          </div>
        </Document>

        {/* Navigation */}
        <div className="relative bottom-14 flex items-center gap-4 mt-6">
          <button onClick={goPrev} disabled={currentPage <= 1} className={`flex items-center justify-center px-2 py-1 ${isFullscreen ? 'text-black bg-white border-none rounded-md hover:bg-white/80' : 'text-white bg-black border-none rounded-md hover:bg-black/80'} transition-colors duration-300`}>
            <ChevronLeft className="w-4 h-4 " />
            <span className='text-xs'>Prev</span>
          </button>
          <p className={`text-sm mt-2 ${isFullscreen ? 'text-white' : 'text-black'} `}>
            Pages {currentPage} - {Math.min(currentPage + 1, numPages || 1)} of {numPages || 1}
          </p>
          <button onClick={goNext} disabled={currentPage >= numPages - (numPages % 2 === 0 ? 1 : 0)} // Adjusted for two-page view
            className={`flex items-center justify-center px-2 py-1 ${isFullscreen ? 'text-black bg-white border-none rounded-md hover:bg-white/80' : 'text-white bg-black border-none rounded-md hover:bg-black/80'} transition-colors duration-300`}>
            <span className='text-xs'>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}


// ✅ Magnifier Lens Component
const Magnifier = React.memo(({ mouseX, mouseY, pageRef }) => {
  const zoom = 2; // Fixed zoom for the magnifier itself
  const lensSize = 100;

  // Get the actual canvas element for the magnifier
  const canvas = pageRef.current?.querySelector('.react-pdf__Page__canvas'); // Target the actual canvas directly
  if (!canvas) return null;

  const rect = canvas.getBoundingClientRect();
  const width = canvas.width;
  const height = canvas.height;

  // Mouse position inside the canvas (used for background zoom)
  const x = mouseX - rect.left;
  const y = mouseY - rect.top;

  return (
    <div
      className="pointer-events-none fixed border-2 border-gray-500 rounded-full overflow-hidden z-50"
      style={{
        width: `${lensSize}px`,
        height: `${lensSize}px`,
        top: `${mouseY - lensSize / 2}px`, // viewport positioning
        left: `${mouseX - lensSize / 2}px`,
        boxShadow: '0 0 8px rgba(0,0,0,0.3)',
        backgroundImage: `url(${canvas.toDataURL()})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${width * zoom}px ${height * zoom}px`, // Scale the background image
        backgroundPosition: `-${x * zoom - lensSize / 2}px -${y * zoom - lensSize / 2}px`,
      }}
    ></div>
  );
});