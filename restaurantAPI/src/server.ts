// import express from 'express'
// import sqlite3 from 'sqlite3'
import app from './'

// const app = express()
// const db = sqlite3.Database
const port = 8000;

console.log(app)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});