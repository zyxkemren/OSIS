import mysql from "mysql2/promise";
import getData from "./getData";

const createPool = async () => {
  const data = await getData("integration");
  const db = data.data;

  return mysql.createPool({
    host: db.db_host,
    port: db.db_port,
    user: db.db_username,
    password: db.db_password,
    database: db.db_name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
};

const pool = await createPool();

export default pool;
