require('dotenv').config();

module.exports = {
  engine: 'classic',
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
