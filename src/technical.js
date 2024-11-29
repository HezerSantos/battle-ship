export const createShip = (length) => {
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
        hit
    }
}