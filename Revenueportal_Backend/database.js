const { createPool } = require("mysql");
require("dotenv").config({ path: "./.env" });
const util = require("util");

// console.log("process.env.MYSQL_DB ", process.env.MYSQL_DB);
const pool = createPool({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  password: process.env.DB_PASS,
  database: process.env.MYSQL_DB,
  user: process.env.DB_USER,
  connectionLimit: 100,
  acquireTimeout: 1000000,
});

const poolPromotion = createPool({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST_promotion,
  password: process.env.DB_PASS,
  database: process.env.MYSQL_DB_promotion,
  user: process.env.DB_USER_promotion,
  connectionLimit: 100,
  acquireTimeout: 1000000,
});
const poolcashHub = createPool({
  port: process.env.DB_PORT,
  host: process.env.cashhub_91,
  password: process.env.DB_PASS,
  database: process.env.cashhub_Db,
  user: process.env.DB_USER,
  connectionLimit: 100,
  acquireTimeout: 1000000,
});

const misportal = createPool({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST_misportal,
  password: '0Gloadmin123#$',
  database: process.env.MISPORTAL_DB,
  user: process.env.DB_MIS_USER,
  connectionLimit: 100,
  acquireTimeout: 1000000,
  timezone: 'utc'
});
const kidzmania_kenya= createPool({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST_KENYA,
  password: '0Gloadmin123#$',
  database: process.env.DB_NAME_KENYA,
  user: process.env.DB_USER_KENYA,
  connectionLimit: 100,
  acquireTimeout: 1000000,
  timezone: 'utc'
});

const game_hub= createPool({
  port: process.env.DB_PORT,
  host: process.env.DB_HOST_KENYA,
  password: '0Gloadmin123#$',
  database: process.env.DB_NAME_GAME,
  user: process.env.DB_USER_KENYA,
  connectionLimit: 100,
  acquireTimeout: 1000000,
  timezone: 'utc'
});
let performQuery = util.promisify(poolPromotion.query).bind(poolPromotion);

module.exports = { pool, poolPromotion, performQuery, poolcashHub, misportal,kidzmania_kenya,game_hub };
