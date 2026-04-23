const { createOrder, getOrders } = require('../../src/controllers/orderController');
const Orders = require('../../src/models/OrdersModel');
const Holdings = require('../../src/models/HoldingsModel');
const Wallet = require('../../src/models/WalletModel');
const Transaction = require('../../src/models/TransactionModel');
const Positions = require('../../src/models/PositionsModel');
const AppError = require('../../src/utils/AppError');
const mongoose = require('mongoose');

// Mock wrapAsync to return the raw promise so Jest can await it
jest.mock('../../src/middleware/wrapAsync', () => (fn) => fn);

// Define the session methods directly inside the factory to prevent hoisting errors
jest.mock('mongoose', () => {
    const actualMongoose = jest.requireActual(`mongoose`);
    return {
        ...actualMongoose,
        startSession: jest.fn().mockResolvedValue({
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        })
    };
});

jest.mock('../../src/models/OrdersModel');
jest.mock('../../src/models/HoldingsModel');
jest.mock('../../src/models/WalletModel');
jest.mock('../../src/models/TransactionModel');
jest.mock('../../src/models/PositionsModel');

describe('Order Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = { user: { id: 'user123' }, body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createOrder - Validations', () => {
        it('should throw 400 if required fields are missing', async () => {
            req.body = { name: 'RELIANCE', qty: 10 }; 
            await createOrder(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(AppError));
            expect(next.mock.calls[0][0].message).toBe("All field required");
        });

        it('should throw 400 if qty is negative', async () => {
            req.body = { name: 'RELIANCE', qty: -5, price: 2500, mode: 'BUY' };
            await createOrder(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(AppError));
        });
    });

    describe('createOrder - Execution', () => {
        it('should successfully execute a BUY order and update wallet/holdings', async () => {
            req.body = { name: 'TCS', qty: 2, price: 3000, mode: 'BUY' };

            const mockWallet = {
                user: 'user123',
                balance: 10000,
                save: jest.fn().mockResolvedValue(true)
            };

            Wallet.findOne.mockReturnValue({ session: jest.fn().mockResolvedValue(mockWallet) });
            Holdings.findOne.mockReturnValue({ session: jest.fn().mockResolvedValue(null) });
            
            Holdings.create.mockResolvedValue([{ _id: 'h1', qty: 2, avg: 3000 , save: jest.fn().mockResolvedValue(true)}]);
            Orders.create.mockResolvedValue([{ _id: 'o1', name: 'TCS' }]);
            Transaction.create.mockResolvedValue(true);
            Positions.findOneAndUpdate.mockReturnValue({ session: jest.fn() });

            await createOrder(req, res, next);

            expect(mockWallet.balance).toBe(4000); 
            expect(mockWallet.save).toHaveBeenCalled();
            
            // Verify the transaction was committed
            const session = await mongoose.startSession();
            expect(session.commitTransaction).toHaveBeenCalled();
            
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                message: "Order executed safely"
            }));
        });
    });

    describe('getOrders', () => {
        it('should fetch all orders for the user', async () => {
            const mockOrders = [{ name: 'TCS', mode: 'BUY' }, { name: 'INFY', mode: 'SELL' }];
            
            Orders.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                populate: jest.fn().mockResolvedValue(mockOrders)
            });

            await getOrders(req, res, next);

            expect(res.json).toHaveBeenCalledWith({
                success: true,
                count: 2,
                orders: mockOrders
            });
        });
    });
});