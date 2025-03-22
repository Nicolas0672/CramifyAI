"use client"
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import FlashcardItem from './_components/FlashcardItem'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Progress } from "@/components/ui/progress"
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

function ViewFlashCards() {
  const { courseId } = useParams()

  const [flashCards, setFlashCards] = useState([])
  const [isFlipped, setIsFlipped] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [api, setApi] = useState()
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const [showComplete, setShowComplete] = useState(true)
  const [loading, setLoading] = useState(false)

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

  

  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashCards.length);
  };

  const handleComplete=async()=>{
    setLoading(true)
    const res = await axios.post('/api/handle-complete',{
      courseId: courseId,
      studyType: 'flashcard',
      type: 'study'
    })
    toast("Congratulations on finishing this section!")
    setLoading(false)
    setShowComplete(false)
  }

  const handleClick = () => setIsFlipped(!isFlipped)

  const GetFlashCards = async () => {
    try {
      const result = await axios.post('/api/study-type', {
        courseId: courseId,
        studyType: 'Flashcard'
      })
      
      // Pass the data directly to avoid any string manipulation that could break LaTeX
      // The FlashcardItem component will handle fixing the slash issues
      const processedData = result.data.content.data.map(card => {
        return {
          ...card,
          front: card.front || card.question || '',
          back: card.back || card.answer || ''
        };
      });
      
      console.log("Raw flashcard data:", processedData);
      setFlashCards(processedData)
    } catch (error) {
      console.error('Error fetching flashcards:', error)
    }
  }

  useEffect(()=>{
    setShowComplete(!flashCards[0]?.isDone)
   console.log(flashCards.isDone?'1':'2')
  },[flashCards])

  return (
    <div className='p-4 sm:p-6 md:p-10 bg-gradient-to-b from-gray-50 to-gray-100'>
      <h2 className='mb-3 text-2xl sm:text-3xl font-bold text-center text-blue-600'>
        AI <span className="text-purple-600">Flashcards</span>
      </h2>
      <p className='text-center text-gray-600 mb-6'>
        Master your concepts with interactive, intelligent flashcards!
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
                  cardIndex={currentIndex}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Styled Navigation Buttons */}
          <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:bg-blue-50 text-blue-600 border border-blue-200" />
          <CarouselNext className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:bg-blue-50 text-blue-600 border border-blue-200" />
        </Carousel>
        
        {/* Enhanced Progress Bar */}
        <div className="mt-8 sm:mt-12 w-full max-w-xs sm:max-w-md md:max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-blue-600 font-medium">Progress</span>
            <span className="text-xs text-gray-600">
              {currentIndex + 1} of {flashCards.length}
            </span>
          </div>
          <Progress value={progress} className="h-3 bg-gray-200 rounded-full" indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500" />
          
          {showComplete?<Button disabled={loading}className='mt-12 w-full shadow-sm cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300' 
          onClick={()=> handleComplete()}
        >
          Mark as complete
          </Button>:
          <Button 
          className='mt-12 w-full shadow-sm cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300' 
          onClick={()=> router.back()}
        >
          Return to Course
        </Button>
          }
        </div>
      </div>
    </div>
  );
}

export default ViewFlashCards