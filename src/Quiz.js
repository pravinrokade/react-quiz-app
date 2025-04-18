import React, { useEffect } from "react";
import { useState } from "react";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(10);
  const [questionSkipped, setQuestionSkipped] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=10&type=multiple"
      );
      const data = await response.json();
      setQuestions(data.results);
    } catch (error) {
      console.error("Error while fetching Questions: " + error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizEnded(true);
    }
  };

  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    handleNextQuestion();
  };

  useEffect(() => {
    let timerId;
    setTimer(10);
    timerId = setInterval(() => {
      setTimer((pre) => {
        if (pre <= 0) {
          clearInterval(timerId);
          handleNextQuestion();
          return 0;
        }
        return pre - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [currentIndex, questions, quizEnded]);

  const currentQuestion = questions[currentIndex];

  if (!questions || questions.length === 0) {
    return <div>Loading...</div>;
  }

  if (quizEnded == true) {
    return (
      <div>
        <h1>Quiz Ended</h1>
        Your Score : {score}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Quiz App</h1>
      <h2>Question {currentIndex + 1}</h2>
      <p>{currentQuestion.question}</p>
      <ul>
        {currentQuestion.incorrect_answers.map((Option, ind) => (
          <li key={ind}>
            <button onClick={() => handleAnswerClick(false)}>{Option}</button>
          </li>
        ))}
        <li>
          <button onClick={() => handleAnswerClick(true)}>
            {currentQuestion.correct_answer}
          </button>
        </li>
      </ul>
      <p>Time left : {timer} Seconds</p>
      <button onClick={handleNextQuestion}>Skip Question</button>
    </div>
  );
}

export default Quiz;
