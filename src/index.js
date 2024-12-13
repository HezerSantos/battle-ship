import './style.css'
import { createSelector, activateSelector, createGameBoard } from './form';

if (module.hot) {
    module.hot.accept();
};


const mainContainer = document.querySelector("main");

if (document.querySelector(".mainButton")){
    const mainButton = document.querySelector(".mainButton");

    mainButton.addEventListener('click', () => {
        mainContainer.textContent = '';
        createSelector();
        activateSelector();
        createGameBoard(document.querySelector(".opponentSelector").checked);
    })
}
