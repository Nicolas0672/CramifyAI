import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

function FlashcardItem({ flashcard }) {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleClick = () => setIsFlipped(!isFlipped)

    const renderContent = (content) => {
        if (content.includes('∫') || content.includes('^') || content.includes('\\')) {
            return <MathJax>{content}</MathJax>
        }
        return content
    }

    return (
        <MathJaxContext>
            <div className=''>
                <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
                    {/* Front of the flashcard */}
                    <div
                        onClick={handleClick}
                        className='shadow-lg p-4 bg-blue-500 text-white flex items-center justify-center rounded-lg cursor-pointer h-[200px] sm:h-[250px] md:h-[350px] w-[180px] sm:w-[250px] md:w-[300px]'
                    >
                        <h2>{renderContent(flashcard.front || "No Question")}</h2>
                    </div>

                    {/* Back of the flashcard */}
                    <div
                        onClick={handleClick}
                        className='p-4 bg-white shadow-lg text-blue-500 flex items-center justify-center rounded-lg cursor-pointer h-[200px] sm:h-[250px] md:h-[350px] w-[180px] sm:w-[250px] md:w-[300px]'
                    >
                        <h2>{renderContent(flashcard.back || "No Answer")}</h2>
                    </div>
                </ReactCardFlip>
            </div>
        </MathJaxContext>
    );
}

export default FlashcardItem;
