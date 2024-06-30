const sampleListings = require("../init/listingData.js");
const mongoose = require("mongoose");
const Listing = require("../modals/listing.js");

const initDB = async () => {
  await Listing.deleteMany({}).then(() => {
    console.log("Existing data Deleted");
  });

  await Listing.insertMany(sampleListings)
  .then(()=>{
    console.log("data has been initialise")
  })
};

initDB();
