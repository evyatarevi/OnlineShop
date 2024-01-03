const fs = require('fs');
const path = require('path');
const idCreator = require('../util/idCreator');


const usersListPath = path.join(__dirname, '../', 'data', 'users.json');

class User{

    constructor(email, password, fullName, city, street, id){  //Id is the last parameter in order to user could actually also omit it).
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.city = city;
        this.street = street;
        this.id = id;
        
        if(!this.id){  //in case we create new user
            this.id = idCreator.createUniqueId();
        }
    }


    static fetchAllUsers() {
        console.log('fetchAllUsers() happen');
        return JSON.parse(fs.readFileSync(usersListPath));
    }

    saveUser() {
        const usersList = User.fetchAllUsers(); //User.fetchAllUsers() - because it is static method. If i want use in instance method i write 'this' like: this.deleteUser();
        usersList.push(this); //can use 'this' only!
        fs.writeFileSync(usersListPath, JSON.stringify(usersList));
        return 'The user has been saved';
    }

    deleteUser() {
        const usersList = User.fetchAllUsers();
        const updatedUsersList = usersList.filter(user => user.id !== this.id);
        fs.writeFileSync(usersListPath, JSON.stringify(updatedUsersList));
        return 'The user has been deleted';
    }




}

module.exports = User;