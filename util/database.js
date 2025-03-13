const Sequelize = require("sequelize"); //sequelize is used for session-store
const mysql = require("mysql2");

const isProduction = process.env.NODE_ENV === "production";

const sequelize = new Sequelize(
  process.env.MYSQLDEFAULTDATABASE,
  process.env.MYSQLUSER,
  process.env.MYSQLPASSWORD,
  {
    host: process.env.MYSQLHOST,
    dialect: "mysql",
    logging: false,
    ...(isProduction && {
      dialectOptions: {
        ssl: {
          ca: fs.readFileSync("/etc/secrets/ca.pem"),
        },
      },
    }),
  }
);

const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDEFAULTDATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(isProduction && {
    ssl: {
      ca: fs.readFileSync("/etc/secrets/ca.pem"),
    },
  }),
});

exports.promisePool = pool.promise();
exports.sequelize = sequelize;
