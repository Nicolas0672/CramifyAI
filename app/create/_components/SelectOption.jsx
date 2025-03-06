import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useState } from 'react';

function SelectOption({ selectedStudyType }) {
    const Options = [
        {
            name: 'Study',
            icon: '/knowledge.png',
            color: 'bg-blue-50',
            hoverColor: 'hover:bg-blue-100',
        },
        {
            name: 'Practice',
            icon: '/practice.png',
            color: 'bg-green-50',
            hoverColor: 'hover:bg-green-100',
        },
        {
            name: 'Exam',
            icon: '/exam_1.png',
            color: 'bg-red-50',
            hoverColor: 'hover:bg-red-100',
        },
    ];

    const [selectOption, setSelectOption] = useState(null);

    return (
        <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
            <h2 className="text-center mb-6 text-2xl font-semibold text-gray-800">Choose Your Path</h2>
            <div className="flex justify-center"> {/* Center the grid container */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl"> {/* Adjust grid for 3 columns */}
                    {Options.map((option, index) => (
                        <div
                            key={index}
                            className={`cursor-pointer p-6 flex flex-col items-center justify-center border-2 rounded-xl transition-all duration-300 ease-in-out 
                                ${option.color} ${option.hoverColor} 
                                ${option.name === selectOption ? 'border-primary shadow-lg scale-105' : 'border-transparent'}`}
                            onClick={() => {
                                setSelectOption(option.name);
                                selectedStudyType(option.name);
                            }}
                        >
                            <div className="p-3 rounded-full bg-white shadow-md">
                                <Image src={option.icon} alt={option.name} width={40} height={40} />
                            </div>
                            <h2 className="mt-3 text-lg font-medium text-gray-700">{option.name}</h2>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SelectOption;