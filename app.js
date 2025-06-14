const express = require('express')
const cors = require('cors')
const path = require("path")
const ConnectDb = require('./database/ConnectDb')
const PORT = 3000
const routes = require('./routes/Routes')
require('dotenv').config()


const app = express()
//using cors
app.use(cors())
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use("/", express.static(path.resolve(__dirname, "./uploads/user")));
app.use("/", express.static(path.resolve(__dirname, "./uploads/admin")));
app.use("/", express.static(path.resolve(__dirname, "./uploads/post")));
app.use("/", express.static(path.resolve(__dirname, "./uploads/service")));
app.use("/", express.static(path.resolve(__dirname, "./uploads/technician")));


app.use('/api', routes)

app.get('/', (req, res)=>{
    res.send({
        api: "workding",
        succcess: true
    })
})

const start = () => {
  try {
    ConnectDb();
    app.listen(PORT, () => {
        console.log(`Server is Running on PORT: ${PORT}`);
    })
  } catch (error) {
    console.log(`Having Errors Running On Port : ${PORT}`)
  }  
};

start();
