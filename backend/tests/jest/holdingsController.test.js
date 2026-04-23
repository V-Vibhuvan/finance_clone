const { getHoldings } = require('../../src/controllers/holdingsController');
const Holdings = require('../../src/models/HoldingsModel');

jest.mock('../../src/models/HoldingsModel');

describe('Holdings Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = { user: { id: 'user123' } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully fetch user holdings', async () => {
        const mockHoldings = [
            { name: 'HDFC', qty: 10, avg: 1500 },
            { name: 'WIPRO', qty: 50, avg: 400 }
        ];

        Holdings.find.mockReturnValue({
            sort: jest.fn().mockResolvedValue(mockHoldings)
        });

        await getHoldings(req, res, next);

        expect(Holdings.find).toHaveBeenCalledWith({ user: 'user123' });
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            count: 2,
            holdings: mockHoldings
        });
    });
});