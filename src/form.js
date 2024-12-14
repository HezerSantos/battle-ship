import { createDocumentBoard, startRealPlayerGame } from "./game";

export const changeButtonView = () => {
    const circle = document.querySelector(".circle");
    circle.classList.toggle('circleRight');
    circle.classList.toggle('circleLeft');
}

export const highliightSelector = () => {
    const singlePlayerLabel = document.querySelector("#singlePlayerLabel");
    const computerPlayerLabel = document.querySelector("#computerPlayerLabel");
    computerPlayerLabel.classList.toggle("bold");
    singlePlayerLabel.classList.toggle("bold");
}




export const createSelector = () => {
    const main = document.querySelector("main");
    const selectorContainer = document.createElement("div");
    selectorContainer.classList.add("selectorContainer");

    const singlePlayerLabel = document.createElement("h1");
    singlePlayerLabel.classList.add("bold")

    singlePlayerLabel.setAttribute("id", "singlePlayerLabel");
    singlePlayerLabel.textContent = 'Single Player'

    const computerPlayerLabel = document.createElement("h1");
    computerPlayerLabel.setAttribute("id", "computerPlayerLabel");
    computerPlayerLabel.textContent = 'Computer Player';

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("buttonContainer")
    
    const selectorLabel = document.createElement("label");
    selectorLabel.classList.add("circle", "circleRight")
    selectorLabel.setAttribute("for", "selector");

    const opponentSelector = document.createElement("input");
    opponentSelector.classList.add("opponentSelector")
    opponentSelector.setAttribute("id", "selector");

    opponentSelector.setAttribute("type", "checkbox");

    buttonContainer.append(selectorLabel, opponentSelector);

    
    const playButton = document.createElement("button");
    playButton.classList.add("playButton");
    playButton.textContent = 'Play'

    selectorContainer.append(singlePlayerLabel, buttonContainer, computerPlayerLabel, playButton);

    main.appendChild(selectorContainer);
}

export const createGameBoard = () => {
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
            startRealPlayerGame();
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



/*
        <div class="selectorContainer">
            <h1 id="singlePlayerLabel" class="bold">Single Player</h1>
            <div class="buttonContainer">
                <label for="selector" class="circle circleRight"></label>  
                <input type="checkbox" class="opponentSelector" id="selector">
            </div>
            <h1 id="computerPlayerLabel">Computer Player</h1>
        </div>
*/