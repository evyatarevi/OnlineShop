const idCreator = require('../util/idCreator');
const fs = require('fs');
const path = require('path');

const productsListPath = path.join(__dirname, '../', 'data', 'products.json');

class Product{

    constructor(image, title, description, price, available, id){
        this.image = image,
        this.title = title,
        this.description = description,
        this.price = price,
        this.available = available,
        this.id = id

        if(!this.id){
            this.id = idCreator.createUniqueId();
        }
    }

    static fetchAllProducts(){
        return JSON.parse(fs.readFileSync(productsListPath));
    }


}

module.exports = Product;