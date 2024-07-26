const initData = require("../init/listingData.js");
const mongoose = require("mongoose");
const Listing = require("../modals/listing.js");

const initDB = async () => {
  await Listing.deleteMany({}).then(() => {
    console.log("Existing data Deleted");
  });
  initData.data = initData.data.map((obj)=>({...obj , owner: "66a1249ec813ecf13fe72650"}))  //new array with owner

  await Listing.insertMany(initData.data)
  .then(()=>{
    console.log("data has been initialise")
  })
};

initDB();
