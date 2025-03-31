"use client"
const { createContext, useContext, useState } = require("react");

const LearningModeContext = createContext()

export const useLearningMode = () =>{
    const context = useContext(LearningModeContext)
    return context
}

export const LearningModeProvider = ({children}) =>{
    const [currentModes, setCurrentMode] = useState('teach')
    const setMode = (mode) =>{
        if(['teach', 'study', 'practice', 'exam'].includes(mode)) setCurrentMode(mode)
    }

    return (
        <LearningModeContext.Provider value={{currentModes, setMode}}>
            {children}
        </LearningModeContext.Provider>
    )
}