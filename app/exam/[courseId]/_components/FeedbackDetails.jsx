import React from 'react';
import { MathJax } from 'better-react-mathjax';

function FeedbackDetails({ feedback, index }) {
  // No need for MathJax loading or typesetting effects as better-react-mathjax handles this

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'bg-green-100 text-green-800 border-green-300';
    if (rating >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  // Function to fix common LaTeX syntax errors
  const formatMathContent = (content) => {
    if (!content) return '';
  
    // If it already contains $...$, assume it's fine
    if (content.includes('$')) return content;
  
    // If any LaTeX-like pattern is found, wrap the whole thing in $...$
    const containsMath = /\\(frac|sqrt|int|sum|prod|lim|log|ln|sin|cos|tan)/.test(content);
  
    if (containsMath) {
      return `$${content}$`;  // full expression wrapped in one block
    }
  
    return content;
  };
  
  

  return (
    <div className="p-4 mb-4 bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center mb-3">
        <div className="flex-shrink-0 mr-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-800">Question {index + 1}</h3>
          <MathJax>
            <div className="text-sm text-gray-600 math-content" dangerouslySetInnerHTML={{ __html: formatMathContent(feedback.question) }} />
          </MathJax>
        </div>
        <div className={`ml-4 px-3 py-1 rounded-full border ${getRatingColor(feedback.aiResponse.feedback.rating)}`}>
          <span className="font-semibold">{feedback.aiResponse.feedback.rating}/10</span>
        </div>
      </div>
      
      <div className="ml-12">
        {/* User's Answer Section */}
        <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
          <div className="flex items-center mb-1">
            <svg className="w-4 h-4 mr-1 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            <h4 className="text-sm font-semibold text-purple-800">Your Answer</h4>
          </div>
          <MathJax>
            <div className="text-sm text-gray-700 math-content" dangerouslySetInnerHTML={{ __html: formatMathContent(feedback.userAns) }} />
          </MathJax>
        </div>
        
        {/* AI Feedback Section */}
        <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center mb-1">
            <svg className="w-4 h-4 mr-1 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <h4 className="text-sm font-semibold text-blue-800">AI Feedback</h4>
          </div>
          <MathJax>
            <div className="text-sm text-gray-700 math-content">
            {formatMathContent(feedback.aiResponse.feedback.explanation)}
              </div>  
          </MathJax>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Additional content can go here */}
        </div>
      </div>
    </div>
  );
}

export default FeedbackDetails;