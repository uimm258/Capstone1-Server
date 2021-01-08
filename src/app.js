require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const CategoryRoute = require('./category/category_router')
const ScriptsRoute = require('./scripts/scripts_router')
const authRouter = require('./auth/auth-router')
const validateBearerToken = require('./validate-bearer-token')
const AdminCategoryRouter = require('./category/admin_category_router')
const AdminScriptsRoute = require('./scripts/admin_scripts_route')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

// routes for category and scritps
app.use('/category', CategoryRoute)
app.use('/scripts', ScriptsRoute)
app.use('/auth', authRouter);
app.use('/admin', AdminCategoryRouter)
app.use('/admin', AdminScriptsRoute)


app.get('/', (req, res) => {
   res.send('Hello, world!')
})

//app.use(validateBearerToken)

// error handlers
app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app
