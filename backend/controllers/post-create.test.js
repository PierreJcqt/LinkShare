const { createPost } = require('./posts');
const db = require('../models');

// Mock des modèles Sequelize
jest.mock('../models', () => ({
    sequelize: {
        models: {
        Post: {
            create: jest.fn(),
            findOne: jest.fn()
        },
        User: {}
        }
    }
}));
    describe('createPost Controller', () => {
    let mockReq, mockRes, mockNext;
    beforeEach(() => {
        // Initialisation des objets mockés
        mockReq = {
        body: { title: 'Test Post', content: 'This is a test post' },
        user: { id: 1 },
        file: null,
        protocol: 'http',
        get: jest.fn().mockReturnValue('localhost:3000')
        };
        mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
        };
        mockNext = jest.fn();
    });
    test('should create a post successfully', async () => {
        db.sequelize.models.Post.create.mockResolvedValue({ id: 1, ...mockReq.body });
        db.sequelize.models.Post.findOne.mockResolvedValue({ id: 1, ...mockReq.body, User: {} });
        await createPost(mockReq, mockRes, mockNext);
        expect(db.sequelize.models.Post.create).toHaveBeenCalledWith({
        ...mockReq.body,
        userId: mockReq.user.id
        });
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalled();
    });
    test('should handle errors', async () => {
        db.sequelize.models.Post.create.mockRejectedValue(new Error('Failed to create post'));
        await createPost(mockReq, mockRes, mockNext);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ error: expect.any(Error) });
    });
});


