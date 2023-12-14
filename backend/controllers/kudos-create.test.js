// BON TEST QUI MARCHE

const { createKudo } = require('./kudos');
const db = require('../models');

jest.mock('../models', () => {
        return {
        sequelize: {
            models: {
            Kudo: {
                create: jest.fn(),
            },
            },
        },
        };
    });
    describe('createKudo', () => {
        it('should create kudos and return them', async () => {
            const mockKudoData = { senderId: 1, recipients: [5], message: 'Great Job!', createdAt: new Date() };
            const mockKudo1 = { id: 1, ...mockKudoData };
            db.sequelize.models.Kudo.create
            .mockResolvedValueOnce(mockKudo1)
            const req = { body: mockKudoData };
            const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            };
        
            await createKudo(req, res);
        
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith([mockKudo1]);
        });
    
        it('should return a 400 error if required fields are missing', async () => {
        const req = { body: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    
        await createKudo(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Tous les champs sont obligatoires' });
        });
    });
