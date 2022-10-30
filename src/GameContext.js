import { DateTime, Duration } from "luxon";
import React, { useEffect, useState } from "react";
import { getTodaysSong } from "./Date";
import { saveGuesses } from "./Guess";

const game = {
  solution: "",
  setSolution: () => {},
  attempts: [],
  setAttempts: () => {},
  matrix: [],
  setMatrix: () => {},
  tried: [],
  setTried: () => {},
  present: [],
  setPresent: () => {},
  correct: [],
  setCorrect: () => {},
  gameStatus: null,
  setGameStatus: () => {},
  processWord: () => {},
  saveGame: () => {},
  darkMode: false,
  setDarkMode: () => {},
  colorBlind: false,
  setColorBlind: () => {},
  accessibilityMode: false,
  setAccessibilityMode: () => {},
};

export const GameContext = React.createContext({ game });

export function getEndTimeForDate(date) {
  // Returns the end of the time for the given date

  let endTime = date.plus(Duration.fromObject({ day: 1 }));
  endTime = DateTime.fromObject(
    {
      year: endTime.year,
      month: endTime.month,
      day: endTime.day,
    },
    { zone: "Europe/Paris" }
  );

  return endTime;
}

export const GameContextProvider = (props) => {
  const [solution, setSolution] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [matrix, setMatrix] = useState([]);
  const [tried, setTried] = useState([]);
  const [present, setPresent] = useState([]);
  const [correct, setCorrect] = useState([]);
  const [gameStatus, setGameStatus] = useState("PLAYING");
  const [darkMode, setDarkMode] = useState(false);
  const [colorBlind, setColorBlind] = useState(false);
  const [accessibilityMode, setAccessibilityMode] = useState(false);

  const processWord_ = (word, solution_) => {
    // Internal logic to parse the word and determine if it is correct or not

    let solution2 = solution || solution_;
    let newMatrixRow = ["x", "x", "x", "x", "x"];
    let newTried = [];
    let newPresent = [];
    let newCorrect = [];

    // Update letters
    for (let i = 0; i < word.length; i++) {
      const char = word.charAt(i);

      if (char == solution2.charAt(i)) {
        newMatrixRow[i] = "c";
        newCorrect.push(char);
      } else if (solution2.includes(char)) {
        newPresent.push(char);
      } else {
        newTried.push(char);
      }
    }

    // Update present state
    // remove correct chars from present chars
    for (let i = 0; i < newCorrect.length; i++) {
      const correctChar = newCorrect[i];
      solution2 = solution2.replace(correctChar, "_");
    }

    for (let i = 0; i < word.length; i++) {
      const char = word.charAt(i);
      if (newMatrixRow[i] == "x" && solution2.includes(char)) {
        newMatrixRow[i] = "p";
        solution2 = solution2.replace(char, "_");
      }
    }

    return { newMatrixRow, newTried, newPresent, newCorrect };
  };

  const processWord = (word) => {
    if (game.gameStatus != "WIN" && game.gameStatus != "LOSE") {
      const { newMatrixRow, newTried, newPresent, newCorrect } =
        processWord_(word);

      const newAttempts = [...attempts, word];

      setAttempts(newAttempts);
      setMatrix([...matrix, newMatrixRow]);
      setTried([...tried, ...newTried]);
      setPresent([...present, ...newPresent]);
      setCorrect([...correct, ...newCorrect]);

      if (word == solution) {
        setGameStatus("WIN");
      } else if (newAttempts.length == 6) {
        setGameStatus("LOSE");
      }
    }
  };

  function saveGame() {
    const lastPlayed = DateTime.local({
      zone: "Europe/Paris",
    });

    localStorage.setItem(
      "gameState",
      JSON.stringify({
        board: attempts,
        lastPlayedTs: lastPlayed.valueOf(),
      })
    );

    const currentDate = DateTime.now().toFormat("yyyy-MM-dd");
    saveGuesses(currentDate,attempts,gameStatus)

    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    localStorage.setItem("colorBlindTheme", JSON.stringify(colorBlind));
    localStorage.setItem(
      "accessibilityMode",
      JSON.stringify(accessibilityMode)
    );
  }

  useEffect(() => {
    // Load settings
    const colorBlind_ = localStorage.getItem("colorBlindTheme");
    if (colorBlind_) {
      setColorBlind(JSON.parse(colorBlind_));
    }
    const accessibilityMode_ = localStorage.getItem("accessibilityMode");
    if (accessibilityMode_) {
      setAccessibilityMode(JSON.parse(accessibilityMode_));
    }
    const darkMode_ = localStorage.getItem("darkMode");
    if (darkMode_) {
      setDarkMode(JSON.parse(darkMode_));
    }

    // Set word of the day
    let today = DateTime.local({ zone: "Europe/Paris" });
    let nextGameStartsAt = getEndTimeForDate(today);

    const solution_ = getTodaysSong(today);
    setSolution(solution_);

    // Load gameState
    const gameState = localStorage.getItem("gameState");

    if (gameState) {
      const state = JSON.parse(gameState);
      setGameStatus("PLAYING");

      let lastPlayed = DateTime.fromMillis(state.lastPlayedTs, {
        zone: "Europe/Paris",
      });
      const savedGameEndDay = getEndTimeForDate(lastPlayed);

      if (!nextGameStartsAt.equals(savedGameEndDay)) {
        // New day: Reset game
        setAttempts([]);
      } else {
        // Same day: Load board
        let matrix_ = [];
        let tried_ = [];
        let present_ = [];
        let correct_ = [];

        for (let i = 0; i < state.board.length; i++) {
          const word = state.board[i];
          const { newMatrixRow, newTried, newPresent, newCorrect } =
            processWord_(word, solution_);

          matrix_ = [...matrix_, newMatrixRow];
          tried_ = [...tried_, ...newTried];
          present_ = [...present_, ...newPresent];
          correct_ = [...correct_, ...newCorrect];

          if (word == solution_) {
            setGameStatus("WIN");
          }
        }

        setAttempts(state.board);
        setMatrix(matrix_);
        setTried(tried_);
        setPresent(present_);
        setCorrect(correct_);

        if (state.board.length == 6) {
          setGameStatus("LOSE");
        }
      }
    } else {
      setGameStatus("NEW");
    }
  }, []);

  useEffect(() => {
    saveGame();
  });

  const values = {
    solution,
    setSolution,
    attempts,
    setAttempts,
    matrix,
    setMatrix,
    tried,
    setTried,
    present,
    setPresent,
    correct,
    setCorrect,
    gameStatus,
    setGameStatus,
    processWord,
    saveGame,
    darkMode,
    setDarkMode,
    colorBlind,
    setColorBlind,
    accessibilityMode,
    setAccessibilityMode,
  };

  return (
    <GameContext.Provider value={values}>{props.children}</GameContext.Provider>
  );
};
