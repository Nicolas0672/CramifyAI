import React, { useState } from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import { motion } from 'framer-motion';
import { Check, AlertCircle, HelpCircle, Lightbulb } from 'lucide-react';

function QuizCardItem({ quiz, userSelectedOption, setShowerAnswer }) {
  const [selectedOption, setSelectedOption] = useState();
  const [hoverOption, setHoverOption] = useState(null);

  if (!quiz) {
    return (
      <div className="p-12 text-center">
        <div className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100 max-w-md mx-auto">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-medium text-gray-500 mb-2">No Question Available</h3>
          <p className="text-gray-400">Please try refreshing or selecting another quiz.</p>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <MathJaxContext>
      <MathJax>
        <motion.div 
          className="py-8 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Question */}
          <div className="relative mb-12">
            <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-blue-100/50 blur-lg"></div>
            <div className="absolute -right-4 -bottom-4 w-8 h-8 rounded-full bg-purple-100/50 blur-lg"></div>
            
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative bg-white p-5 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-2xl"></div>
              <div className="px-2">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 mr-3">
                    <HelpCircle className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">Question</p>
                </div>
                
                <h2 className="font-medium text-2xl leading-relaxed text-gray-800">
                  {quiz?.question}
                </h2>
              </div>
            </motion.div>
          </div>

          {/* Options grid with enhanced styling */}
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8"
          >
            {quiz?.options.map((option, index) => (
              <motion.div
                key={index}
                variants={item}
                onMouseEnter={() => setHoverOption(option)}
                onMouseLeave={() => setHoverOption(null)}
              >
                <div
                  onClick={() => {
                    setSelectedOption(option);
                    userSelectedOption(option);
                    setShowerAnswer(false);
                  }}
                  className={`
                    relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer 
                    border-2 p-5 h-full flex items-center justify-center
                    ${selectedOption === option 
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50'
                      : hoverOption === option 
                        ? 'border-gray-300 bg-gray-50/70' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }
                  `}
                >
                  {/* Option letter badge */}
                  <div className={`
                    absolute top-3 left-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                    ${selectedOption === option 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-500'
                    }
                  `}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  
                  {/* Checkmark for selected option */}
                  {selectedOption === option && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                  
                  {/* Option text */}
                  <div className="text-center py-3 px-2 mt-2">
                    <span className={`text-lg leading-relaxed ${selectedOption === option ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                      {option}
                    </span>
                  </div>
                  
                  {/* Glow effect when selected */}
                  {selectedOption === option && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"></div>
                  )}
                  
                  {/* Animated border effects when selected */}
                  {selectedOption === option && (
                    <>
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-500"></div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Hint indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-sm">
              <Lightbulb className="w-4 h-4" />
              <span>Select the best answer</span>
            </div>
          </motion.div>
        </motion.div>
      </MathJax>
    </MathJaxContext>
  );
}

export default QuizCardItem;