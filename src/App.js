import React, { useState, useEffect } from "react";
import "./App.css";

const questions = [
  {
    id: 1,
    question: "Kalau kucing bisa ngomong, apa hal pertama yang dia protes?",
    options: ["“Kenapa aku gak punya KTP?", "Isi kotak pasir kurang instagramable.", "Makananku telat lagi!", "Stop foto aku pas tidur!"],
    correct: "Makananku telat lagi!"
  },
  {
    id: 2,
    question: "Kenapa sandal jepit sering hilang satu?",
    options: ["Dia ikut lomba lari sendal.", "Dia butuh me time.", "Dia pindah kos.", "Dia ketarik jurang waktu azan magrib."],
    correct: "Pink"
  },
  {
    id: 3,
    question: "Hewan apa yang paling cocok jadi gamer?",
    options: ["Semut (kerja tim kuat)", "Rusa (selalu waspada)", "Lumba-lumba (IQ tinggi)", "Kodok (karena… hop-in game?)"],
    correct: "Payung"
  },
];

export default function App() {
  const [gameState, setGameState] = useState("start"); 
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null); 
  const [timeLeft, setTimeLeft] = useState(60);
  const [resultsLog, setResultsLog] = useState([]); 

  useEffect(() => {
    let timer;
    if (gameState === "quiz" && timeLeft > 0 && !selectedOption) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !selectedOption) {
      handleTimeout();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameState, selectedOption]);

  const handleStart = () => {
    setGameState("quiz");
    setCurrentQIndex(0);
    setScore(0);
    setResultsLog([]);
    resetQuestionState();
  };

  const resetQuestionState = () => {
    setTimeLeft(60);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const handleTimeout = () => {
    // Requirements: Score decremented by 1 if timeout
    setScore((prev) => prev - 1);
    saveResult(false, "Time Out", questions[currentQIndex].correct);
    goToNextQuestion();
  };

  const handleAnswerClick = (option) => {
    if (selectedOption) return; // Prevent multiple clicks

    setSelectedOption(option);
    const correctAns = questions[currentQIndex].correct;
    const isAnswerCorrect = option === correctAns;

    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      setScore((prev) => prev + 1);
    }

    saveResult(isAnswerCorrect, option, correctAns);
  };

  const saveResult = (status, usersAnswer, correctAnswer) => {
    setResultsLog((prev) => [
      ...prev,
      {
        question: questions[currentQIndex].question,
        isCorrect: status,
        usersAnswer,
        correctAnswer,
      },
    ]);
  };

  const goToNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      resetQuestionState();
    } else {
      setGameState("end");
    }
  };

  return (
    <div className="app-container">
      <div className="card">
        {/* --- START SCREEN --- */}
        {gameState === "start" && (
          <div className="start-screen">
            <h1>🌸 Cute Quiz Time 🌸</h1>
            <p>Jawab pertanyaan seru ini!</p>
            <div className="instruction-box">
              <p>✨ 60 detik per soal</p>
              <p>✨ Skor bertambah jika benar</p>
            </div>
            <button className="btn-primary" onClick={handleStart}>
              Mulai Kuis!
            </button>
          </div>
        )}

        {/* --- QUIZ SCREEN --- */}
        {gameState === "quiz" && (
          <div className="quiz-screen">
            <div className="header-info">
              <span className="badge">Soal {currentQIndex + 1}/{questions.length}</span>
              <span className={`timer ${timeLeft < 10 ? "danger" : ""}`}>
                ⏰ {timeLeft}s
              </span>
            </div>
            
            <h2 className="question-text">{questions[currentQIndex].question}</h2>

            <div className="options-grid">
              {questions[currentQIndex].options.map((option, index) => {
                // Logic untuk pewarnaan tombol
                let btnClass = "btn-option";
                if (selectedOption) {
                    if (option === questions[currentQIndex].correct) {
                        btnClass += " correct"; // Selalu hijaukan jawaban benar
                    } else if (option === selectedOption) {
                        btnClass += " wrong"; // Merahkan jawaban salah user
                    } else {
                        btnClass += " disabled"; // Redupkan sisanya
                    }
                }

                return (
                  <button
                    key={index}
                    className={btnClass}
                    onClick={() => handleAnswerClick(option)}
                    disabled={!!selectedOption}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Tombol Next muncul setelah menjawab */}
            {selectedOption && (
                <div className="feedback-area">
                    <p className="feedback-msg">
                        {isCorrect ? "Yay! Benar! 🎉" : "Ups! Salah 🥺"}
                    </p>
                    <button className="btn-next" onClick={goToNextQuestion}>
                        Lanjut ➜
                    </button>
                </div>
            )}
          </div>
        )}

        {/* --- RESULT SCREEN --- */}
        {gameState === "end" && (
          <div className="result-screen">
            <h2>✨ Kuis Selesai! ✨</h2>
            <div className="score-box">
                <span className="score-label">Skor Akhir</span>
                <span className="score-value">{score}</span>
            </div>
            
            <div className="results-list">
                <h3>Riwayat Jawaban:</h3>
                {resultsLog.map((log, idx) => (
                    <div key={idx} className={`result-item ${log.isCorrect ? 'item-correct' : 'item-wrong'}`}>
                        <div className="q-title">{idx + 1}. {log.question}</div>
                        <div className="ans-detail">
                            Kamu: <strong>{log.usersAnswer}</strong> 
                            {!log.isCorrect && <span> (Benar: {log.correctAnswer})</span>}
                        </div>
                    </div>
                ))}
            </div>

            <button className="btn-primary" onClick={handleStart}>
              Main Lagi ↺
            </button>
          </div>
        )}
      </div>
    </div>
  );
}