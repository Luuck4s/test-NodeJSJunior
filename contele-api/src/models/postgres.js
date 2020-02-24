const Pool = require("pg").Pool;

const db = new Pool({
  user: "postgres",
  password: "password",
  host: "localhost",
  port: 5432,
  database: "contele"
});

createConteleClient();

async function createConteleClient() {
  db.query(
    `CREATE TABLE IF NOT EXISTS contele_client (
      id SERIAL PRIMARY KEY, 
      first_name VARCHAR(50),
      last_name VARCHAR(50), 
      email VARCHAR(100), 
      telephone_code VARCHAR(5), 
      language VARCHAR(50), 
      country VARCHAR(100)
    )`
  )
    .then(async () => await createConteleClientShippAddress())
    .catch(err => {
      console.log(
        `[POSTGRES] An error ocorred on create table [contele_client] ${err}`
      );
    });
}

async function createConteleClientShippAddress() {
  db.query(
    `CREATE TABLE IF NOT EXISTS contele_client_shipp_address (
      id SERIAL PRIMARY KEY,
      id_client SERIAL, 
      address VARCHAR(300), 
      city VARCHAR(100),
      state VARCHAR(100), 
      zip_code VARCHAR(50),
      same_bill_address BOOLEAN,
      FOREIGN KEY (id_client) REFERENCES contele_client (id)
    )`
  )
    .then(async () => await createConteleClientBillAddress())
    .catch(err => {
      console.log(
        `[POSTGRES] An error ocorred on create table [contele_client_shipp_address] ${err}`
      );
    });
}

async function createConteleClientBillAddress() {
  db.query(
    `CREATE TABLE IF NOT EXISTS contele_client_bill_address (
      id SERIAL PRIMARY KEY,
      id_client SERIAL, 
      address VARCHAR(300), 
      city VARCHAR(100),
      state VARCHAR(100), 
      zip_code VARCHAR(50),
      FOREIGN KEY (id_client) REFERENCES contele_client (id)
    )`
  )
    .then(async () => await createConteleClientOthers())
    .catch(err => {
      console.log(
        `[POSTGRES] An error ocorred on create table [contele_client_bill_address] ${err}`
      );
    });
}

async function createConteleClientOthers() {
  db.query(
    `CREATE TABLE IF NOT EXISTS contele_client_others (
      id SERIAL PRIMARY KEY,
      id_client SERIAL, 
      cut_fuel_device BOOLEAN, 
      trackers BOOLEAN,
      identify_fleet BOOLEAN, 
      quantity_trackers INT,
      FOREIGN KEY (id_client) REFERENCES contele_client (id)
    )`
  )
    .then(() => console.log("[POSTGRES] All tables are created successfully"))
    .catch(err => {
      console.log(
        `[POSTGRES] An error ocorred on create table [contele_client_bill_address] ${err}`
      );
    });
}

module.exports = db;
