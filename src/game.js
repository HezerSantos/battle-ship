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

        /*
        map.forEach(entry => {
            try{
                const tile = document.querySelector(`#${pType}${entry}`);
                tile.classList.add("shipColor");
            } catch {
                console.log("Index Out Of Range")
            }

        })*/
        
        
    })
}

let globalShip = null;
let placeShips = new Set()

const createShipPlacement = (playerName) => {
    return new Promise((resolve) => {
        let totalShipCount = [0]
        const gameBoard = createEntryBoard()
        const placedShipList = [];
        createPlacementGrid(gameBoard, placedShipList, totalShipCount, playerName)
        const interval = setInterval(() => {
            if (totalShipCount[0] == 6) {
                clearInterval(interval);
                resolve(placedShipList);
                globalShip = null;
                placeShips = new Set()
                const main = document.querySelector("main");
                main.textContent = "";
            }
        }, 50);
    
    })
}

const createPlacementGrid = (gameBoard, placedShipList, totalShipCount, playerName) => {
    const documentBoard = createPlacementDocumentBoard();
    const boardContainer = createBoardContainer();
    const errorContainer = createErrorContainer();
    const nameContainer = createNameContainer(playerName);
    createShipContainer();
    gameBoard.forEach(row => {
        row.reverse()
        row.forEach(entry => {
            shipPlacementEventListener(entry, documentBoard, errorContainer, placedShipList, totalShipCount);
        })
    })
    boardContainer.append(nameContainer, documentBoard, errorContainer)
    const main = document.querySelector("main")
    main.appendChild(boardContainer); 
}

const createPlacementDocumentBoard = () => {
    const documentBoard = document.createElement("div");
    documentBoard.classList.add("gameBoard");
    return documentBoard;
}

const createBoardContainer = () => {
    const boardContainer = document.createElement("div");
    boardContainer.classList.add("boardContainer");
    return boardContainer;
}

const createErrorContainer = () => {
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("errorContainer");
    return errorContainer;
}

const createNameContainer = (playerName) => {
    const nameContainer = document.createElement("div");
    nameContainer.classList.add("nameContainer")
    nameContainer.textContent = `Place Your Ships ${playerName}`;
    return nameContainer
}


const createPlacementGridTile = (entry) => {
    const gridTile = document.createElement("button");
    gridTile.setAttribute("id", `g${entry.join('')}`);
    return gridTile;
}

const checkDuplicates = (map, containFlag) => {
    map.forEach(entry => {
        if (placeShips.has(entry)){
            containFlag = false;
        }
    })
    return containFlag;
}

const createSelectedTile = (entry) => {
    const tile = document.querySelector(`#g${entry}`);
    tile.classList.add("selectedTile");
    return tile
}
const shipPlacementEventListener = (entry, documentBoard, errorContainer, placedShipList, totalShipCount) => {
    const gridTile = createPlacementGridTile(entry);
    gridTile.addEventListener('click', () => {
        let placementFlag = false
        try{
            errorContainer.textContent = ""
            const map = mapShip(entry[1], entry[0], globalShip.length, globalShip.isVertical)
            let containFlag = true; //flag to see if an entry exists in the set
            let placeTiles = [] //temp list to remove the styles of the tile that is placed when out of range
            let tempSet = new Set() //set to update the place ships set

            containFlag = checkDuplicates(map, containFlag);
            
            if (containFlag){
                map.forEach(entry => {
                    try{
                        errorContainer.textContent = '';
                        const tile = createSelectedTile(entry);
                        placeTiles.push(tile)
                        placementFlag = true
                        tempSet.add(entry)
                    } catch {
                        placeTiles.forEach(tile => {
                            tile.classList.remove("selectedTile")
                        })
                        placementFlag = false
                        console.log("Out of Range")
                        tempSet = new Set();
                    }
                })
            }

            if (!placementFlag){
                errorContainer.textContent = "Error: Ships cannot Overlap/Escape the field";
            }
            placeTiles = []; //reset placement tiles
            if (placementFlag){
                try{
                    const shipContainer = document.querySelector(".shipContainer")
                    shipContainer.removeChild(globalShip.shipBasis)
                    tempSet.forEach(entry => {
                        placeShips.add(entry)
                    })
                    //Code to add to ship list
                    placedShipList.push([entry[1], entry[0], globalShip.length, globalShip.isVertical]);
                    totalShipCount[0]++;
                    //console.log(totalShipCount[0])
                    //console.log(placedShipList);
                } catch {
                    console.log("Error: No more ships")
                }
            }
        } catch {
            errorContainer.textContent = "Please Select A Ship First"
        }
        globalShip = null
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


/*
const shipOne = [null, null, 4, true] //vertical ship
const shipTwo = [null, null, 4, false] //horizontal ship
const shipThree = [null, null, 2, true] //vertical ship
const shipFour = [null, null, 2, false] // horizontal ship
const shipFive = [null, null, 3, true] //vertical ship
const shipSix = [null, null, 3, false] // horizontal ship
*/


export const startRealPlayerGame = async (nameOne, nameTwo) => {

    const boradOneShips = await createShipPlacement(nameOne);
    console.log(boradOneShips)
    const boardTwoShips = await createShipPlacement(nameTwo);
    console.log(boardTwoShips)

    const boardOne = createDocumentBoard(createRealPlayer(nameOne), boradOneShips, "g1");
    const boardTwo = createDocumentBoard(createRealPlayer(nameTwo), boardTwoShips, "g2");
   

    //console.log(boardOne, boardTwo)
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

}

