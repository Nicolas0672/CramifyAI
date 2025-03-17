// FloatingStudyElements.js
import React from 'react';

const FloatingStudyElements = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Books */}
      <div className="absolute top-[8%] right-[15%] w-16 h-20 bg-blue-900 shadow-md rounded opacity-10 animate-float-slow transform rotate-12">
        <div className="absolute inset-y-0 right-0 w-1 bg-blue-800"></div>
        <div className="absolute inset-1 bg-blue-100 border-t border-gray-300"></div>
      </div>
      <div className="absolute top-[60%] left-[8%] w-14 h-18 bg-red-800 shadow-md rounded opacity-8 animate-float transform -rotate-6">
        <div className="absolute inset-y-0 right-0 w-1 bg-red-900"></div>
        <div className="absolute inset-1 bg-red-50 border-t border-gray-300"></div>
      </div>
      <div className="absolute bottom-[30%] left-[22%] w-16 h-20 bg-green-800 shadow-md rounded opacity-10 animate-float-medium transform rotate-3">
        <div className="absolute inset-y-0 right-0 w-1 bg-green-900"></div>
        <div className="absolute inset-1 bg-green-50 border-t border-gray-300"></div>
      </div>
      
      {/* Pencils */}
      <div className="absolute top-[35%] left-[20%] w-2 h-24 bg-amber-700 opacity-12 animate-float-medium transform -rotate-45">
        <div className="absolute top-0 w-2 h-3 bg-pink-300"></div>
        <div className="absolute bottom-0 w-2 h-5 bg-zinc-300"></div>
      </div>
      <div className="absolute bottom-[15%] right-[25%] w-1 h-20 bg-amber-800 opacity-10 animate-float-slow transform rotate-30">
        <div className="absolute top-0 w-1 h-2 bg-red-300"></div>
        <div className="absolute bottom-0 w-1 h-3 bg-zinc-400"></div>
      </div>
      
      {/* Notebooks */}
      <div className="absolute bottom-[25%] right-[10%] w-20 h-24 bg-slate-100 shadow-md rounded opacity-12 animate-float">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-sky-600"></div>
        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-300"></div>
        <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-slate-300"></div>
        <div className="absolute left-9 top-2 bottom-2 w-0.5 bg-slate-300"></div>
      </div>
      
      {/* Calculator */}
      <div className="absolute top-[70%] right-[30%] w-16 h-20 bg-gray-700 rounded opacity-10 animate-float-medium">
        <div className="absolute inset-1 bg-gray-200 rounded grid grid-cols-4 gap-0.5 p-1">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-gray-400 rounded-sm"></div>
          ))}
        </div>
      </div>
      
      {/* Coffee cup */}
      <div className="absolute top-[40%] right-[15%] opacity-10 animate-float-slow">
        <div className="w-10 h-12 bg-stone-400 rounded-b-lg"></div>
        <div className="absolute top-1 left-1 right-1 h-2 bg-stone-300 rounded-t-sm"></div>
        <div className="absolute -right-3 top-2 w-3 h-6 border-2 border-stone-400 rounded-r-lg"></div>
      </div>
      
      {/* Formulas */}
      <div className="absolute top-[20%] right-[40%] text-4xl opacity-8 animate-float-medium font-serif">E=mc²</div>
      <div className="absolute bottom-[40%] left-[35%] text-3xl opacity-6 animate-float-slow font-serif">a²+b²=c²</div>
      <div className="absolute top-[50%] left-[55%] text-2xl opacity-7 animate-float font-serif">F=ma</div>
      
      {/* Graduation cap */}
      <div className="absolute top-[15%] left-[40%] w-20 h-10 bg-black opacity-10 animate-float-medium">
        <div className="absolute -top-5 left-2 right-2 h-5 bg-black rounded-t-lg"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-black rounded-full"></div>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-1/4 w-10 h-1 bg-yellow-600"></div>
      </div>
      
      {/* Highlighter */}
      <div className="absolute top-[65%] right-[45%] w-4 h-14 bg-yellow-400 opacity-10 animate-float transform rotate-12">
        <div className="absolute top-0 left-0 right-0 h-3 bg-yellow-500 rounded-t-sm"></div>
      </div>
      
      {/* Light particles */}
      <div className="absolute h-3 w-3 rounded-full bg-blue-300 opacity-15 top-1/4 left-1/3 animate-pulse"></div>
      <div className="absolute h-4 w-4 rounded-full bg-indigo-300 opacity-10 top-2/3 left-1/4 animate-pulse-slow"></div>
      <div className="absolute h-2 w-2 rounded-full bg-purple-300 opacity-12 top-1/2 right-1/4 animate-pulse-medium"></div>
      <div className="absolute h-3 w-3 rounded-full bg-green-300 opacity-10 bottom-1/4 right-1/3 animate-pulse"></div>
      <div className="absolute h-2 w-2 rounded-full bg-yellow-300 opacity-8 bottom-1/3 left-2/3 animate-pulse-slow"></div>
    </div>
  );
};

export default FloatingStudyElements;