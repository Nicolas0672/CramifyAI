import React, { useEffect, useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { Pencil } from 'lucide-react';

function FlashcardItem({ flashcard, isFlipped, onClick, cardIndex, isMember, onEdit }) {
  // Add state to track the current card index
  const [previousCardIndex, setPreviousCardIndex] = useState(cardIndex);
  
  useEffect(() => {
    console.log("Raw flashcard content:", flashcard);
  }, [flashcard]);
  
  // Add effect to reset flip state when card changes
  useEffect(() => {
    // Check if we've moved to a new card
    if (previousCardIndex !== cardIndex) {
      // Update our tracked index
      setPreviousCardIndex(cardIndex);
      
      // If the card is currently flipped (showing answer), reset it
      if (isFlipped) {
        // Call the onClick handler which should toggle the flip state
        onClick();
      }
    }
  }, [cardIndex, previousCardIndex, isFlipped, onClick]);
  
  const renderContent = (content) => {
    if (!content) return "No content";
    
    let fixedContent = content;
    
    if (content.includes('$') && content.includes('/') && !content.includes('\\')) {
      fixedContent = content.replace(/(\$)(.*?)(\$)/g, function(match, opener, formula, closer) {
        return opener + formula.replace(/\//g, '\\') + closer;
      });
      
      console.log("Fixed content with backslashes:", fixedContent);
    }
    
    return (
      <MathJax>
        {fixedContent}
      </MathJax>
    );
  };

  const handleEditClick = (e, side) => {
    e.stopPropagation(); // Prevent card flip when clicking the edit button
    if (onEdit) {
      onEdit(flashcard, side);
    }
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
      <div className='w-full max-w-xs sm:max-w-sm md:max-w-md'>
        <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
          {/* Front of the flashcard - Enhanced AI-themed styling */}
          <div
            onClick={onClick}
            className='relative shadow-lg p-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center rounded-xl cursor-pointer h-[220px] sm:h-[270px] md:h-[350px] w-full transition-all duration-300 hover:shadow-xl overflow-hidden'
          >
            {/* Edit button for members */}
            {isMember && (
              <button 
                onClick={(e) => handleEditClick(e, 'front')}
                className="absolute top-2 right-2 p-2 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all z-20"
                aria-label="Edit question"
              >
                <Pencil size={16} className="text-white" />
              </button>
            )}
            
            {/* Enhanced AI-themed decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-15">
              <div className="absolute top-3 left-3 w-10 h-10 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-6 right-6 w-20 h-1 bg-white rounded"></div>
              <div className="absolute top-14 right-4 w-1 h-16 bg-white rounded"></div>
              <div className="absolute bottom-16 left-8 w-8 h-8 border border-white rounded-sm transform rotate-45"></div>
              <div className="absolute top-20 left-20 w-4 h-4 border-2 border-white rounded-full"></div>
              <div className="absolute top-6 right-16 w-12 h-1 bg-white rounded"></div>
            </div>
            
            <div className="z-10 text-center w-full px-4">
              <div className="mb-3 text-sm font-mono uppercase tracking-wide opacity-80">Question</div>
              <div className="font-medium overflow-auto max-h-[150px] sm:max-h-[180px] md:max-h-[250px] text-lg">
                {renderContent(flashcard.front || "No Question")}
              </div>
            </div>
          </div>
          
          {/* Back of the flashcard - Enhanced AI-themed styling */}
          <div
            onClick={onClick}
            className='relative shadow-lg p-6 bg-white text-blue-800 flex items-center justify-center rounded-xl cursor-pointer h-[220px] sm:h-[270px] md:h-[350px] w-full transition-all duration-300 hover:shadow-xl overflow-hidden'
          >
            {/* Edit button for members */}
            {isMember && (
              <button 
                onClick={(e) => handleEditClick(e, 'back')}
                className="absolute top-2 right-2 p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-all z-20"
                aria-label="Edit answer"
              >
                <Pencil size={16} className="text-blue-800" />
              </button>
            )}
            
            {/* Enhanced AI-themed decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-15">
              <div className="absolute top-3 right-3 w-16 h-1 bg-blue-500 rounded"></div>
              <div className="absolute bottom-5 left-5 w-10 h-10 border-2 border-purple-500 rounded-md"></div>
              <div className="absolute top-12 left-8 w-1 h-12 bg-purple-500 rounded"></div>
              <div className="absolute top-8 right-10 w-6 h-6 border border-blue-500 transform rotate-12"></div>
              <div className="absolute bottom-20 right-14 w-5 h-5 border-2 border-purple-500 rounded-full"></div>
              <div className="absolute bottom-8 right-8 w-14 h-1 bg-blue-500 rounded"></div>
            </div>
            
            <div className="z-10 text-center w-full px-4">
              <div className="mb-3 text-sm font-mono uppercase tracking-wide text-purple-600 opacity-80">Answer</div>
              <div className="font-medium overflow-auto max-h-[150px] sm:max-h-[180px] md:max-h-[250px] text-lg">
                {renderContent(flashcard.back || "No Answer")}
              </div>
            </div>
          </div>
        </ReactCardFlip>
      </div>
    </MathJaxContext>
  );
};

export default FlashcardItem;