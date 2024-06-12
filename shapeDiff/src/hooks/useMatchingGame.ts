import { useState } from 'react';

const useMatchingGame = (correctChoice: string) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isMatch, setIsMatch] = useState<boolean | null>(null);

  const handleSelect = (choice: string) => {
    setSelectedChoice(choice);
    setIsMatch(choice === correctChoice);
  };

  return {
    selectedChoice,
    isMatch,
    handleSelect,
  };
};

export default useMatchingGame;