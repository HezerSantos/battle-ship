export const createShip = (length, isVertical = true) => {
    //Ship attributes
    const shipLength = length;
    let numberOfHits = 0;
    let isShipSunk = false;
    
    //Ship hit method to track number of hits on said ship
    const hit = () => {
        numberOfHits ++;
        isSunk();
    }

    //Checks to see if its sunk
    const isSunk = () => {
        if (numberOfHits === shipLength){
            isShipSunk = true;
        }
    }

    return {
        shipLength: shipLength,
        get numberOfHits() {
            return numberOfHits;
        },
        get isShipSunk() {
            return isShipSunk;
        },
        hit,
        isVertical
    }
}
export const createGameBoard = () => {
    let gameBoard = new Map();
    let hitAttacks = new Set();
    let missedAttacks = new Set();
    let shipCount = 0;
    let sunkCount = 0;

    //Places ship at the coordinates and states the status as isVertical
    const placeShip = (startX, startY, length, status) => {
        const newShip = createShip(length, status);
        const shipHash = `Ship${shipCount + 1}`;
        shipCount ++;
        //vertical ships grow from bottom.
        if (newShip.isVertical){
            const shipCoordinates = {'startX': startX, 'startY': startY, 'endX': startX, 'endY': startY + (length - 1)}
            gameBoard.set(shipHash, [shipCoordinates, newShip, newShip.isVertical, length])
        } else {
            const shipCoordinates = {'startX': startX, 'startY': startY, 'endX': startX + (length - 1), 'endY': startY}
            gameBoard.set(shipHash, [shipCoordinates, newShip, newShip.isVertical, length])
        }
        return newShip
    }

    //Recieves an attack and calculates the health
    const recieveAttack = (x, y) => {
        if (gameBoard.size === 0){
            return
        }
        const attack = [x, y]
        const flagMap = new Map()
        flagMap.set("hitFlag", false)
        flagMap.set("sunkFlag", [false, null, null, null]);

        gameBoard.forEach((value, key) => {
            if (!hitAttacks.has(attack)){
                if (value[2]){
                    if (value[0]['startX'] === x && (value[0]['startY'] <= y && y <= value[0]['endY'])){
                        value[1].hit();
                        hitAttacks.add(attack)
                        flagMap.set("hitFlag", true);
                        if (value[1].isShipSunk){
                            const sunkEntries = [
                                true,
                                [value[0]['startX'], value[0]['startY']],
                                value[3],
                                value[2]
                            ]
                            flagMap.set("sunkFlag", sunkEntries);
                            sunkCount++;
                        }
                    }
                } else if (!value[2]){
                    if ((value[0]['startX'] <= x && x <= value[0]['endX']) && value[0]['startY'] === y){
                        value[1].hit();
                        hitAttacks.add(attack)
                        flagMap.set("hitFlag", true);
                        if (value[1].isShipSunk){
                            const sunkEntries = [
                                true,
                                [value[0]['startX'], value[0]['startY']],
                                value[3],
                                value[2]
                            ]
                            flagMap.set("sunkFlag", sunkEntries);
                            sunkCount++;
                        }
                    }
                }
            }
        })

        //Adds the missed attacks to track
        if (!hitAttacks.has(attack)){
            missedAttacks.add(attack)
        }

        return flagMap;
    }

    return {
        gameBoard,
        placeShip, 
        recieveAttack,
        hitAttacks,
        missedAttacks,
        get shipCount(){
            return shipCount;
        },
        get sunkCount(){
            return sunkCount;
        }
    }
}



export const createRealPlayer = (name) => {
    const gameBoard = createGameBoard()

    return {
        name,
        gameBoard
    }
}

export const createComputerPlayer = () => {
    const name = 'Computer';
    const gameBoard = createGameBoard()

    return {
        name,
        gameBoard
    }
}

//the for loop runs in order so who which ever ship is placed first should be the one that recieves?







