// app/layout.jsx
'use client';
import { createContext, useContext, useState } from 'react';

const CourseContext = createContext();

export function CourseProvider({ children }) {
  const [course, setCourse] = useState(null);
  return (
    <CourseContext.Provider value={{ course, setCourse }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourse() {
  return useContext(CourseContext);
}