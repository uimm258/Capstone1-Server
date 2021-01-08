require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://yrspace:testpw@localhost/category',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://yrspace:testpw@localhost/category-test',
    API_TOKEN: process.env.API_TOKEN || '143891f9-9ace-49d9-9a4a-5123d3809ff3',
    JWT_SECRET: process.env.JWT_SECRET || 'capstone1-jwt-secret'
}

