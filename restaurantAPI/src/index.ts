import express, { Express, Request, response, Response } from 'express';
import {Database} from 'sqlite3'
import { promisify } from 'util';
import bodyParser, { json } from 'body-parser';
import * as _ from 'lodash';

const app: Express = express();
var jsonParser = bodyParser.json()

//Initialize dishes
const initDishDb = () => {
  return Promise.resolve(new Database('/tmp/database.db'))
  .then((db) => {
    return new Promise<Database>((resolve, reject) => {
      db.serialize(() => {
        resolve(db)
      })
    })
  })
  .then((db) => {
    return new Promise<Database>((resolve,reject) => {
      db.run('CREATE TABLE IF NOT EXISTS dishes (id INTEGER PRIMARY KEY, restaurantId INTEGER, name TEXT UNIQUE, description TEXT, imageURL TEXT);', (error) => {
        resolve(db)
      })
    })
  })
}

//Initialize restaurants
const initRestaurantDb = () => {
  return Promise.resolve(new Database('SQLDatabase'))
    .then((db) => {
      return new Promise<Database>((resolve, reject) => {
        db.serialize(() => {
          resolve(db);
        });
      });
    })
    .then((db) => {
      return new Promise<Database>((resolve, reject) => {
        db.run('CREATE TABLE IF NOT EXISTS restaurants (id INTEGER PRIMARY KEY, name TEXT UNIQUE, description TEXT, cuisine TEXT, website TEXT);', (error) => {
          if (error) reject(error)
          else resolve(db);
        })
      })
    })
};
//RESET Database
app.delete('/reset', (request, response) => {
  deleteDb(() => {
    response.send("Table Reset")
  });
});

//GET Restaurants
app.get('/restaurants', (request, response) => {
  initRestaurantDb()
  .then((db) => {
      return new Promise<Object[]>((resolve, reject) => {
        db.all('SELECT * FROM restaurants;', (error, rows) => {
          if (error) reject(error);
          else resolve(rows);
        });
      })
    .then((results) => {
      response.send({results: results})
    })
  });
})

//GET dishes
app.get('/dishes', (request,response) => {
  initDishDb()
  .then((db) => {
    new Promise((resolve, reject) => {
      db.all('SELECT * from dishes;', (error, rows) => {
        response.send({results:rows})
      })
    })
  })
})

//GET specific restaurant
app.get('/restaurants/:restaurantId', (request, response) => {
  initRestaurantDb()
  .then((db) => {
    return new Promise<any[]>((resolve, reject)=>{
      db.all(`SELECT * FROM restaurants where id = ${request.params.restaurantId};`, (error, rows) => {
        response.send({results:rows})
      })
    })
  })
})

//GET all dishes from a restaurant
app.get('/restaurants/:restaurantId/dishes', (request, response)=> {
  initDishDb()
  .then((db) => {
    return new Promise<any[]>((resolve, reject) => {
      db.all(`SELECT * FROM dishes WHERE restaurantId = ${request.params.restaurantId};`, (error, rows) => {
        response.send({results:rows})
      })
    })
  })
})

//GET specific dish from a restaurant
app.get('/restaurants/:restaurantId/dishes/:dishId', (request, response)=> {
  initDishDb()
  .then((db) => {
    return new Promise<any[]>((resolve, reject) => {
      db.all(`SELECT * FROM dishes WHERE restaurantId = ${request.params.restaurantId} AND id = ${request.params.dishId};`, (error, rows) => {
        if (error) response.send({results: "SyntaxError"})
        else response.send({results:rows})
      })
    })
  })
})



// ADD restaurant
app.post(`/restaurants`, jsonParser, (request, response) => {
  initRestaurantDb()
  .then((db) => {
    new Promise((resolve, reject) => {
      db.run(createRestaurantInput(request.body.name, request.body.description, request.body.cuisine, request.body.website), (error) => {
      if (error) response.send({results: "NonUniqueError"});
      else return new Promise(() => {
        db.all("SELECT * FROM restaurants", (error, rows) => {
          if (error) response.send({results: "SyntaxError"});
          else response.send({results:rows});
        })
      })
     })
    })
  })
})
//ADD dish
app.post('/restaurants/:restaurantId/dishes',jsonParser, (request, response) => {
  initDishDb()
  .then((db) => {
    new Promise(() => {
      db.run(createDishInput(request.body.restaurantId ? parseInt(request.body.restaurantId) : parseInt(request.params.restaurantId), request.body.name, request.body.description, request.body.imageURL), (error) => {
        if (error) response.send({results: "NonUniqueError"})
        else return new Promise(()=> {
          db.all("SELECT * FROM dishes", (error, rows) => {
            if (error) response.send({results: "SyntaxError"})
            else response.send({results:rows})
          })
        })
      })
    })
  })
})

//DELETE restaurant
app.delete('/restaurants/:restaurantId', (request, response) => {
  initRestaurantDb()
  .then((db) => {
    new Promise((resolve, reject) => {
      db.all(`SELECT * FROM restaurants WHERE id = ${request.params.restaurantId};`, (err, rows) => {
        if (err) {
          response.send({results:"SyntaxError1"});
        }
        else if (typeof(rows) == 'object' && rows.length == 0){
          response.send({results: "EmptyIndexError"})
        }
        else {
            return new Promise(() => {
            db.run(`DELETE FROM restaurants WHERE id = ${request.params.restaurantId};`, (error) => {
              if (error) response.send({results: "SyntaxError2"})
              else return new Promise(() => {
                initDishDb()
                .then((db) => {
                  new Promise(() => {
                    db.run(`DELETE FROM dishes WHERE restaurantId = ${request.params.restaurantId};`, (error) => {
                      if (error) response.send({results:"SyntaxError3"})
                      else 
                      return new Promise(() => {
                        initRestaurantDb()
                        .then((db) => {
                          new Promise(() => {
                            db.all("SELECT * FROM restaurants", (error, restaurants) => {
                              if (error) response.send("SyntaxError4")
                              else return new Promise(() => {
                                initDishDb()
                                .then((db) => {
                                  db.all("SELECT * FROM dishes", (error, dishes) => {
                                    if (error) response.send("SyntaxError5")
                                    else response.send({results: [restaurants,dishes]})
                                  })
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                  .then(() => {
                    db.close()
                  })
                })
              })
            })
          })
        }
      })
    })
  })
})

//DELETE dish
app.delete(`/restaurants/:restaurantId/dishes/:dishId`, (request,response) => {
  initDishDb()
  .then ((db) => {
    new Promise((resolve, reject) => {
      db.all(`SELECT * FROM dishes WHERE restaurantId = ${request.params.restaurantId} AND id = ${request.params.dishId};`, (err, rows) => {
        if (err) response.send(err)
        else if (rows.length == 0) response.send({results:"EmptyIndexError"})
        else return new Promise (() => {
          db.run(`DELETE FROM dishes WHERE restaurantId = ${request.params.restaurantId} AND id = ${request.params.dishId};`, (error) => {
            if (error) response.send({results: "SyntaxError"});
            else return new Promise((resolve, reject) => {
              db.all("SELECT * FROM dishes", (err, rows) => {
                response.send({results:rows})
              })
            })
          })
        })
      })
    })
  })
})


//UPDATE restaurant
app.put('/restaurants/:restaurantId', jsonParser, (request, response) => {
  initRestaurantDb()
  .then((db) => {
    new Promise(() => {
      // console.log(updateRestaurantInput(parseInt(request.params.restaurantId), request.body.name, request.body.description, request.body.cuisine, request.body.website))
      db.run(updateRestaurantInput(parseInt(request.params.restaurantId), request.body.name, request.body.description, request.body.cuisine, request.body.website), (error) => {
        if (error) response.send(error)
        else return new Promise(()=> {
          initRestaurantDb()
          .then((db) => {
            db.all(`SELECT * FROM restaurants WHERE id = ${request.params.restaurantId};`, (error, rows) => {
              if (error) response.send({results: error})
              else response.send({results:rows})
            })
          })
        })
      })
    })
  })
})

//UPDATE dish
app.put('/restaurants/:restaurantId/dishes/:dishId', jsonParser, (request, response) => {
  initDishDb()
  .then((db) => {
    new Promise(() => {
      // console.log(updateDishInput(parseInt(request.params.dishId), parseInt(request.body.restaurantId), request.body.name, request.body.description, request.body.imageURL))
      db.run(updateDishInput(parseInt(request.params.dishId), request.body.restaurantId ? parseInt(request.body.restaurantId) : parseInt(request.params.restaurantId), request.body.name, request.body.description, request.body.imageURL), (error) => {
        if (error) response.send(error)
        else return new Promise(()=> {
          db.all(`SELECT * FROM dishes WHERE id = ${request.params.dishId};`, (error, rows) => {
            if (error) response.send({results: error})
            else response.send({results:rows})
          })
        })
      })
    })
  })
})

function createRestaurantInput(name:string, description:string, cuisine:string, website:string):any {
  var insert = `INSERT INTO restaurants (name`
  var values = "VALUES ("
  if (name){
    values += `'${name.replace(`'`, `''`)}'`
  } else {
    return "error"
  }
  if (description){
    insert += `, description`
    values += `, '${description.replace(`'`, `''`)}'`
  }
  if (cuisine){
    insert += `, cuisine`
    values += `, '${cuisine.replace(`'`, `''`)}'`
  }
  if (website){
    insert += ', website'
    values += `, '${website.replace(`'`, `''`)}'`
  }
  insert += ') '
  values += ');'
  return insert + values
}

function createDishInput(restaurantId: number, name:string, description:string, imageURL:string):any {
  var insert = `INSERT INTO dishes (name`
  var values = "VALUES ("
  if (name){
    values += `'${name.replace(`'`, `''`)}'`
  } else {
    return "error"
  }
  if (description){
    insert += `, description`
    values += `, '${description.replace(`'`, `''`)}'`
  }
  if (restaurantId){
    insert += `, restaurantId`
    values += `, ${restaurantId}`
  }
  if (imageURL){
    insert += ', imageURL'
    values += `, '${imageURL.replace(`'`, `''`)}'`
  }
  insert += ') '
  values += ');'
  return insert + values
}

function updateRestaurantInput(id:number, name:string, description: string, cuisine:string, website:string):any{
  var update = `UPDATE restaurants SET`
  if (name){
    update += `, name = '${name.replace(`'`, `''`)}'`
  } 
  if (description){
    update += `, description = '${description.replace(`'`, `''`)}'`
  }
  if (cuisine){
    update += `, cuisine = '${cuisine.replace(`'`, `''`)}'`
  }
  if (website){
    update += `, website = '${website.replace(`'`, `''`)}'`
  }
  update += ` WHERE id = ${id};`
  return update.replace(",", "")
}

function updateDishInput(id:number, restaurantId: number, name:string, description: string, imageURL: string):any{
  var update = `UPDATE dishes SET`
  if (name){
    update += `, name = '${name.replace(`'`, `''`)}'`
  } 
  if (description){
    update += `, description = '${description.replace(`'`, `''`)}'`
  }
  if (restaurantId){
    update += `, restaurantId = ${restaurantId}`
  }
  if (imageURL){
    update += `, imageURL = '${imageURL.replace(`'`, `''`)}'`
  }
  update += ` WHERE id = ${id};`
  return update.replace(",", "")
}

const deleteDb = (callback:Function) => {
  initRestaurantDb()
  .then((db) => {
    return new Promise<Database> ((resolve, reject) => {
      db.run('DROP TABLE IF EXISTS restaurants', (error) => {
        if (error) response.send("SyntaxError")
        else return new Promise(() => {
          initDishDb()
          .then((db) => {
            db.run('DROP TABLE IF EXISTS dishes', (error) => {
              if (error) response.send("SyntaxError")
              else callback()
            })
          })
        })
      });
    })
  })
}

export default app