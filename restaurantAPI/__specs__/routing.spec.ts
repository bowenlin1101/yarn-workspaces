import app from '../src/index';
import request from 'supertest'
import { response } from 'express';

/*Initial Setup
DELETE /reset
POST /restaurants {"name": "Bob", "description": "Finger sucking good", "cuisine": "baked goods"}
POST /restaurants {"name": "Homer's shack", "description": "The one and only shack of Homer"}
POST /restaurants/1/dishes {"name": "Blueberry Muffin", "description": "Creamy blueberries with a corn bread base", "imgURL": "google.images"}
POST /restaurants/2/dishes {"name":"Cool food", "description": "Some of the coolest food you'll ever eat"}
*/


//GET TESTS
describe("GET /restaurants ", () => {
    test("Should return restaurants", async () => {
      const response = await request(app).get("/restaurants");
      expect(response.body.results).toBeInstanceOf(Object)
      expect(response.body.results[0]).toHaveProperty("name");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("GET /restaurants/:restaurantId ", () => {
    test("Should return one restaurant", async () => {
      const response = await request(app).get("/restaurants/1");
      expect(response.body.results).toBeInstanceOf(Object)
      expect(response.body.results[0]).toHaveProperty("name");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("GET /dishes ", () => {
    test("Should return dishes", async () => {
      const response = await request(app).get("/dishes");
      expect(response.body.results).toBeInstanceOf(Object)
      expect(response.body.results[0]).toHaveProperty("name");
      expect(response.body.results[0]).toHaveProperty("restaurantId");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("GET /restaurants/:restaurantId/dishes/:dishId", () => {
    test("Should return one dish", async () => {
      const response = await request(app).get("/restaurants/1/dishes/1");
      expect(response.body.results).toBeInstanceOf(Object)
      expect(response.statusCode).toBe(200)
    })
  })

  //ADD TESTS
  describe("POST /restaurants ", () => {
    test("should fail to add due to duplicate", async () => {
      const response = await request(app).post("/restaurants").send({name: "Homer's shack",description:"Shack of Homer"});
      expect(response.body.results).toBe("NonUniqueError");
    });
  });

  describe("POST /restaurants/:restaurantId/dishes ", () => {
    test("should fail to add due to duplicate", async () => {
      const response = await request(app).post("/restaurants/2/dishes").send({name:"Cool food", description: "Some of the coolest food you'll ever eat"});
      expect(response.body.results).toBe("NonUniqueError")
    });
  });

  describe("POST /restaurants/:restaurantId/dishes ", () => {
    test("should successfully add a dish", async () => {
      const response = await request(app).post("/restaurants/1/dishes").send({name:"Super foods", description: "Exotic foods enriched with nutrients"});
      expect(response.body.results).toBeInstanceOf(Object);
      expect(response.body.results[0]).toHaveProperty("name");
      expect(response.body.results[0]).toHaveProperty("restaurantId");
      expect(response.body.results[0]).toHaveProperty("id");
      expect(response.statusCode).toBe(200);
    });
  });

// DELETE TESTS

describe("DELETE /restaurants/:restaurantId/dishes/:dishId ", () => {
  test("should successfully delete a dish", async () => {
    const response = await request(app).delete("/restaurants/1/dishes/3");
    expect(response.body.results).toBeInstanceOf(Object);
    expect(response.body.results.some((dish) => {dish.name == "Super foods"})).toBeFalsy();
    expect(response.statusCode).toBe(200);
  });
});

  describe("DELETE /restaurants/:restaurantId", () => {
    test("should fail to delete a restaurant", async () => {
      const response = await request(app).delete("/restaurants/7");
      expect(response.body.results).toBe("EmptyIndexError");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("DELETE /restaurants/:restaurantId/dishes/:dishId ", () => {
    test("should fail to delete a dish", async () => {
      const response = await request(app).delete("/restaurants/1/dishes/10");
      expect(response.body.results).toBe("EmptyIndexError");
      expect(response.statusCode).toBe(200);
    });
  });

  // (Works in Tandem with the delete tests)
  describe("POST /restaurants ", () => {
    test("should successfully add a restaurant", async () => {
      const response = await request(app).post("/restaurants").send({name:"Congee Queen", description: "We serve Congee fit for a queen", website: "Congeequeen.com"});
      expect(response.body.results).toBeInstanceOf(Object);
      expect(response.body.results[response.body.results.length-1]).toHaveProperty("name");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("POST /restaurants/:restaurantId/dishes ", () => {
    test("should successfully add a dish to Congee Queen", async () => {
      const response = await request(app).post("/restaurants/3/dishes").send({name:"Chicken Congee", description: "warms the cuttles of your heart"});
      expect(response.body.results).toBeInstanceOf(Object);
      expect(response.body.results[response.body.results.length-1]).toHaveProperty("name");
      expect(response.body.results[response.body.results.length-1]).toHaveProperty("restaurantId");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("DELETE /restaurants/:restaurantId", () => {
    test("should successfully delete the restaurant and all containing dishes", async () => {
      const response = await request(app).delete("/restaurants/3");
      expect(response.body.results).toBeInstanceOf(Object);
      expect(response.body.results[0]).toBeInstanceOf(Object);
      expect(response.body.results[1]).toBeInstanceOf(Object);
      expect(response.body.results[0].some((restaurant) => {restaurant.name == "Congee Queen"})).toBeFalsy();
      expect(response.body.results[1].some((dish) => {dish.name == "Chicken Congee"})).toBeFalsy();
      expect(response.statusCode).toBe(200);
    });
  });

  //PUT TESTS

  describe("PUT /restaurants/:restaurantId ", () => {
    test("Should successfully update Homer's shack's cuisine to: Mmmmm", async () => {
      const response = await request(app).put("/restaurants/2").send({cuisine: "Mmmmm"});
      expect(response.body.results).toBeInstanceOf(Object);
      // expect(response.body.results).toBe("fail")
      expect(response.body.results[0].cuisine).toBe("Mmmmm");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("PUT /restaurants/:restaurantId ", () => {
    test("Should revert Homer's shack's cuisine to: Donuts", async () => {
      const response = await request(app).put("/restaurants/2").send({cuisine: "Donuts"});
      expect(response.body.results).toBeInstanceOf(Object);
      // expect(response.body.results).toBe("fail")
      expect(response.body.results[0].cuisine).toBe("Donuts");
      expect(response.statusCode).toBe(200);
    });
  });