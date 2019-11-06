Mongoose Timestamps Plugin
==========================

Simple plugin for [Mongoose](https://github.com/LearnBoost/mongoose) which adds `createdAt` and `updatedAt` date attributes
that get auto-assigned to the most recent create/update timestamp. This is forked from [Mongoose Timestamps](https://github.com/drudge/mongoose-timestamp). Published as a separate npm package since dependencies were outdated and its been so long pull requests are waiting to be merged.

## Installation

`npm install mongoose-timestamp2`

## Usage

```javascript
var timestamps = require('mongoose-timestamp2');
var UserSchema = new Schema({
    username: String
});
UserSchema.plugin(timestamps);
mongoose.model('User', UserSchema);
var User = mongoose.model('User', UserSchema)
```
The User model will now have `createdAt` and `updatedAt` properties, which get
automatically generated and updated when you save your document.

```javascript
var user = new User({
    username: 'Prince'
});
user.save(function (err) {
    console.log(user.createdAt); // Should be approximately now
    console.log(user.createdAt === user.updatedAt); // true
    // Wait 1 second and then update the user
    setTimeout(function () {
        user.username = 'Symbol';
        user.save(function (err) {
            console.log(user.updatedAt); // Should be approximately createdAt + 1 second
            console.log(user.createdAt < user.updatedAt); // true
        });
    }, 1000);
});
```
#### Conflict for createdAt and __v when doing update or findOneAndUpdate (mongoose 5.X)

[Fixed conflict for createdAt and __v when doing update or findOneAndUpdate](https://github.com/drudge/mongoose-timestamp/pull/48). `MongoError: Updating the path 'createdAt' would create a conflict at 'createdAt'`.

#### findOneAndModify (mongoose >= 4.0.1)

Mongoose 4.0.1 added support for findOneAndModify hooks. You must the mongoose promise exec for the hooks to work as mongoose uses mquery when a callback is passed and the hook system is bypassed.

```javascript
User.findOneAndUpdate({
        username: 'Prince'
    }, {
        password: 'goatcheese'
    }, {
        new: true,
        upsert: true
    })
    .exec(function (err, updated) {
        console.log(user.updatedAt); // Should be approximately createdAt + 1 second
        console.log(user.createdAt < user.updatedAt); // true
    });
```

You can specify custom property names by passing them in as options like this:

```javascript
mongoose.plugin(timestamps,  {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
```

Any model's updatedAt attribute can be updated to the current time using `touch()`.
