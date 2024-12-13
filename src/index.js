import './style.css'

if (module.hot) {
    module.hot.accept();
};


const mainContainer = document.querySelector("main");

if (document.querySelector(".mainButton")){
    const mainButton = document.querySelector(".mainButton");

    mainButton.addEventListener('click', () => {
        mainContainer.textContent = '';
    })
}


const opponentSelector = document.querySelector(".opponentSelector");
const circle = document.querySelector(".circle");

opponentSelector.addEventListener('input', () => {

    circle.classList.toggle('circleRight');
    circle.classList.toggle('circleLeft');
})

/*
<h1>BATTLE SHIP</h1>
<button class="mainButton">Play Game</button>
*/