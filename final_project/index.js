const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  const accessToken = req.session.authorization?.["accessToken"];
  if (accessToken) {
    jwt.verify(accessToken, "access", (error, customer) => {
      if (!error) {
        req.customer = customer;
        next();
      } else {
        return res
          .status(403)
          .send(
            "You do not have permission to do this action, maybe your token is expired please login again."
          );
      }
    });
  } else {
    return res
      .status(401)
      .send(
        "You are not authorized to perform this action please log in or register first."
      );
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
