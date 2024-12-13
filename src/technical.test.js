import {createShip, createGameBoard} from './technical'


describe('Ship factory Function', () => {
    it('Should return a proper length, number of hits, and sunk status', () => {
        const newShip = createShip(5);
        expect(newShip.shipLength).toBe(5)
        expect(newShip.numberOfHits).toBe(0)
        expect(newShip.isShipSunk).toBe(false)
    })

    it('Should properly update number of hits when hit', () => {
        const newShip = createShip(5);
        newShip.hit()
        expect(newShip.numberOfHits).toBe(1)
        expect(newShip.isShipSunk).toBe(false)
    })

    it('Should properly sink when hits equals its length', () => {
        const newShip = createShip(5);
        newShip.hit()
        newShip.hit()
        newShip.hit()
        newShip.hit()
        newShip.hit()
        expect(newShip.numberOfHits).toBe(5)
        expect(newShip.isShipSunk).toBe(true)
    })
})

describe('Gameboard Factory Function', () => {
    it('Should create ships with the corresponding coordinates and ship hash', () => {
        const test = createGameBoard()

        test.placeShip(5,8,4)
        test.placeShip(5,8,4)
        test.placeShip(5,8,4)

        const values = Array.from(test.gameBoard.values());

        expect(values.length).toBe(3);
        
        expect(values[0][0]['startX']).toEqual(5);
        expect(values[0][0]['startY']).toEqual(8);
        expect(values[0][0]['endX']).toEqual(5);
        expect(values[0][0]['endY']).toEqual(11);

        expect(values[0][1].shipLength).toBe(4);

    });

    it('Updates the ships hit count and logs a missed hit', () => {
        const test = createGameBoard()

        test.placeShip(5,8,4, false)
        test.recieveAttack(5, 8)
        test.recieveAttack(6, 8)
        test.recieveAttack(7, 8)
        test.recieveAttack(8, 8)
        let numberOfHits = test.gameBoard.get('Ship1')
        expect(numberOfHits[1]['numberOfHits']).toBe(4)
        expect(numberOfHits[1]['isShipSunk']).toBe(true)

        test.placeShip(5,8,4, true)
        test.recieveAttack(5, 8)
        test.recieveAttack(5, 9)
        test.recieveAttack(5, 10)
        test.recieveAttack(5, 11)
        test.recieveAttack(5, 12)
        test.recieveAttack(5, 13)
        numberOfHits = test.gameBoard.get('Ship2')
        expect(numberOfHits[1]['numberOfHits']).toBe(4)
        expect(numberOfHits[1]['isShipSunk']).toBe(true)

        const missedAttack = test.missedAttacks


        expect(missedAttack).toEqual(new Set([[5, 12], [5, 13]]));

    })
})