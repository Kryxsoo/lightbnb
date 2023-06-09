require('dotenv').config();

const { Pool } = require('pg');
const properties = require('./json/properties.json');
const users = require('./json/users.json');

const pool = new Pool({
  user: 'tfeginmw',
  password: '2cFOMCGZS5xkvxk0TFmrRo-ShnKljTN-',
  host: 'mahmud.db.elephantsql.com',
  database: 'tfeginmw'
});

// Users

/**
 * Get a single user from the database given their email.
 * @param {string} email - The email of the user.
 * @return {Promise<object>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const query = 'SELECT * FROM users WHERE email = $1';
  return pool.query(query, [email])
    .then((result) => result.rows[0])
    .catch((err) => {
      console.log(err.message);
      throw err;
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id - The id of the user.
 * @return {Promise<object>} A promise to the user.
 */
const getUserWithId = function(id) {
  const query = 'SELECT * FROM users WHERE id = $1';
  return pool.query(query, [id])
    .then((result) => result.rows[0])
    .catch((err) => {
      console.log(err.message);
      throw err;
    });
};

/**
 * Add a new user to the database.
 * @param {object} user - An object containing user details (name, password, email).
 * @return {Promise<object>} A promise to the user.
 */
const addUser = function(user) {
  const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
  const values = [user.name, user.email, user.password];
  return pool.query(query, values)
    .then((result) => result.rows[0])
    .catch((err) => {
      console.log(err.message);
      throw err;
    });
};

// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id - The id of the user.
 * @param {number} limit - The maximum number of reservations to retrieve (default: 10).
 * @return {Promise<Array<object>>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const query = `
    SELECT reservations.id, properties.title, AVG(property_reviews.rating) AS average_rating
    FROM reservations
    JOIN properties ON reservations.property_id = properties.id
    JOIN property_reviews ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY reservations.id, properties.id
    LIMIT $2;
  `;
  return pool.query(query, [guest_id, limit])
    .then((result) => result.rows)
    .catch((err) => {
      console.log(err.message);
      throw err;
    });
};

// Properties

/**
 * Get all properties.
 * @param {object} options - An object containing query options (e.g., city, minimum_price_per_night, maximum_price_per_night).
 * @param {number} limit - The maximum number of properties to retrieve (default: 10).
 * @return {Promise<Array<object>>} A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  let queryString = `
    SELECT properties.*, AVG(property_reviews.rating) AS average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_reviews.property_id
  `;

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city ILIKE $${queryParams.length} `;
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(Number(options.minimum_price_per_night) * 100);
    queryParams.push(Number(options.maximum_price_per_night) * 100);
    queryString += `${queryParams.length > 1 ? 'AND' : 'WHERE'} cost_per_night >= $${queryParams.length - 1} AND cost_per_night <= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams)
    .then((result) => result.rows)
    .catch((err) => {
      console.log(err.message);
      throw err;
    });
};

/**
 * Add a property to the database.
 * @param {object} property - An object containing all of the property details.
 * @return {Promise<object>} A promise to the property.
 */
const addProperty = function(property) {
  const query = `
    INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url,
      cost_per_night, street, city, province, post_code, country, parking_spaces,
      number_of_bathrooms, number_of_bedrooms)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;
  `;

  return pool.query(query, values)
    .then((result) => result.rows[0])
    .catch((err) => {
      console.log(err.message);
      throw err;
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty
};
