const { signup, login } = require('../../src/controllers/authController');
const User = require('../../src/models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../../src/utils/AppError');

// Mock wrapAsync to return the raw promise so Jest can await it
jest.mock('../../src/middleware/wrapAsync', () => (fn) => fn);

jest.mock('../../src/models/UserModel');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        process.env.JWT_SECRET = 'testsecret';
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Signup', () => {
        it('should throw 400 if user already exists', async () => {
            req.body = { name: 'Test', email: 'test@test.com', password: 'password' };
            User.findOne.mockResolvedValue({ email: 'test@test.com' });

            await signup(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(AppError));
            expect(next.mock.calls[0][0].message).toBe("User already exists");
            expect(next.mock.calls[0][0].statusCode).toBe(400);
        });

        it('should hash password, create user, and return token on success', async () => {
            req.body = { name: 'New User', email: 'new@test.com', password: 'password123' };
            
            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedPassword123');
            User.create.mockResolvedValue({ _id: 'user_id_1', name: 'New User', email: 'new@test.com' });
            jwt.sign.mockReturnValue('mocked_jwt_token');

            await signup(req, res, next);

            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                token: 'mocked_jwt_token'
            }));
        });
    });

    describe('Login', () => {
        it('should throw 401 on invalid credentials', async () => {
            req.body = { email: 'wrong@test.com', password: 'wrongpassword' };
            
            User.findOne.mockResolvedValue({ email: 'wrong@test.com', password: 'hashedPassword' });
            bcrypt.compare.mockResolvedValue(false); // Simulate password mismatch

            await login(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(AppError));
            expect(next.mock.calls[0][0].message).toBe("Invalid credentials");
            expect(next.mock.calls[0][0].statusCode).toBe(401);
        });
    });
});