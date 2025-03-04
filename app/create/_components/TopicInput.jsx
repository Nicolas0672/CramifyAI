"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Upload } from 'lucide-react'
import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

function TopicInput({setTopic, setDifficultyLevel, setComment, handleUserInput, formData}) {
    const [hasPdf, setHasPdf] = useState(false)

    const handleFileUpload = (event) =>{
        const file = event.target.files[0]

        if(file && file.type == "application/pdf"){
            handleUserInput("pdfFile", file)
        }
        else{
            alert("Please upload a valid PDF file.");
        }
    }

    

    return (
        <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            {/* Topic Input */}
            <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-semibold">Topic:</h2>
                <Input onChange={(event)=>setTopic(event.target.value)} placeholder="Ex. Biology" className="w-64 border-gray-300 shadow-sm" />
            </div>

            {/* Difficulty Level */}
            <div className="mb-4">
                <h2 className="text-md font-medium mb-2">Select the difficulty level</h2>
                <Select onValueChange={(value) => setDifficultyLevel(value)}>
                    <SelectTrigger className="w-64 border-gray-300 shadow-sm">
                        <SelectValue placeholder="Difficulty Level" />
                    </SelectTrigger>
                    <SelectContent className="w-64">
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* PDF Upload Option */}
            <div className="text-center">
                <h2 className="font-medium text-md mb-3">Would you like to upload a PDF file?</h2>
                <div className="flex justify-center gap-4">
                    <Button 
                        variant="outline" 
                        className={`w-24 ${hasPdf ? 'bg-gray-200 border-gray-400' : ''}`} 
                        onClick={() => setHasPdf(true)}
                    >
                        Yes
                    </Button>
                    <Button 
                        variant="outline" 
                        className={`w-24 ${!hasPdf ? 'bg-gray-200 border-gray-400' : ''}`} 
                        onClick={() => setHasPdf(false)}
                    >
                        No
                    </Button>
                </div>
            </div>

            {/* PDF Upload or Textarea */}
            {hasPdf ? (
                <div className="mt-5 flex flex-col items-center">
                    <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                        <Upload size={18} />
                        <span className="text-sm font-medium">
                            
                            {formData.pdfFile ? formData.pdfFile.name : "Upload PDF"}
                        </span>
                        <input onChange={handleFileUpload} type="file" accept="application/pdf" className="hidden" />
                    </label>
                    
                </div>
            ) : (
                <div className="mt-5">
                    <h2 className="text-md font-medium text-center">Type in your content to start generating</h2>
                    <Textarea 
                        className="mt-2 w-full h-32 border-gray-300 shadow-sm rounded-lg p-2" 
                        placeholder="Start writing here..." 
                        onChange={(event)=>setComment(event.target.value)}
                    />
                </div>
            )}
        </div>
    )
}

export default TopicInput
