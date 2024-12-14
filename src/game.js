import { createComputerPlayer, createRealPlayer } from "./technical";

export const createDocumentBoard = (player, coordinates) => {
    const gameBoard = []

    for (let i = 10; i > 0; i--){
        const row = []
        for (let j = 10; j > 0; j--){
            const entry = [i, j];
            row.push(entry)
        }
        gameBoard.push(row);
    }

    createGridTile(gameBoard, player);

    const ships = coordinates;

    ships.forEach(ship => {
        const startX = ship[0]
        const startY = ship[1]
        const length = ship[2]
        const isVertical = ship[3]

        //console.log(startX, startY, length, isVertical)

        player.gameBoard.placeShip(startX, startY, length, isVertical);
        const map = mapShip(startX, startY, length, isVertical);

        map.forEach(entry => {
            const tile = document.querySelector(`#g${entry}`);
            console.log(tile)
            tile.classList.add("shipColor");
        })
    })
 
}

const createGridTile = (gameBoard, player) => {
    const documentBoard = document.createElement("div");
    documentBoard.classList.add("gameBoard");
    const main = document.querySelector("main")
    gameBoard.forEach(row => {
        row.reverse()
        row.forEach(entry => {
            gridTileEventListener(player, entry, documentBoard);
        })
    })
    main.appendChild(documentBoard);
}

const gridTileEventListener = (player, entry, documentBoard) => {
    const gridTile = document.createElement("button");
    gridTile.setAttribute("id", `g${entry.join('')}`);
    gridTile.addEventListener('click', () => {
        const flag = player.gameBoard.recieveAttack(entry[1], entry[0]);
        checkHit(flag, gridTile)
    })
    documentBoard.appendChild(gridTile);
}

const checkHit = (flag, gridTile) => {
    if (flag){
        console.log("hit")
        gridTile.classList.add("hit")
    } else {
        gridTile.classList.add("miss")
    }
}

const mapShip = (sx, sy, length, isVertical) => {
    let startX = sx;
    let startY = sy;
    if (isVertical){
        const map = [`${startY}${startX}`]
        for (let i = 1; i < length; i++){
            startY++;
            map.push(`${startY}${startX}`)
        }
        map.forEach(entry => {
            console.log(entry)
        })
        return map;
    }
}

export const startRealPlayerGame = () => {
    createDocumentBoard(createRealPlayer(), [[1, 1, 3, true], [5, 6, 4, true]]);
}

