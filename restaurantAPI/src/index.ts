import express, { Express, Request, Response } from 'express';
// import dotenv from 'dotenv';
// import { Database } from 'sqlite3';
import {Database} from 'sqlite3'
import { promisify } from 'util';
// import { rejects } from 'assert';
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
      db.run('CREATE TABLE IF NOT EXISTS dishes (id INTEGER PRIMARY KEY, restaurantId INTEGER, name TEXT, description TEXT, imageURL TEXT);', (error) => {
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
        db.run('CREATE TABLE IF NOT EXISTS restaurants (id INTEGER PRIMARY KEY, name TEXT, description TEXT, cuisine TEXT, website TEXT);', (error) => {
          if (error) reject(error)
          else resolve(db);
        })
      })
    })
};


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
      response.send(results)
    })
  });
})

//GET dishes
app.get('/dishes', (request,response) => {
  initDishDb()
  .then((db) => {
    new Promise((resolve, reject) => {
      db.all('SELECT * from dishes;', (error, rows) => {
        resolve(rows)
      })
    })
  })
  .then((rows) => {
    response.send(rows)
  })
})

//GET specific restaurant
app.get('/restaurants/:restaurantId', (request, response) => {
  initRestaurantDb()
  .then((db) => {
    return new Promise<any[]>((resolve, reject)=>{
      db.all(`SELECT * FROM restaurants where id = ${request.params.restaurantId};`, (error, rows) => {
        response.send(rows)
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
        response.send(rows)
      })
    })
  })
})

//GET specific dish from a restaurant
app.get('/restaurants/:restaurantId/dishes/:dishId', (request, response)=> {
  initDishDb()
  .then((db) => {
    return new Promise<any[]>((resolve, reject) => {
      db.all(`SELECT * FROM dishes WHERE restaurantId = ${request.params.restaurantId} AND dishId = ${request.params.dishId};`, (error, rows) => {
        response.send(rows)
      })
    })
  })
})

//DELETE restaurant
app.delete('/restaurants/:restaurantId', (request, response) => {
  initRestaurantDb()
  .then((db) => {
    new Promise((resolve, reject) => {
      // console.log(`DELETE FROM restaurants WHERE id = ${request.params.restaurantId};`)
      db.run(`DELETE FROM restaurants WHERE id = ${request.params.restaurantId};`, (error) => {
        if (error) response.send("error")
        else response.send("restaurant and containing dishes deleted")
        resolve(null)
      })
    })
  })

  initDishDb()
  .then((db) => {
    new Promise((resolve, reject) => {
      db.run(`DELETE FROM dishes WHERE restaurantId = ${request.params.restaurantId};`, (error) => {
        if (error) response.send("error")
        else response.send("dish deleted")
      })
    })
    .then(() => {
      db.close()
    })
  })
})

//DELETE dish
app.delete(`/restaurants/:restaurantId/dishes/:dishId`, (request,response) => {
  initDishDb()
  .then ((db) => {
    new Promise((resolve, reject) => {
      db.run(`DELETE FROM dishes WHERE restaurantId = ${request.params.restaurantId} AND id = ${request.params.dishId};`, (error) => {
        if (error) response.send("error")
        else response.send("dish deleted")

        resolve(null)
      })
    })
  })
})

// ADD restaurant
app.post(`/restaurants`, jsonParser, (request, response) => {
  initRestaurantDb()
  .then((db) => {
    new Promise(() => {
      console.log(createRestaurantInput(request.body.name, request.body.description, request.body.cuisine, request.body.website))
      db.run(createRestaurantInput(request.body.name, request.body.description, request.body.cuisine, request.body.website), (error) => {
      if (error) response.send(error)
      else response.send("Restaurant created")
     })
    })
  })
})
//ADD dish
app.post('/restaurants/:restaurantId/dishes',jsonParser, (request, response) => {
  initDishDb()
  .then((db) => {
    // console.log(createDishInput(request.body.restaurantId ? parseInt(request.body.restaurantId) : parseInt(request.params.restaurantId), request.body.name, request.body.description, request.body.imageURL))
    new Promise(() => {
      db.run(createDishInput(request.body.restaurantId ? parseInt(request.body.restaurantId) : parseInt(request.params.restaurantId), request.body.name, request.body.description, request.body.imageURL), (error) => {
        if (error) response.send('error')
        else response.send('dish created')
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
        if (error) response.send("error")
        else response.send("updated")
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
        if (error) response.send("error")
        else response.send('updated')
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
    return undefined
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
    return undefined
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


export default app