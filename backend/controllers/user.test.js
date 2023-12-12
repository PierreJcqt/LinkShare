// BON TEST QUI MARCHE BIEN


const { getOneUser } = require('./user');
const { User } = require('../models/index');

jest.mock('../models/index', () => {
  return {
    User: { findOne: jest.fn() },
  };
});

describe('getOneUser', () => {
  it('should return a user if found', async () => {
    const mockUser = { id: 29, name: 'Laura Dern' };
    User.findOne.mockResolvedValue(mockUser);

    const req = { params: { id: 29 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await getOneUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ where: { id: 29} });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockUser);
  });

  it('should return a 500 error if there is a server error', async () => {
    User.findOne.mockRejectedValue(new Error('Erreur serveur'));

    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    await getOneUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ error: "Erreur serveur" });
  });
});
