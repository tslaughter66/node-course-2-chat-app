// Create ES6 class for Users.
class Users {
  constructor () {
    // Create an array to hold individual users.
    this.users = [];
  }

  addUser(id, name, room) {
    var user = {id,name,room};
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    var user = this.getUser(id);

    if (user) {
      // filter out the user.
      this.users = this.users.filter((user) => user.id !== id);
    }

    // returns user or undefined (if does not exist.)
    return user;
  }

  getUser(id) {
    // Filter users based on the passed in id. Return the first element in the filtered array => either the user or undefined.
    return this.users.filter((user) => user.id === id)[0];
  }

  getUserList(room) {
    var users = this.users.filter((user) => {
      // Filter is run on all users in users. Check if user.room === room, if so, return adds it to the new users variable.
      return user.room === room;
    });
    var namesArray = users.map((user) => {
      // map is run on all users in filtered users array. Return the value you want added to the array.
      return user.name;
    });

    return namesArray;
  }
}

module.exports = {Users};
