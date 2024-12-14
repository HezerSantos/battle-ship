import './style.css'
import { activateSelector, createGameBoard } from './form';

if (module.hot) {
    module.hot.accept();
};


activateSelector();
createGameBoard("Player One", "Player Two");
