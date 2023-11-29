const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!isValid(username)) {
      return res
        .status(409)
        .send(
          `User with name ${username} is already exist please try to enter another one. `
        );
    } else {
      users.push({ username, password });
      console.log(users);
      return res.send(`${username} has been added successfully`);
    }
  } else return res.status(400).send("Please enter username and password.");
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    const books = await axios.get("url");
    return res.status(200).json(books);
  } catch (error) {
    return res.send(JSON.stringify(error));
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const { isbn } = req.params;
  try {
    const books = await axios.get("url");
    const bookDetails = books[isbn];
    if (!!bookDetails) {
      return res.status(200).json(bookDetails);
    } else {
      return res.status(404).send(`There is no book with ${isbn} ISBN.`);
    }
  } catch (error) {
    return res.send(JSON.stringify(error));
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const { author } = req.params;
  try {
    const books = await axios.get("url");
    const arrayBooks = Object.values(books);
    const booksDetails = arrayBooks.filter((book) => book.author === author);
    if (!!booksDetails.length) {
      return res.status(200).json(booksDetails); //this will return array of books since author can have multiple books
    } else {
      return res.status(404).send(`There is no book with ${author} author.`);
    }
  } catch (error) {
    return res.send(JSON.stringify(error));
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const { title } = req.params;
  try {
    const books = await axios.get("url");
    const arrayBooks = Object.values(books);
    const bookDetails = arrayBooks.find((book) => book.title === title);
    if (!!bookDetails) {
      return res.status(200).json(bookDetails);
    } else {
      return res.status(404).send(`There is no book with ${title} title.`);
    }
  } catch (error) {
    return res.send(JSON.stringify(error));
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  const bookDetails = books[isbn];
  if (!!bookDetails) {
    const { reviews } = bookDetails;
    return res.status(200).json(reviews);
  } else {
    return res.status(404).send(`There is no book with ${isbn} ISBN.`);
  }
});

module.exports.general = public_users;
