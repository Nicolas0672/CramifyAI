"use client"
import { createContext, useContext, useState } from "react";

const StudyContext = createContext()

export const useStudy = () =>{
    return useContext(StudyContext)
}

export const StudyProvider = ({children}) => {
    const [selectedStudyType, setSelectedStudyType] = useState(null)

    return (
        <StudyContext.Provider value={{ selectedStudyType, setSelectedStudyType}}>
            {children}
        </StudyContext.Provider>
    )
}