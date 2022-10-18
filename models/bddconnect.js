const mongoose = require("mongoose");


const options = {
  connectTimeoutMS: 5000,
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(process.env.MONGO_URL, options, function (err) {
  console.log(err);
});


module.exports = mongoose;