import React from "react";

export function loadAllGuesses(){
  const storedGuesses = localStorage.getItem("guesses");
  return storedGuesses != null ? JSON.parse(storedGuesses) : {};
}

export function saveGuesses(dayString, attempts,gameStatus) {
  const allGuesses = loadAllGuesses();
  localStorage.setItem(
    "guesses",
    JSON.stringify({
    ...allGuesses,
      [dayString]: attempts+","+gameStatus,
    })
  );
}