export const createShip = (length, isVertical = true) => {
    const shipLength = length;
    let numberOfHits = 0;
    let isShipSunk = false;
    
    const hit = () => {
        numberOfHits ++;
        isSunk();
    }

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
    let missedAttacks = []
    let shipCount = 1;

    const placeShip = (startX, startY, length, status) => {
        const newShip = createShip(length, status);
        const shipHash = `Ship${shipCount}`;
        shipCount ++;
        if (newShip.isVertical){
            const shipCoordinates = {'startX': startX, 'startY': startY, 'endX': startX, 'endY': startY + (length - 1)}
            gameBoard.set(shipHash, [shipCoordinates, newShip, newShip.isVertical])
        } else {
            const shipCoordinates = {'startX': startX, 'startY': startY, 'endX': startX + (length - 1), 'endY': startY}
            gameBoard.set(shipHash, [shipCoordinates, newShip, newShip.isVertical])
        }
    }

    const recieveAttack = (x, y) => {
        if (gameBoard.size === 0){
            return
        }
        gameBoard.forEach((value, key) => {
            if (value[2]){
                if (value[0]['startX'] === x && (value[0]['startY'] <= y && y <= value[0]['endY'])){
                    value[1].hit();
                } else {
                    const attack = [x, y]
                    missedAttacks.push(attack)
                }
            } else {
                if ((value[0]['startX'] <= x && x <= value[0]['endX']) && value[0]['startY'] === y){
                    value[1].hit();
                } else {
                    const attack = [x, y]
                    missedAttacks.push(attack)
                }
            }
        })
    }



    return {
        gameBoard,
        placeShip, 
        recieveAttack
    }
}


