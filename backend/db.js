const mongoose = require('mongoose');

const mongoUri =`mongodb+srv://venkirajmoor4u:9rZe3hVCDbhkMINW@cluster0.lfoujx4.mongodb.net/QuotesDB`

const connectToMongo = async () => {
    try{
        await mongoose.connect(mongoUri);
        console.log("successfully connected to mongodb");
    }catch(error){  
        console.log("Failed to connect with mongodb",error);
    }
}
module.exports = connectToMongo;

