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
    sampleData.data = sampleData.data.map((obj)=>({
        ...obj,
        owner : "6aafd395f8f0e4c764127c56"
    }))
    await listing.insertMany(sampleData.data);
    console.log("sample data was inserted sucessfulley");

}

initDB();