import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useState } from 'react'

function SelectOption({selectedStudyType}) {
    const Options=[
        {
            name:'Exam',
            icon:'/exam_1.png'
        },
        {
            name:'Study',
            icon:'/knowledge.png'
        },
        {
            name:'Practice',
            icon:'/practice.png'
        },
        {
            name:'Coding Prep',
            icon:"/code.png"
        }
    ]

    const [selectOption, setSelectOption] = useState()
  return (
    <div>
    <h2 className='text-center mb-2 text-lg'>Choose your path</h2>
    <div className=' mt-5 ml-30 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5'>
        {Options.map((option, index) => (
            <div key={index} className={`hover:border-primary cursor-pointer p-4 flex flex-col items-center justify-center border rounded-xl
                ${option?.name==selectOption&&'border-primary'}`}
            onClick={() => {setSelectOption(option.name);selectedStudyType(option.name)}}
            >
                <Image src={option.icon} alt={option.name} width={50} height={50} />
                <h2 className=' mt-2 text-sm'>{option.name}</h2>
            </div>
        ))}
    </div>
    
</div>
  )
}

export default SelectOption