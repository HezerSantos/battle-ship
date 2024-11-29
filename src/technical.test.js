import {createShip} from './technical'


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