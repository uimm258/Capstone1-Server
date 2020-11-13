require('dotenv').config();

console.log(process.env.DATABASE_URL);

module.exports = { "migrationsDirectory": "migrations", "driver": "pg", "connectionString": process.env.DATABASE_URL, "ssl": !!process.env.SSL, }