const express = require('express')
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const app = express()
const port = 8080
const cors= require('cors')
const {ulid} = require('ulid');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'admin',
    port: 5432,
});

const medusa = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'medusa-new',
  password: 'admin',
  port: 5432,
});

app.use(express.json());
app.use(cors())
async function createDetailsTable() {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS user_details (
          id SERIAL PRIMARY KEY,
          client_name VARCHAR(255) NOT NULL,
          company_name VARCHAR(255) NOT NULL,
          company_address VARCHAR(255) NOT NULL,
          company_email VARCHAR(255) NOT NULL,
          company_contact VARCHAR(255) NOT NULL,
          company_gst VARCHAR(255) NOT NULL,
          company_logo VARCHAR(255) NOT NULL,
          company_pincode VARCHAR(255) NOT NULL,
          username VARCHAR(255) NOT NULL,
          password_hash VARCHAR(255) NOT NULL
        );
      `;

        await pool.query(query);
        console.log('Details table created');
    } catch (err) {
        console.error(err);
        console.error('Details table creation failed');
    }
}

createDetailsTable();

app.get('/user_details', async (req, res) => {
    try {
      const query = 'SELECT * FROM user_details;';
      const { rows } = await pool.query(query);
      res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('failed');
    }
  });

app.get('/users', async (req, res) => {
    try {
      const query = 'SELECT * FROM "user";';
      const { rows } = await medusa.query(query);
      res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('failed');
    }
  });

app.post('/user_details', async (req, res) => {
    // Validate the incoming JSON data
    const { client_name, company_name, company_address, company_email, company_contact, company_gst, company_logo, company_pincode, username, password } = req.body;
    if (!client_name || !company_name || !company_address || !company_email || !company_contact || !company_gst || !company_logo || !company_pincode || !username || !password) {
        return res.status(400).send('One of the client_name, or company_name, or company_address, or company_email, or company_contact, or company_gst, or company_logo, or company_pincode, or username, or password is missing in the data');
    }

    try {
        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);
        
        // Create unique id
        const ulidValue = ulid();
        // Insert data into the database
        const query = `
        INSERT INTO user_details (client_name, company_name, company_address, company_email, company_contact, company_gst, company_logo, company_pincode, username, password_hash)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id;
      `;
        const values = [client_name, company_name, company_address, company_email, company_contact, company_gst, company_logo, company_pincode, username, passwordHash];

        const result = await pool.query(query, values);

        const userQuery = `
        INSERT INTO "user" (id, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id;
      `;
        const userValues = [ulidValue, company_email, passwordHash];
        const userResult = await medusa.query(userQuery, userValues);
        console.log("hashcode",passwordHash)

        res.status(201).send({ message: 'New Details created', detailId: result.rows[0].id, userId: userResult.rows[0].id  });
    } catch (err) {
        console.error(err);
        res.status(500).send('Some error has occurred');
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});