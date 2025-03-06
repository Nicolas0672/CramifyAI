"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, BookOpen, PenTool } from 'lucide-react'; // Added more icons
import React, { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

function TopicInput({ setTopic, setDifficultyLevel, setComment, handleUserInput, formData, onFileChange }) {
    const [hasPdf, setHasPdf] = useState(false);

     const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (file && file.type === "application/pdf") {
             handleUserInput("pdfFile", file);
             onFileChange(file)
         } else {
             alert("Please upload a valid PDF file.");
         }
     };

     return (
        <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            {/* Topic Input */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <BookOpen size={20} className="text-blue-500" /> What topic are you studying?
                </h2>
                <Input
                    required
                    onChange={(event) => setTopic(event.target.value)}
                    placeholder="Ex. Biology, Calculus, History..."
                    className="w-full border-gray-300 shadow-sm rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
            </div>
    
            {/* Difficulty Level */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <PenTool size={20} className="text-blue-500" /> Select the difficulty level
                </h2>
                <Select onValueChange={(value) => setDifficultyLevel(value)}>
                    <SelectTrigger className="w-full border-gray-300 shadow-sm rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                        <SelectValue placeholder="Difficulty Level" />
                    </SelectTrigger>
                    <SelectContent className="w-full">
                        <SelectItem value="Easy" className="text-green-600">Easy</SelectItem>
                        <SelectItem value="Moderate" className="text-yellow-600">Moderate</SelectItem>
                        <SelectItem value="Hard" className="text-red-600">Hard</SelectItem>
                    </SelectContent>
                </Select>
            </div>
    
            {/* PDF Upload Option */}
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <FileText size={20} className="text-blue-500" /> Do you have a PDF to upload?
                </h2>
                <div className="flex justify-center gap-4">
                    <Button
                        variant={hasPdf ? "default" : "outline"}
                        className={`cursor-pointer w-24 flex items-center gap-2 transition-all ${hasPdf ? 'cursor-pointer bg-blue-500 hover:bg-blue-600' : 'bg-white hover:bg-gray-50'}`}
                        onClick={() => setHasPdf(true)}
                    >
                        Yes
                    </Button>
                    <Button
                        variant={!hasPdf ? "default" : "outline"}
                        className={`cursor-pointer w-24 flex items-center gap-2 transition-all ${!hasPdf ? 'cursor-pointer bg-blue-500 hover:bg-blue-600' : 'bg-white hover:bg-gray-50'}`}
                        onClick={() => setHasPdf(false)}
                    >
                        No
                    </Button>
                </div>
            </div>
    
            {/* PDF Upload or Textarea */}
            {hasPdf ? (
                <div className="mt-6 flex flex-col items-center">
                    <label className="flex items-center gap-3 px-6 py-3 border-2 border-dashed border-blue-500 rounded-xl cursor-pointer hover:bg-blue-50 transition-all">
                        <Upload size={20} className="text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">
                            {formData.pdfFile ? formData.pdfFile.name : "Click to upload PDF"}
                        </span>
                        <input required onChange={handleFileUpload} type="file" accept="application/pdf" className="hidden" />
                    </label>
                    <p className="mt-2 text-sm text-gray-500">Max file size: 5MB</p>
                </div>
            ) : (
                <div className="mt-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <PenTool size={20} className="text-blue-500" /> Type your content
                    </h2>
                    <Textarea
                        required
                        className="w-full h-40 border-gray-300 shadow-sm rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Start writing here..."
                        onChange={(event) => setComment(event.target.value)}
                    />
                </div>
            )}
        </div>
    )
}

export default TopicInput