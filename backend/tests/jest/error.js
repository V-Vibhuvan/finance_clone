const AppError = require('../../src/utils/AppError');

describe('AppError Utility', () => {
    it('should correctly set the message and status code', () => {
        const error = new AppError('Insufficient funds', 400);
        
        expect(error.message).toBe('Insufficient funds');
        expect(error.statusCode).toBe(400);
        expect(error.status).toBe('fail');
        expect(error.isOperational).toBe(true);
    });

    it('should set status to error for 500 codes', () => {
        const error = new AppError('Database connection failed', 500);
        
        expect(error.statusCode).toBe(500);
        expect(error.status).toBe('error');
    });
});