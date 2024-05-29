import React, { useEffect, useRef, useState } from "react";
import "./style.css";

const paragraph = `A plant is one of the most important living things that develop
on the earth and is made up of stems, leaves, roots, and so on. Parts of Plants:
The part of the plant that developed beneath the soil is referred to as root and
the part that grows outside of the soil is known as shoot. The shoot consists of
stems, branches, leaves, fruits, and flowers. Plants are made up of six main parts:
roots, stems, leaves, flowers, fruits, and seeds.`;

const TypingTest = () => {
    const maxTime = 60;
    const [timeLeft, setTimeLeft] = useState(maxTime);
    const [mistakes, setMistakes] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [WPM, setWPM] = useState(0);
    const [CPM, setCPM] = useState(0);
    const inputRef = useRef(null);
    const charRefs = useRef([]);
    const [correctWrong, setCorrectWrong] = useState(Array(paragraph.length).fill(""));

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    useEffect(() => {
        let interval;
        if (isTyping && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsTyping(false);
        }
        return () => clearInterval(interval);
    }, [isTyping, timeLeft]);

    useEffect(() => {
        const correctChars = charIndex - mistakes;
        const totalTime = (maxTime - timeLeft) / 60;

        const cpm = Math.round(correctChars / totalTime);
        setCPM(isNaN(cpm) || !isFinite(cpm) ? 0 : cpm);

        const wpm = Math.round((correctChars / 5) / totalTime);
        setWPM(isNaN(wpm) || !isFinite(wpm) ? 0 : wpm);
    }, [charIndex, mistakes, timeLeft]);

    const resetGame = () => {
        setIsTyping(false);
        setTimeLeft(maxTime);
        setCharIndex(0);
        setMistakes(0);
        setCPM(0);
        setWPM(0);
        setCorrectWrong(Array(paragraph.length).fill(''));
        inputRef.current.value = "";
        inputRef.current.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Backspace" && charIndex > 0) {
            e.preventDefault();
            setCharIndex((prevCharIndex) => prevCharIndex - 1);
            const updatedCorrectWrong = [...correctWrong];
            if (updatedCorrectWrong[charIndex - 1] === "wrong") {
                setMistakes((prevMistakes) => prevMistakes - 1);
            }
            updatedCorrectWrong[charIndex - 1] = "";
            setCorrectWrong(updatedCorrectWrong);
        }
    };

    const handleChange = (e) => {
        const characters = charRefs.current;
        const currentChar = characters[charIndex];
        const typedChar = e.target.value.slice(-1);

        if (charIndex < characters.length && timeLeft > 0) {
            if (!isTyping) {
                setIsTyping(true);
            }

            const updatedCorrectWrong = [...correctWrong];
            if (typedChar === currentChar.textContent) {
                updatedCorrectWrong[charIndex] = "correct";
            } else {
                updatedCorrectWrong[charIndex] = "wrong";
                setMistakes((prevMistakes) => prevMistakes + 1);
            }
            setCorrectWrong(updatedCorrectWrong);
            setCharIndex((prevCharIndex) => prevCharIndex + 1);
            e.target.value = "";
        } else {
            setIsTyping(false);
        }
    };

    return (
        <div className="container">
            <div className="test">
                <input
                    type="text"
                    className="input-field"
                    ref={inputRef}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                />
                {paragraph.split("").map((char, index) => (
                    <span
                        key={index}
                        className={`char ${index === charIndex ? "active" : ""} ${correctWrong[index]}`}
                        ref={(el) => (charRefs.current[index] = el)}
                    >
                        {char}
                    </span>
                ))}
            </div>
            <div className="result">
                <p>
                    Time Left: <strong>{timeLeft}</strong>
                </p>
                <p>
                    Mistakes: <strong>{mistakes}</strong>
                </p>
                <p>
                    WPM: <strong>{WPM}</strong>
                </p>
                <p>
                    CPM: <strong>{CPM}</strong>
                </p>
                <button className="btn" onClick={resetGame}>Try Again</button>
            </div>
        </div>
    );
};

export default TypingTest;
