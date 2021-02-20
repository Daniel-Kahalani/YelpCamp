const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Sechma = mongoose.Schema;

const userShcema = new Sechma({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
userShcema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userShcema);