import { startRealPlayerGame } from "./game";

export const changeButtonView = () => {
    const circle = document.querySelector(".circle");
    circle.classList.toggle('circleRight');
    circle.classList.toggle('circleLeft');
}

export const highliightSelector = () => {
    const singlePlayerLabel = document.querySelector("#singlePlayerLabel");
    const computerPlayerLabel = document.querySelector("#computerPlayerLabel");
    computerPlayerLabel.classList.toggle("selected");
    computerPlayerLabel.classList.toggle("notSelected");
    singlePlayerLabel.classList.toggle("selected");
    singlePlayerLabel.classList.toggle("notSelected");
}

export const createGameBoard = (playerOne, playerTwo) => {
    const playButton = document.querySelector(".playButton");
    const main = document.querySelector("main");
    const opponentSelector = document.querySelector(".opponentSelector");

    playButton.addEventListener('click', () => {
        main.textContent = '';
        main.classList.add("gameClass");
        if (opponentSelector.checked){
            console.log('Playing Against Computer')
        }
        if (!opponentSelector.checked){
            console.log('Playing Against Human');
            startRealPlayerGame(playerOne, playerTwo);
        }
    })
}

export const activateSelector = () => {
    const opponentSelector = document.querySelector(".opponentSelector");

    opponentSelector.addEventListener('input', () => {
        changeButtonView();
        highliightSelector();
    })
}