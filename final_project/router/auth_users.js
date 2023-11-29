const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const user = users.find((user) => user.username === username);
  return user ? false : true; //if user exist then it is not valid to enter the same name since name should be unique
};

const authenticatedUser = (username, password) => {
  const authenticatedUser = users.find(
    (user) => user.username === username && user.password === password
  );
  return authenticatedUser ? true : false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send("username and password fields are required");
  }
  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 24 * 60 * 60 }
    );
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(201).send("User logged in successfully.");
  } else {
    return res.status(400).send("User credential are not correct.");
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { review } = req.query;
  const { isbn } = req.params;
  const username = req.session.authorization["username"];

  const book = books[isbn];
  if (book) {
    if (!review || review.length === 0) {
      return res.status(400).send("Please enter valid review");
    }
    book.reviews[username] = review;
    return res
      .status(200)
      .send(`review add to ${book["title"]} by ${username} successfully`);
  } else {
    return res.status(404).send(`There is no book with ${isbn} ISBN.`);
  }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.authorization["username"];

  const book = books[isbn];
  if (book) {
    const userReview = book.reviews?.[username];
    if (userReview) {
      delete books[isbn].reviews[username];
      return res.status(204).send(`Your review deleted successfully`);
    } else {
      return res
        .status(204)
        .send(`You do not have review to ${book["title"]} book`);
    }
  } else {
    return res.status(404).send(`There is no book with ${isbn} ISBN.`);
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
