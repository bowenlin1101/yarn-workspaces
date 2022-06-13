"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const sqlite3_1 = require("sqlite3");
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
var jsonParser = body_parser_1.default.json();
//Initialize dishes
const initDishDb = () => {
    return Promise.resolve(new sqlite3_1.Database('/tmp/database.db'))
        .then((db) => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                resolve(db);
            });
        });
    })
        .then((db) => {
        return new Promise((resolve, reject) => {
            db.run('CREATE TABLE IF NOT EXISTS dishes (id INTEGER PRIMARY KEY, restaurantId INTEGER, name TEXT, description TEXT, imageURL TEXT);', (error) => {
                resolve(db);
            });
        });
    });
};
//Initialize restaurants
const initRestaurantDb = () => {
    return Promise.resolve(new sqlite3_1.Database('/tmp/database.db'))
        .then((db) => {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                resolve(db);
            });
        });
    })
        .then((db) => {
        return new Promise((resolve, reject) => {
            db.run('CREATE TABLE IF NOT EXISTS restaurants (id INTEGER PRIMARY KEY, name TEXT, description TEXT, cuisine TEXT, website TEXT);', (error) => {
                resolve(db);
            });
        });
    });
};
//GET Restaurants
app.get('/restaurants', (request, response) => {
    initRestaurantDb()
        .then((db) => {
        new Promise((resolve, reject) => {
            db.all('SELECT * FROM restaurants;', (error, rows) => {
                if (error)
                    reject(error);
                else
                    resolve(rows);
            });
        })
            .then((results) => {
            response.send(results);
        });
    });
});
//GET dishes
app.get('/dishes', (request, response) => {
    initDishDb()
        .then((db) => {
        new Promise((resolve, reject) => {
            db.all('SELECT * from dishes;', (error, rows) => {
                resolve(rows);
            });
        });
    })
        .then((rows) => {
        response.send(rows);
    });
});
//GET specific restaurant
app.get('/restaurants/:restaurantId', (request, response) => {
    initRestaurantDb()
        .then((db) => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM restaurants where id = ${request.params.restaurantId};`, (error, rows) => {
                response.send(rows);
            });
        });
    });
});
//GET all dishes from a restaurant
app.get('/restaurants/:restaurantId/dishes', (request, response) => {
    initDishDb()
        .then((db) => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM dishes WHERE restaurantId = ${request.params.restaurantId};`, (error, rows) => {
                response.send(rows);
            });
        });
    });
});
//GET specific dish from a restaurant
app.get('/restaurants/:restaurantId/dishes/:dishId', (request, response) => {
    initDishDb()
        .then((db) => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM dishes WHERE restaurantId = ${request.params.restaurantId} AND dishId = ${request.params.dishId};`, (error, rows) => {
                response.send(rows);
            });
        });
    });
});
//DELETE restaurant
app.delete('/restaurants/:restaurantId', (request, response) => {
    initRestaurantDb()
        .then((db) => {
        new Promise((resolve, reject) => {
            // console.log(`DELETE FROM restaurants WHERE id = ${request.params.restaurantId};`)
            db.run(`DELETE FROM restaurants WHERE id = ${request.params.restaurantId};`, (error) => {
                if (error)
                    response.send("error");
                else
                    response.send("restaurant and containing dishes deleted");
            });
        });
    });
    initDishDb()
        .then((db) => {
        new Promise((resolve, reject) => {
            db.run(`DELETE FROM dishes WHERE restaurantId = ${request.params.restaurantId};`, (error) => {
                if (error)
                    response.send("error");
                // else response.send("dish deleted")
            });
        });
    });
});
//DELETE dish
app.delete(`/restaurants/:restaurantId/dishes/:dishId`, (request, response) => {
    initDishDb()
        .then((db) => {
        new Promise((resolve, reject) => {
            db.run(`DELETE FROM dishes WHERE restaurantId = ${request.params.restaurantId} AND id = ${request.params.dishId};`, (error) => {
                if (error)
                    response.send("error");
                else
                    response.send("dish deleted");
                resolve(null);
            });
        });
    });
});
// ADD restaurant
app.post(`/restaurants`, jsonParser, (request, response) => {
    initRestaurantDb()
        .then((db) => {
        new Promise(() => {
            db.run(createRestaurantInput(request.body.name, request.body.description, request.body.cuisine, request.body.website), (error) => {
                if (error)
                    response.send("error");
                else
                    response.send("Restaurant created");
            });
        });
    });
});
//ADD dish
app.post('/restaurants/:restaurantId/dishes', jsonParser, (request, response) => {
    initDishDb()
        .then((db) => {
        new Promise(() => {
            db.run(createDishInput(request.body.restaurantId ? parseInt(request.body.restaurantId) : parseInt(request.params.restaurantId), request.body.name, request.body.description, request.body.imageURL), (error) => {
                if (error)
                    response.send('error');
                else
                    response.send('dish created');
            });
        });
    });
});
//UPDATE restaurant
app.put('/restaurants/:restaurantId', jsonParser, (request, response) => {
    initRestaurantDb()
        .then((db) => {
        new Promise(() => {
            db.run(updateRestaurantInput(parseInt(request.params.restaurantId), request.body.name, request.body.description, request.body.cuisine, request.body.website), (error) => {
                if (error)
                    response.send("error");
                else
                    response.send("updated");
            });
        });
    });
});
//UPDATE dish
app.put('/restaurants/:restaurantId/dishes/:dishId', jsonParser, (request, response) => {
    initDishDb()
        .then((db) => {
        new Promise(() => {
            db.run(updateDishInput(parseInt(request.params.dishId), request.body.restaurantId ? parseInt(request.body.restaurantId) : parseInt(request.params.restaurantId), request.body.name, request.body.description, request.body.imageURL), (error) => {
                if (error)
                    response.send("error");
                else
                    response.send('updated');
            });
        });
    });
});
function createRestaurantInput(name, description, cuisine, website) {
    var insert = `INSERT INTO restaurants (name`;
    var values = "VALUES (";
    if (name) {
        values += `'${name.replace(`'`, `''`)}'`;
    }
    else {
        return undefined;
    }
    if (description) {
        insert += `, description`;
        values += `, '${description.replace(`'`, `''`)}'`;
    }
    if (cuisine) {
        insert += `, cuisine`;
        values += `, '${cuisine.replace(`'`, `''`)}'`;
    }
    if (website) {
        insert += ', website';
        values += `, '${website.replace(`'`, `''`)}'`;
    }
    insert += ') ';
    values += ');';
    return insert + values;
}
function createDishInput(restaurantId, name, description, imageURL) {
    var insert = `INSERT INTO dishes (name`;
    var values = "VALUES (";
    if (name) {
        values += `'${name.replace(`'`, `''`)}'`;
    }
    else {
        return undefined;
    }
    if (description) {
        insert += `, description`;
        values += `, '${description.replace(`'`, `''`)}'`;
    }
    if (restaurantId) {
        insert += `, restaurantId`;
        values += `, ${restaurantId}`;
    }
    if (imageURL) {
        insert += ', imageURL';
        values += `, '${imageURL.replace(`'`, `''`)}'`;
    }
    insert += ') ';
    values += ');';
    return insert + values;
}
function updateRestaurantInput(id, name, description, cuisine, website) {
    var update = `UPDATE restaurants SET`;
    if (name) {
        update += `, name = '${name.replace(`'`, `''`)}'`;
    }
    if (description) {
        update += `, description = '${description.replace(`'`, `''`)}'`;
    }
    if (cuisine) {
        update += `, cuisine = '${cuisine.replace(`'`, `''`)}'`;
    }
    if (website) {
        update += `, website = '${website.replace(`'`, `''`)}'`;
    }
    update += ` WHERE id = ${id};`;
    return update.replace(",", "");
}
function updateDishInput(id, restaurantId, name, description, imageURL) {
    var update = `UPDATE dishes SET`;
    if (name) {
        update += `, name = '${name.replace(`'`, `''`)}'`;
    }
    if (description) {
        update += `, description = '${description.replace(`'`, `''`)}'`;
    }
    if (restaurantId) {
        update += `, restaurantId = ${restaurantId}`;
    }
    if (imageURL) {
        update += `, imageURL = '${imageURL.replace(`'`, `''`)}'`;
    }
    update += ` WHERE id = ${id};`;
    return update.replace(",", "");
}
dotenv_1.default.config();
const port = 8000;
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
