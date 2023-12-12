// BON TEST QUI MARCHE

const { deleteKudo } = require('./kudos');
const db = require('../models');

jest.mock('../models', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  const KudoMock = dbMock.define('Kudo');
  KudoMock.findByPk = jest.fn();

  return {
    sequelize: {
      models: {
        Kudo: KudoMock,
        User: dbMock.define('User'),
      },
    },
  };
});

describe('deleteKudo', () => {
  it('should delete a kudo if found', async () => {
    const mockKudo = { destroy: jest.fn().mockResolvedValue({}) };
    db.sequelize.models.Kudo.findByPk.mockResolvedValue(mockKudo);

    const req = { params: { id: 102 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteKudo(req, res);

    expect(db.sequelize.models.Kudo.findByPk).toHaveBeenCalledWith(102);
    expect(mockKudo.destroy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith();
  });

  it('should return a 404 error if kudo not found', async () => {
    db.sequelize.models.Kudo.findByPk.mockResolvedValue(null);

    const req = { params: { id: 102 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await deleteKudo(req, res);

    expect(db.sequelize.models.Kudo.findByPk).toHaveBeenCalledWith(102);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Kudo introuvable' });
  });

  // Vous pouvez ajouter d'autres tests pour couvrir d'autres scénarios d'erreurs
});
