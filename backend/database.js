const Sequelize = require("sequelize");
const dbConfig = require("./config/database.json");
const user = require("./models/index");
const path = 'mariadb://root:password@localhost:3306/projet';
const sequelize = new Sequelize(path);

sequelize.authenticate().then(() => {
  console.log('Connexion établie avec succès !');
}).catch(err => {
  console.error('Impossible de se connecter !', err);
}).finally(() => {
  sequelize.close();
});

// Initialise Sequelize
const config = {
    username: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB,
    host: dbConfig.HOST,
    dialect: "mariadb",
    dialectOptions: {
        useUTC: false,
        dateStrings: true,
        typeCast: true
    },
    timezone: '+01:00',
}

// const sequelize = new Sequelize(config);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./models/user")(sequelize, Sequelize);
db.posts = require("./models/posts")(sequelize, Sequelize);
db.comments = require("./models/comments")(sequelize, Sequelize);
db.likes = require("./models/likes")(sequelize, Sequelize);
db.likes = require("./models/kudos")(sequelize, Sequelize);


module.exports = db;


// config de la bdd
// module.exports = {
//   HOST: "localhost",
//   USER: "root",
//   PASSWORD: "",
//   DB: "projet"
// };


