import { createComputerPlayer, createRealPlayer } from "./technical";

export const createDocumentBoard = (player, coordinates, pType) => {
    const gameBoard = createEntryBoard();

    const documentBoard = createGridTile(gameBoard, player, pType);

    placeShipOnDocument(player, coordinates);

    return documentBoard;
}

//Creates the 2D array of tiles. 10x10 grid of [y, x]
const createEntryBoard = () => {
    const gameBoard = []

    for (let i = 10; i > 0; i--){
        const row = []
        for (let j = 10; j > 0; j--){
            const entry = [i, j];
            row.push(entry)
        }
        gameBoard.push(row);
    }

    return gameBoard;
}

//Creates the grid tile by creating JS container and reversing each entry
const createGridTile = (gameBoard, player, pType) => {
    const documentBoard = document.createElement("div");
    documentBoard.classList.add("gameBoard");
    const main = document.querySelector("main")
    gameBoard.forEach(row => {
        row.reverse()
        row.forEach(entry => {
            gridTileEventListener(player, entry, documentBoard, pType);
        })
    })
    main.appendChild(documentBoard);

    return documentBoard;
}

//Creates the event listener for each tile
const gridTileEventListener = (player, entry, documentBoard, pType) => {
    const gridTile = document.createElement("button");
    gridTile.setAttribute("id", `${pType}${entry.join('')}`);
    gridTile.addEventListener('click', () => {
        const flagMap = player.gameBoard.recieveAttack(entry[1], entry[0]);
        const hitFlag = flagMap.get("hitFlag");
        const sunkFlag = flagMap.get("sunkFlag");
        checkHit(hitFlag, gridTile)
        checkSunk(sunkFlag, player, pType);
    })
    documentBoard.appendChild(gridTile);
}


//Checks if a ship has been hit
const checkHit = (flag, gridTile) => {
    if (flag){
        console.log("hit")
        gridTile.classList.add("hit")
    } else {
        console.log("miss")
        gridTile.classList.add("miss")
    }
}

const checkSunk = (flag, player, pType) => {
    if (flag[0]){
        console.log("sunk")
        const sunkMap = mapShip(flag[1][0], flag[1][1], flag[2], flag[3])
        sunkMap.forEach(entry => {
            const tile = document.querySelector(`#${pType}${entry}`);
            tile.classList.add("sunkColor");
        })

        console.log
        if (player.gameBoard.sunkCount === player.gameBoard.shipCount){
            const gameBoard = document.querySelector(".gameBoard")
            gameBoard.classList.add("disableGameBoard");
            console.log("You Lose")
            createLoseBlock(player.name)
        }
    }
}

const createLoseBlock = (playerName) => {
    const main = document.querySelector("main")
    const loseContainer = document.createElement("div");
    loseContainer.textContent = `${playerName} Loses`
    loseContainer.classList.add("loseContainer")
    main.appendChild(loseContainer)
}


//Creates a list to track the length of the ship (All of its coordinates)
const mapShip = (sx, sy, length, isVertical) => {
    let startX = sx;
    let startY = sy;
    if (isVertical){
        const map = [`${startY}${startX}`]
        for (let i = 1; i < length; i++){
            startY++;
            map.push(`${startY}${startX}`)
        }
        return map;
    } else {
        const map = [`${startY}${startX}`]
        for (let i = 1; i < length; i++){
            startX++;
            map.push(`${startY}${startX}`)
        }
        return map;
    }
}

const placeShipOnDocument = (player, coordinates) => {
    const ships = coordinates;

    ships.forEach(ship => {
        const startX = ship[0]
        const startY = ship[1]
        const length = ship[2]
        const isVertical = ship[3]

        //console.log(startX, startY, length, isVertical)

        player.gameBoard.placeShip(startX, startY, length, isVertical);

        /*
        const map = mapShip(startX, startY, length, isVertical);

        map.forEach(entry => {
            const tile = document.querySelector(`#g${entry}`);
            tile.classList.add("shipColor");
        })
        */
    })
}

export const startRealPlayerGame = (nameOne, nameTwo) => {
    const boardOne = createDocumentBoard(createRealPlayer(nameOne), [[1, 1, 3, true], [5, 6, 4, false]], "g1");

    const boardTwo = createDocumentBoard(createRealPlayer(nameTwo), [[1, 1, 3, false], [5, 6, 4, true]], "g2");
    boardTwo.classList.toggle("disableGameBoard");

    const boards = [boardOne, boardTwo]

    boards.forEach(board => {
        board.addEventListener('click', () =>{
            boards[0].classList.toggle("disableGameBoard")
            boards[1].classList.toggle("disableGameBoard")
        })
    })
}

