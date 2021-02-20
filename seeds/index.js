const mongoose = require("mongoose");
const Campground = require("../models/campground");
const user = require("../models/user");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers")


mongoose.connect('mongodb://localhost:27017/yelpCamp',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("conneted to mongoose"))
    .catch(() => console.log("erorr not connected to mongoose"));


function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

async function seedDB() {
    await Campground.deleteMany({});
    let newCamp;
    for (let i = 0; i < 200; i++) {
        let randonCity = getRandomElement(cities);
        let price = Math.floor(Math.random() * 20) + 10;
        newCamp = new Campground({
            owner: "6018617f2e20983ff02e8e02",
            title: `${getRandomElement(descriptors)} ${getRandomElement(places)}`,
            price,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, magni saepe repellat ut impedit rerum nemo aperiam quia ab modi nam nesciunt doloremque! Quos nihil cupiditate aliquam corporis veritatis enim!",
            location: `${randonCity.city}, ${randonCity.state}`,
            geometry: {
                type: "Point",
                coordinates: [randonCity.longitude, randonCity.latitude]
            },
            images: [
                {
                    url: "https://res.cloudinary.com/dk179aa93/image/upload/v1612469411/YelpCamp/rygxsop0aup7cboo3cso.png",
                    filename: "YelpCamp/rygxsop0aup7cboo3cso"
                },
                {
                    url: "https://res.cloudinary.com/dk179aa93/image/upload/v1612469414/YelpCamp/urry1nsbwfvzzhzpdfxk.png",
                    filename: "YelpCamp/urry1nsbwfvzzhzpdfxk"
                }
            ]
        });
        await newCamp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
