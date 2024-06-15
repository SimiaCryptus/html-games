import React, {useEffect, useState} from 'react';
import {ThreeDObject} from './components/ThreeDObject.tsx';
import {ChoicesList} from './components/ChoicesList.tsx';
import {useMatchingGame} from './hooks/useMatchingGame.ts';
import './App.css';
import {generateConnectedRandomShape, generateSpecificShape} from './utils/shapeUtils.ts';

const App: React.FC = () => {
    const backgroundColors = ['#FFDDC1', '#C1FFD7', '#D1C1FF', '#FFC1E3', '#C1E3FF'];
    const [previousCorrectChoiceIndex, setPreviousCorrectChoiceIndex] = useState<number | null>(null);

    const generateNewQuestion = () => {
        let correctChoiceIndex;
        do {
            correctChoiceIndex = Math.floor(Math.random() * 5);
        } while (correctChoiceIndex === previousCorrectChoiceIndex);

        const choices = ['Shape1', 'Shape2', 'Shape3', 'Shape4', 'Shape5'];
        const correctChoice = choices[correctChoiceIndex];
        const exemplarShape = generateSpecificShape(correctChoiceIndex);
        const shapes = [
            ...choices.map((_, index) => index === correctChoiceIndex ? exemplarShape : generateConnectedRandomShape())
        ];
        setPreviousCorrectChoiceIndex(correctChoiceIndex);
        return {correctChoice, choices, shapes, exemplarShape};
    };

    const [question, setQuestion] = useState(() => generateNewQuestion());
    const {correctChoice, choices, shapes, exemplarShape} = question;

    const {
        selectedChoice,
        isMatch,
        handleSelect,
        score,
        timer
    } = useMatchingGame(correctChoice, () => setQuestion(generateNewQuestion()));

    const isInteractive = timer > 0;

    const randomBackgroundColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];

    useEffect(() => {
        setQuestion(generateNewQuestion());
    }, []);

    return (
        <div className="App" style={{backgroundColor: randomBackgroundColor}}>
            <header className="App-header">
                <h1>Shape Matching Game</h1>
                <p className="instructions">Select the shape that matches the 3D object</p>
                <p className="score">Score: {score}</p>
                <p className="timer">Time Left: {timer}s</p>
            </header>
            <main className="App-main">
                <div>
                    <ThreeDObject shape={exemplarShape}/>
                </div>
                <div>
                    <ChoicesList choices={choices} shapes={shapes} onSelect={handleSelect}
                                 isInteractive={isInteractive}/>
                    {selectedChoice && (
                        <p className="selection-result">
                            You selected: {selectedChoice} - {isMatch ? 'Correct!' : 'Try Again!'}
                        </p>
                    )}
                </div>
            </main>
            <footer className="App-footer">
                <p>Good luck!</p>
            </footer>
        </div>
    );
};

export default App;