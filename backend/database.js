const Sequelize = require("sequelize");
const path = 'mariadb://root:password@localhost:3306/linksharetwo';
const sequelize = new Sequelize(path);

sequelize.authenticate().then(() => {
  console.log('Connexion établie avec succès !');
}).catch(err => {
  console.error('Impossible de se connecter !', err);
}).finally(() => {
  sequelize.close();
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./models/user")(sequelize, Sequelize);
db.posts = require("./models/posts")(sequelize, Sequelize);
db.comments = require("./models/comments")(sequelize, Sequelize);
db.likes = require("./models/likes")(sequelize, Sequelize);
db.kudos = require("./models/kudos")(sequelize, Sequelize);
db.receives = require("./models/receives")(sequelize, Sequelize);


module.exports = db;