import React, {useState} from 'react';

export const useMatchingGame = (correctChoice: string, onNextQuestion: () => void) => {
    const [score, setScore] = useState<number>(0);
    const [timer, setTimer] = useState<number>(60); // 60 seconds timer

    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const [isMatch, setIsMatch] = useState<boolean | null>(null);

    const handleSelect = (choice: string) => {
        setSelectedChoice(choice);
        setIsMatch(choice === correctChoice);
        if (choice === correctChoice) {
            setScore(prevScore => prevScore + 3);
        } else {
            setScore(prevScore => prevScore - 1);
        }
        // Move to next puzzle
        setTimeout(() => {
            setSelectedChoice(null);
            setIsMatch(null);
            onNextQuestion();
        }, 1000);
    };

    // Timer logic
    React.useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    return {
        selectedChoice,
        isMatch,
        handleSelect,
        score,
        timer,
    };
};

export default useMatchingGame;