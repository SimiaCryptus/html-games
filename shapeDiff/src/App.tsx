import React from 'react';
import { ThreeDObject } from './components/ThreeDObject.tsx';
import { ChoicesList } from './components/ChoicesList.tsx';
import useMatchingGame from './hooks/useMatchingGame.ts';
import './App.css';
import { generateRandomShape, generateSpecificShape } from './utils/shapeUtils.ts';

const App: React.FC = () => {
  const correctChoiceIndex = Math.floor(Math.random() * 3);
  const choices = ['Shape1', 'Shape2', 'Shape3'];
  const correctChoice = choices[correctChoiceIndex];
  
  const { selectedChoice, isMatch, handleSelect } = useMatchingGame(correctChoice);

  const exemplarShape = generateSpecificShape(correctChoiceIndex);
  const shapes = [
    correctChoiceIndex === 0 ? exemplarShape : generateRandomShape(),
    correctChoiceIndex === 1 ? exemplarShape : generateRandomShape(),
    correctChoiceIndex === 2 ? exemplarShape : generateRandomShape()
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Shape Matching Game</h1>
        <p className="instructions">Select the shape that matches the 3D object</p>
      </header>
      <main className="App-main">
        <div>
          <ThreeDObject shape={exemplarShape} />
        </div>
        <div>
          <ChoicesList choices={choices} shapes={shapes} onSelect={handleSelect} />
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