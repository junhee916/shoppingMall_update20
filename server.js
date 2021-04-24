require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const productRouter = require('./router/product')
const orderRouter = require('./router/order')
const userRouter = require('./router/user')

require('./config/database')

//middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))

app.use(morgan("dev"))
app.use(cors())

app.use('/product', productRouter)
app.use('/order', orderRouter)
app.use('/user', userRouter)

const PORT = process.env.PORT || 7000

app.listen(PORT, console.log("connected server..."))