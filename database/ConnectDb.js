const mongoose = require('mongoose');


const ConnectDb = () => {

    mongoose.connect('mongodb://127.0.0.1:27017/NailWarz')
    .then(() => console.log('Connected!'))
    .catch((error)=> console.log("error", error) )
}


module.exports = ConnectDb