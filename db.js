require('dotenv').config();
const Database = require('dbcmps369');
const hash = require('./bcrypt.js');


class PlacesDB {
    constructor() {
        this.db = new Database();
    }

    async initialize() {
        await this.db.connect();
        await this.db.schema('Place', [
            { name: 'id', type: 'INTEGER' },
            {name:'title', type: 'TEXT'},
            { name: 'firstname', type: 'TEXT' },
            { name: 'lastname', type: 'TEXT' },
            { name: 'address', type: 'TEXT' },
            { name: 'phone', type: 'TEXT' },
            { name: 'email', type: 'TEXT' },
            { name: 'contact_by_email', type: 'INTEGER' },
            { name: 'contact_by_phone', type: 'INTEGER' },
            { name: 'contact_by_mail', type: 'INTEGER' },
            {name: 'latitude', type: 'NUMERIC'},
            {name: 'longitude', type: 'NUMERIC'}
        ], 'id');

        await this.db.schema('Users', [
            { name: 'id', type: 'INTEGER' },
            { name: 'firstname', type: 'TEXT' },
            { name: 'lastname', type: 'TEXT' },
            { name: 'username', type: 'TEXT' },
            { name: 'password', type: 'TEXT' }
        ], 'id');

        //initialize username and password after creating the database
        const id = await this.db.read('Users', [{ column: 'username', value: 'cmps369' }]);

        if (id.length <= 0) {
            await this.db.create('Users', [
                { column: 'firstname', value: 'admin' },
                { column: 'lastname', value: 'admin' },
                { column: 'username', value: 'cmps369' },
                { column: 'password', value: hash('rcnj') },
            ])
        }
    }

    async findPlaces() {
        const places = await this.db.read('Place', []);
        return places;
    }

    async createPlace(title,firstname,lastname,address, phone, email, contact_by_email,contact_by_phone,contact_by_mail, latitude, longitude) {
        const id = await this.db.create('Place', [
            { column: 'title', value: title },
            { column: 'firstname', value: firstname },
            { column: 'lastname', value: lastname },
            { column: 'address', value: address },
            { column: 'phone', value: phone },
            { column: 'email', value: email },
            { column: 'contact_by_email', value: contact_by_email },
            { column: 'contact_by_phone', value: contact_by_phone },
            { column: 'contact_by_mail', value: contact_by_mail },
            { column: 'latitude', value: latitude },
            { column: 'longitude', value: longitude }
        ]);
        return id;
    }

    async createUser(firstname,lastname,username, password) {
        const id = await this.db.create('Users', [
            { column: 'firstname', value: firstname },
            { column: 'lastname', value: lastname },
            { column: 'username', value: username },
            { column: 'password', value: password }
        ]);
        return id;
    }

    async deletePlace(id) {
        await this.db.delete('Place', [{ column: 'id', value: id }]);
    }

    async findUserByUsername(username) {
        const user = await this.db.read('Users', [{ column: 'username', value: username }]);
        if(user.length > 0){
            return user[0];
        }
        return undefined;
    }

    async findUserById(id) {
        const user = await this.db.read('Users', [{ column: 'id', value: id }]);
        if(user.length > 0){
            return user[0];
        }
        return undefined;
    }

    async findPlaceById(id) {
        const place = await this.db.read('Place', [{ column: 'id', value: id }]);
        if(place.length > 0){
            return place[0];
        }
        return undefined;
    }

    async updatePlace(id, title,firstname,lastname,address, phone, email, contact_by_email,contact_by_phone,contact_by_mail, latitude, longitude) {
        await this.db.update('Place', [
            { column: 'title', value: title },
            { column: 'firstname', value: firstname },
            { column: 'lastname', value: lastname },
            { column: 'address', value: address },
            { column: 'phone', value: phone },
            { column: 'email', value: email },
            { column: 'contact_by_email', value: contact_by_email },
            { column: 'contact_by_phone', value: contact_by_phone },
            { column: 'contact_by_mail', value: contact_by_mail },
            { column: 'latitude', value: latitude },
            { column: 'longitude', value: longitude }
        ], [{ column: 'id', value: id }]);
    }
    


}

module.exports = PlacesDB;