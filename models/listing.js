const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type : String,
        requred :true
    },
    description : String,
    img:{
        type:String,
        default :"https://in.images.search.yahoo.com/search/images?p=unsplash+images&fr=mcafee&type=E210IN1589G0&imgurl=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1592093397571-36323190f372%3Ffm%3Djpg%26q%3D60%26w%3D3000%26ixlib%3Drb-4.0.3%26ixid%3DM3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29tbWVyY2lhbCUyMHVzZXxlbnwwfHwwfHx8MA%253D%253D#id=-1&iurl=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1592093397571-36323190f372%3Ffm%3Djpg%26q%3D60%26w%3D3000%26ixlib%3Drb-4.0.3%26ixid%3DM3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29tbWVyY2lhbCUyMHVzZXxlbnwwfHwwfHx8MA%253D%253D&action=click",
        set : (v)=>v===""?"https://in.images.search.yahoo.com/search/images?p=unsplash+images&fr=mcafee&type=E210IN1589G0&imgurl=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1592093397571-36323190f372%3Ffm%3Djpg%26q%3D60%26w%3D3000%26ixlib%3Drb-4.0.3%26ixid%3DM3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29tbWVyY2lhbCUyMHVzZXxlbnwwfHwwfHx8MA%253D%253D#id=-1&iurl=https%3A%2F%2Fimages.unsplash.com%2Fphoto-1592093397571-36323190f372%3Ffm%3Djpg%26q%3D60%26w%3D3000%26ixlib%3Drb-4.0.3%26ixid%3DM3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29tbWVyY2lhbCUyMHVzZXxlbnwwfHwwfHx8MA%253D%253D&action=click":v
    },
    price:Number,
    location:String,
    country:String
})

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;