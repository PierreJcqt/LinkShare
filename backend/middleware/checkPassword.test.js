// BON TEST QUI MARCHE NE PAS CHANGER

const bcrypt = require('bcrypt');
const { checkPassword } = require('./password');

// Mock bcrypt.compare
jest.mock('bcrypt', () => ({
    compare: jest.fn(),
}));

describe('checkPassword', () => {
    it('should return true if password is correct', async () => {
        bcrypt.compare.mockResolvedValue(true); // Simulate bcrypt.compare resolving to true
        const result = await checkPassword('testPassword', 'hashedPassword');
        expect(result).toBe(true);
    });

    it('should return false if password is incorrect', async () => {
        bcrypt.compare.mockResolvedValue(false); // Simulate bcrypt.compare resolving to false
        const result = await checkPassword('wrongPassword', 'hashedPassword');
        expect(result).toBe(false);
    });
});
