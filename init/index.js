const mongoose = require("mongoose");
const sampleData = require("./data.js");
const listing = require("../models/listing.js");
main().then(()=>{
    console.log("connection succesful");

}
).catch((err)=>{
    console.log(err);l
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

const initDB = async ()=>{
    await listing.deleteMany({});
    await listing.insertMany(sampleData.data);
    console.log("sample data was inserted sucessfulley");

}

initDB();