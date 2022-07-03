import app from '../index.bundle';
import request from 'supertest'
// const app = require('../dist/index.bundle');
// const request = require('supertest');

describe("GET / ", () => {
    test("Should be 200", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
    });
  });

test("dummy", () => {
    expect(2+2).toEqual(4)
})