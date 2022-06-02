const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campgrounds");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	// await Campground.deleteMany({});
	for (let i = 0; i < 30; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 100) + 1;
		const camp = new Campground({
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			image: "https://source.unsplash.com/collection/483251",
			description:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam quod repellendus tenetur? Ut eum accusantium alias nihil provident quisquam odit optio. Facere obcaecati dolorum dicta perferendis saepe in deleniti laboreQui ipsum libero quae recusandae inventore assumenda enim rem possimus mollitia est nesciunt odio, neque, quia aspernatur quasi, voluptatem eligendi quam. Nulla magnam excepturi ipsum eius quibusdam esse amet libero!",
			price: price,
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
