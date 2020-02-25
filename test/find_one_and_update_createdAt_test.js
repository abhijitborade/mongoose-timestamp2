var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var timestamps = require('../');

mongoose.connect('mongodb://localhost:27017/mongoose_timestamps', {
        useUnifiedTopology: true,
        useNewUrlParser: true
    },
    function (err) {
        if(err) {
            console.error('MongoDB error: ' + err.message);
            console.error('Make sure a mongoDB server is running and accessible by this application');
        } else {
            runTest();
        }
    });

var UserSchema = new Schema({
    email: String,
    name: String
});



UserSchema.plugin(timestamps);

var User = mongoose.model('user', UserSchema, 'users');

function runTest() {
    User.findOneAndUpdate({
        email: "test@example.com"
    }, {
        name: "Test User",
        email: "test@example.com"
    }, {
        new: true,
        upsert: true
    }, function (err, user) {
        user.name = "Some Other User";
        User.findByIdAndUpdate(user._id.toString(), {
            $set: user
        }, {
            new: true
        }, function (err, updatedUser) {
            // console.log(err, updatedUser, user);
            console.log(err);
        });
    });
}