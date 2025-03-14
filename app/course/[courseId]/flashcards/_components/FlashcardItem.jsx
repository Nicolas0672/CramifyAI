import React, { useEffect, useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

function FlashcardItem({ flashcard, isFlipped, onClick }) {
  // IMPORTANT: Remove the following line from your code if it exists
  // const santiziedContent = content.replace(/\\/g, '')
  
  useEffect(() => {
    console.log("Raw flashcard content:", flashcard);
  }, [flashcard]);
  
  const renderContent = (content) => {
    if (!content) return "No content";
    
    // CRITICAL: Check if we need to replace single backslashes
    // This handles cases where the content already has / instead of \
    let fixedContent = content;
    
    // If we see math delimiters with forward slashes instead of backslashes, fix them
    if (content.includes('$') && content.includes('/') && !content.includes('\\')) {
      // Replace forward slashes with backslashes but only between $ delimiters
      fixedContent = content.replace(/(\$)(.*?)(\$)/g, function(match, opener, formula, closer) {
        // Replace / with \ only within the formula part
        return opener + formula.replace(/\//g, '\\') + closer;
      });
      
      console.log("Fixed content with backslashes:", fixedContent);
    }
    
    // Always wrap in MathJax regardless of content detection
    // This ensures all math gets processed
    return (
      <MathJax>
        {fixedContent}
      </MathJax>
    );
  };
  
  return (
    <MathJaxContext 
      config={{
        tex: {
          inlineMath: [['$', '$']],
          displayMath: [['$$', '$$']],
          processEscapes: true,
          packages: ['base', 'ams', 'noerrors', 'noundefined']
        },
        startup: {
          typeset: true
        },
        svg: {
          fontCache: 'global'
        },
        options: {
          enableMenu: false,
          renderActions: {
            addMenu: [],
            checkLoading: []
          }
        }
      }}
    >
      <div className=''>
        <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
          {/* Front of the flashcard - AI-themed styling */}
          <div
            onClick={onClick}
            className='relative shadow-lg p-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center rounded-lg cursor-pointer h-[200px] sm:h-[250px] md:h-[350px] w-[180px] sm:w-[250px] md:w-[300px] transition-all duration-300 hover:shadow-xl overflow-hidden'
          >
            {/* AI-themed decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-2 left-2 w-8 h-8 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-16 h-1 bg-white rounded"></div>
              <div className="absolute top-12 right-3 w-1 h-12 bg-white rounded"></div>
              <div className="absolute bottom-12 left-6 w-6 h-6 border border-white rounded-sm transform rotate-45"></div>
            </div>
            
            <div className="z-10 text-center">
              <div className="mb-2 text-xs font-mono uppercase tracking-wide opacity-70">Question</div>
              <h2 className="font-medium">{renderContent(flashcard.front || "No Question")}</h2>
            </div>
          </div>
          
          {/* Back of the flashcard - AI-themed styling */}
          <div
            onClick={onClick}
            className='relative shadow-lg p-4 bg-white text-blue-800 flex items-center justify-center rounded-lg cursor-pointer h-[200px] sm:h-[250px] md:h-[350px] w-[180px] sm:w-[250px] md:w-[300px] transition-all duration-300 hover:shadow-xl overflow-hidden'
          >
            {/* AI-themed decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-2 right-2 w-12 h-1 bg-blue-500 rounded"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-2 border-blue-500 rounded-md"></div>
              <div className="absolute top-10 left-6 w-1 h-10 bg-blue-500 rounded"></div>
              <div className="absolute top-6 right-8 w-4 h-4 border border-blue-500 transform rotate-12"></div>
            </div>
            
            <div className="z-10 text-center">
              <div className="mb-2 text-xs font-mono uppercase tracking-wide text-blue-500 opacity-70">Answer</div>
              <h2 className="font-medium">{renderContent(flashcard.back || "No Answer")}</h2>
            </div>
          </div>
        </ReactCardFlip>
      </div>
    </MathJaxContext>
  );
};

export default FlashcardItem;