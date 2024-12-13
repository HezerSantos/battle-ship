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
    let shipCount = 1;

    //Places ship at the coordinates and states the status as isVertical
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

    //Recieves an attack and calculates the health
    const recieveAttack = (x, y) => {
        if (gameBoard.size === 0){
            return
        }
        const attack = [x, y]
        gameBoard.forEach((value, key) => {
            if (value[2]){
                if (value[0]['startX'] === x && (value[0]['startY'] <= y && y <= value[0]['endY'])){
                    value[1].hit();
                    hitAttacks.add(attack)
                }
            } else if (!value[2]){
                if ((value[0]['startX'] <= x && x <= value[0]['endX']) && value[0]['startY'] === y){
                    value[1].hit();
                    hitAttacks.add(attack)
                }
            }
        })

        //Adds the missed attacks to track
        if (!hitAttacks.has(attack)){
            missedAttacks.add(attack)
        }
    }



    return {
        gameBoard,
        placeShip, 
        recieveAttack,
        hitAttacks,
        missedAttacks
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

const test = createGameBoard()

test.placeShip(4,8,4, true) //vertical
test.placeShip(5,8,4, false) //horizontal


test.recieveAttack(4, 8) //vertical
test.recieveAttack(5, 8) //horizontal
test.recieveAttack(5, 12) //horizontal


test.recieveAttack(6, 8)
test.recieveAttack(4, 9)

test.recieveAttack(5, 9)










const hitAttacks = test.hitAttacks
const missedAttack = test.missedAttacks
let numberOfHits = test.gameBoard.get('Ship1')
console.log(numberOfHits[1]['numberOfHits'])

numberOfHits = test.gameBoard.get('Ship2')
console.log(numberOfHits[1]['numberOfHits'])

console.log(hitAttacks)
console.log(missedAttack)







