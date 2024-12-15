import { createComputerPlayer, createRealPlayer } from "./technical";

export const createDocumentBoard = (player, coordinates, pType) => {
    const gameBoard = createEntryBoard();

    const documentBoard = createGridTile(gameBoard, player, pType);

    placeShipOnDocument(player, coordinates, pType);

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
    const gameBoardContainer = document.createElement("div");
    const playerName = document.createElement("h1")
    playerName.textContent = player.name
    playerName.classList.add(pType);
    gameBoardContainer.classList.add("gameBoardContainer");
    gameBoardContainer.appendChild(playerName)

    const documentBoard = document.createElement("div");
    documentBoard.classList.add("gameBoard");
    const main = document.querySelector("main")
    gameBoard.forEach(row => {
        row.reverse()
        row.forEach(entry => {
            gridTileEventListener(player, entry, documentBoard, pType);
        })
    })
    gameBoardContainer.appendChild(documentBoard)
    main.appendChild(gameBoardContainer);

    return documentBoard;
}

//Creates the event listener for each tile
const gridTileEventListener = (player, entry, documentBoard, pType) => {
    const gridTile = document.createElement("button");
    gridTile.setAttribute("id", `${pType}${entry.join('')}`);
    gridTile.addEventListener('click', () => {
        console.log(entry);
        const flagMap = player.gameBoard.recieveAttack(entry[1], entry[0]);
        const hitFlag = flagMap.get("hitFlag");
        const sunkFlag = flagMap.get("sunkFlag");
        checkHit(hitFlag, gridTile)
        checkSunk(sunkFlag, player, pType);
    })
    documentBoard.appendChild(gridTile);
}


let playerFlag = false;

//Checks if a ship has been hit
const checkHit = (flag, gridTile) => {
    if (flag){
        console.log("hit")
        gridTile.classList.add("hit")
        playerFlag = true;
    } else {
        console.log("miss")
        gridTile.classList.add("miss")
        playerFlag = false;
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

const placeShipOnDocument = (player, coordinates, pType) => {
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
            try{
                const tile = document.querySelector(`#${pType}${entry}`);
                tile.classList.add("shipColor");
            } catch {
                console.log("Index Out Of Range")
            }

        })
        
        
    })
}

const createShipPlacement = () => {
    const gameBoard = createEntryBoard()
    createPlacementGrid(gameBoard)
}

const createPlacementGrid = (gameBoard) => {
    const documentBoard = document.createElement("div");
    documentBoard.classList.add("gameBoard");
    const main = document.querySelector("main")
    createShipContainer();
    gameBoard.forEach(row => {
        row.reverse()
        row.forEach(entry => {
            shipPlacementEventListener(entry, documentBoard);
        })
    })
    main.appendChild(documentBoard);

    
}

let entryStart = [null, null];
let globalShip = null;

const shipPlacementEventListener = (entry, documentBoard) => {
    const gridTile = document.createElement("button");
    gridTile.setAttribute("id", `g${entry.join('')}`);
    gridTile.addEventListener('click', () => {
        let placementFlag = false
        //console.log(globalShip)
        const map = mapShip(entry[1], entry[0], globalShip.length, globalShip.isVertical)
        //console.log(map)
        let placeTiles = []
        map.forEach(entry => {
            try{
                const tile = document.querySelector(`#g${entry}`);
                tile.classList.add("selectedTile")
                placeTiles.push(tile)
                placementFlag = true
            } catch {
                //console.log(placeTiles)
                placeTiles.forEach(tile => {
                    //console.log(tile)
                    tile.classList.remove("selectedTile")
                })
                //tile.classList.remove("selectedTile")
                placementFlag = false
                console.log("Out of Range")
            }
        })
        placeTiles = [];
        if (placementFlag){
            try{
                const shipContainer = document.querySelector(".shipContainer")
                shipContainer.removeChild(globalShip.shipBasis)
            } catch {
                console.log("Error: No more ships")
            }
        }
        //then call the event listener here second
    })
    documentBoard.appendChild(gridTile);
}

const createShipContainer = () => {
    const main = document.querySelector("main")
    const shipContainer = document.createElement("div");
    shipContainer.classList.add("shipContainer")
    const shipList = createShips();
    shipList.forEach(ship => {
        shipBasisEventListener(ship)
        shipContainer.appendChild(ship.shipBasis)
    })
    main.appendChild(shipContainer);
}

const createShips = () => {
    const shipOne = createShipDimension(4, "shipLengthFourVertical", true)
    const shipTwo = createShipDimension(4, "shipLengthFourHorizontal", false)
    const shipThree = createShipDimension(3, "shipLengthThreeVertical", true)
    const shipFour = createShipDimension(3, "shipLengthThreeHorizontal", false)
    const shipFive = createShipDimension(2, "shipLengthTwoVertical", true)
    const shipSix = createShipDimension(2, "shipLengthTwoHorizontal", false)

    const shipList = [shipOne, shipTwo, shipThree, shipFour, shipFive, shipSix];
    return shipList;
}


const createShipDimension = (length, shipStyle, isVertical) => {
    const shipBasis = document.createElement("button")
    shipBasis.classList.add("shipBasis")
    shipBasis.classList.add(shipStyle)
    for (let i=0; i < length; i++){
        const tile = document.createElement("div")
        shipBasis.appendChild(tile)
    }
    return {shipBasis, length, isVertical};
}

const shipBasisEventListener = (ship) => {
    ship.shipBasis.addEventListener('focus', () => {
        globalShip = ship
        ship.shipBasis.classList.add("shipSelected");
    })
    ship.shipBasis.addEventListener('blur', () => {
        ship.shipBasis.classList.remove("shipSelected");
    })

}

const shipOne = [null, null, 4, true] //vertical ship
const shipTwo = [null, null, 4, false] //horizontal ship
const shipThree = [null, null, 2, true] //vertical ship
const shipFour = [null, null, 2, false] // horizontal ship
const shipFive = [null, null, 3, true] //vertical ship
const shipSix = [null, null, 3, false] // horizontal ship

export const startRealPlayerGame = (nameOne, nameTwo) => {
    /*
    const boardOne = createDocumentBoard(createRealPlayer(nameOne), [[2, 5, 3, true], [5, 6, 4, false]], "g1");

    const boardTwo = createDocumentBoard(createRealPlayer(nameTwo), [[1, 1, 3, false], [5, 6, 4, true]], "g2");
    boardTwo.classList.toggle("disableGameBoard");

    const boards = [boardOne, boardTwo]

    
    boards.forEach(board => {
        board.addEventListener('click', () =>{
            if (!playerFlag){
                boards[0].classList.toggle("disableGameBoard")
                boards[1].classList.toggle("disableGameBoard")
                const boardOne = document.querySelector(".g1")
                const boardTwo = document.querySelector(".g2")
                boardOne.classList.toggle("g1")
                boardOne.classList.toggle("g2")
                boardTwo.classList.toggle("g1")
                boardTwo.classList.toggle("g2")
            }
        })
    })
    */
    createShipPlacement();
}

