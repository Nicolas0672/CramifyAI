import React, { useState, useEffect } from 'react';

function FlashcardEditModal({ isOpen, onClose, flashcard, side, onSave }) {
  const [content, setContent] = useState('');
  
  useEffect(() => {
    if (flashcard) {
      setContent(side === 'front' ? flashcard.front : flashcard.back);
    }
  }, [flashcard, side]);
  
  const handleSave = () => {
    const updatedFlashcard = {
      ...flashcard,
      [side]: content
    };
    onSave(updatedFlashcard);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-white/30">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-700">
            Edit {side === 'front' ? 'Question' : 'Answer'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {side === 'front' ? 'Question' : 'Answer'} Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-3 h-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter ${side === 'front' ? 'question' : 'answer'} content...`}
          />
          <p className="text-xs text-gray-500 mt-1">
            Use $...$ for inline math and $$...$$ for block math.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default FlashcardEditModal;