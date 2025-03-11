"use client"
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import FlashcardItem from './_components/flashcardItem'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Progress } from "@/components/ui/progress"
import { Button } from '@/components/ui/button'

function ViewFlashCards() {
  const { courseId } = useParams()

  const [flashCards, setFlashCards] = useState([])
  const [isFlipped, setIsFlipped] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [api, setApi] = useState()
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  useEffect(() => {
    GetFlashCards()
  }, [])

  useEffect(() => {
    if (!api) return

    api.on('select', () => {
      const newIndex = api.selectedScrollSnap()
      setCurrentIndex(newIndex)
      updateProgress(newIndex)
    })
  }, [api, flashCards])

  const updateProgress = (index) => {
    const total = flashCards.length
    if (total === 0) return
    const progressValue = ((index + 1) / total) * 100
    setProgress(progressValue)
  }

  const handleClick = () => setIsFlipped(!isFlipped)

  const GetFlashCards = async () => {
    try {
      const result = await axios.post('/api/study-type', {
        courseId: courseId,
        studyType: 'Flashcard'
      })
      setFlashCards(result.data.content.data)
    } catch (error) {
      console.error('Error fetching flashcards:', error)
    }
  }

  return (
    <div className='p-4 sm:p-6 md:p-10'>
      <h2 className='mb-3 text-2xl sm:text-3xl font-bold text-center text-blue-600'>
        Flashcards
      </h2>
      <p className='text-center text-gray-600 mb-4'>
        Master your concepts with interactive flashcards!
      </p>

      <div className="relative mt-6">
        <Carousel setApi={setApi} className="w-full max-w-xs sm:max-w-md md:max-w-4xl mx-auto">
          <CarouselContent>
            {flashCards.map((flashcard, index) => (
              <CarouselItem
                key={index}
                className="flex items-center justify-center h-[200px] sm:h-[300px] md:h-[350px]"
              >
                <FlashcardItem 
                  flashcard={flashcard} 
                  isFlipped={isFlipped} 
                  onClick={handleClick} 
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Buttons */}
          <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:bg-gray-100" />
          <CarouselNext className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:bg-gray-100" />
        </Carousel>

        {/* Progress Bar */}
        <div className="mt-6 sm:mt-10 w-full max-w-xs sm:max-w-md md:max-w-4xl mx-auto">
          <Progress value={progress} className="h-2 bg-gray-200" />
          <p className="text-xs sm:text-sm text-gray-600 mt-2 text-center">
            {currentIndex + 1} of {flashCards.length} flashcards
          </p>
          <Button className='mt-20 w-full shadow-sm cursor-pointer' onClick={()=> router.back()} variant='outline'>Go back to course page</Button>
        </div>
        
      </div>

      
    </div>
  )
}

export default ViewFlashCards
