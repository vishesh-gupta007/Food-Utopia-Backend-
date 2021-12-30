require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(express.json());

MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cartSchema = {
  restaurantName: String,
  foodId: Array,
  foodName: Array,
  foodImg: Array,
  foodPrice: Array,
};

const userSchema = {
  fName: String,
  lName: String,
  username: String,
  city: String,
  address: String,
  cart: cartSchema,
};

const menuSchema = {
  foodId: Number,
  course: String,
  price: Number,
  name: String,
  foodImg: String,
  hotelName: String,
};

const restroSchema = {
  restroId: Number,
  restroName: String,
  restroImg: String,
  rating: Number,
  menu: [menuSchema],
};

const User = mongoose.model("User", userSchema);

const Restro = mongoose.model("Restro", restroSchema);

app
  .route("/user")
  .get(function (req, res) {
    User.find(function (err, foundUsers) {
      if (!err) {
        res.send(foundUsers);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    User.findOne({ username: req.body.username }, function (err, foundUser) {
      if (!err) {
        if (!foundUser) {
          const newUser = new User({
            fName: _.trim(_.capitalize(req.body.fName)),
            lName: _.trim(_.capitalize(req.body.lName)),
            username: req.body.username,
          });
          newUser.save();
          res.json({ status: "success" });
        } else {
          User.findOne(
            {
              fName: _.trim(_.capitalize(req.body.fName)),
              lName: _.trim(_.capitalize(req.body.lName)),
            },
            function (err, foundName) {
              if (!err) {
                if (!foundName) {
                  res.json({ status: "failure" });
                } else {
                  res.json({ status: "success" });
                }
              }
            }
          );
        }
      } else {
        console.log(err);
      }
    });
  });

app.route("/restro").get(function (req, res) {
  Restro.find(function (err, foundRestros) {
    if (!err) {
      res.send(foundRestros);
    } else {
      res.send(err);
    }
  });
});

app
  .route("/cart")
  .get(function (req, res) {
    User.findOne({ username: req.body.username }, function (err, foundUser) {
      if (!err) {
        res.send(foundUser);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    User.updateOne(
      { username: req.body.username },
      {
        cart: {
          restaurantName: req.body.restroName,
          foodId: req.body.foodId,
          foodName: req.body.foodName,
          foodImg: req.body.foodImg,
          foodPrice: req.body.foodPrice,
        },
      },
      function (err) {
        if (err) {
          res.json({ status: "UpdateFailure" });
        } else {
          res.json({ status: "UpdateSuccess" });
        }
      }
    );
  });

app.route("/showing").post(function (req, res) {
  User.findOne({ username: req.body.username }, function (err, foundUser) {
    if (!err) {
      res.send(foundUser);
    } else {
      res.send(err);
    }
  });
});

app.route("/address").post(function (req, res) {
  const city = _.trim(_.capitalize(req.body.city));
  const address = _.trim(_.capitalize(req.body.address));
  User.updateOne(
    { username: req.body.username },
    { city: city, address: address },
    function (err) {
      if (err) {
        res.json({ status: "UpdateFailure" });
      } else {
        res.json({ status: "UpdateSuccess" });
      }
    }
  );
});

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static("frontend/build"));
// }

app.listen(PORT, function () {
  console.log("Server started on port " + PORT);
});
