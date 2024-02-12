const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const app = express();
const bcrypt = require("bcrypt"); // password encryptor
const jwt = require("jsonwebtoken"); // webtoken
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require("fs");
const dotenv = require("dotenv"); // allows reading of .env variables
const AppError = require("./utils/appError"); // Custom Error class
const globalErrorHandler = require("./controller/errorController"); //error handler

const upload = multer({ dest: "uploads/" }); // Middleware that sets destination of upload
dotenv.config(); // configures dotenv
app.use(cors({ credentials: true, origin: "http://localhost:5173" })); // set cors permissions with credentials (cookies)
app.use(express.json()); // express middleware to parse JSON
app.use(cookieParser()); // middleware to parse cookies
app.use("/uploads", express.static(__dirname + "/uploads")); // set static files to upload folder
app.use("/public", express.static(__dirname + "/public"));
const port = process.env.PORT || 4000;
//bcrypt
const saltRounds = 10;
const salt = bcrypt.genSaltSync(); //generates salt for password encryption

// jwt secret code
const secret = process.env.SECRET;

// mongoose connect to mongoDB,  mongoose is middleware used to interact with mongoDB
// will only listen once connected to mongoDB database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port);
  })
  .catch((error) => {
    console.error(error);
  });

// used to catch all rejected promises from async
// called returns an annonymous function
// uses next to pass error to globalErrorHandler
// next added to all async functions
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

// jwt sign and varification
// sign
// const jwtsign = function (username, id) {
//   jwt.sign({ username: username, id: id }, secret);
// };

//verify

// jwt.verify(token, secret, {}, (err, info) => {
//   try {
//     if (err) throw err;
//   } catch (error) {
//     res.status(400).json(error.message);
//   }

////////////////////////////////////////////////////////////////
// Register and Login

// registration catch from RegisterPage
app.post(
  "/register",
  catchAsync(async (req, res, next) => {
    const { username, password } = req.body;
    //checks if user input password and username

    if (!username || !password) {
      throw Error("All fields must be filled");
    }
    const exists = await User.findOne({ username });

    if (exists) {
      throw Error("Username already in use");
    }

    // registers user to mongoDB using User model from User.js
    const user = await User.create({
      username,
      password: bcrypt.hashSync(password, salt), // encrypt passwored
    });

    const token = jwt.sign({ username, id: user._id }, secret);
    //sends token cookie and user id and username
    res.status(200).cookie("token", token).json({
      id: user._id,
      username,
    });
  })
);

// login catch from LoginPage
app.post(
  "/login",
  catchAsync(async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
      throw Error("All fields must be filled");
    }

    const user = await User.findOne({ username }); //Find user from mongoDB
    if (!user) {
      throw Error("incorrect username");
    }
    passwordMatch = bcrypt.compareSync(password, user.password);

    //compare userbase password (user) with passed in password
    if (!passwordMatch) {
      throw Error("Incorrect password");
    }

    const token = jwt.sign({ username, id: user._id }, secret);

    res.status(200).cookie("token", token).json({
      id: user._id,
      username,
    });
  })
);

////////////////////////////////////////////////////////

// checks webtoken from header.jsx to check if signed in
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return;
  }

  jwt.verify(token, secret, {}, (err, info) => {
    try {
      if (err) throw err;
      res.status(200).json(info);
    } catch (error) {
      res.status(400).json(error.message);
    }
  });
});

///////////////////////////////////////////////////////////////
//Logout
// sets token to "" when logged out
app.post("/logout", (req, res) => {
  res.status(200).cookie("token", "").json("ok");
});

//////////////////////////////////////////////////////////////
// Create, Edit and delete posts

// post catcher from CreatePost.jsx
// uploads image to uploads folder (multer)
app.post(
  "/post",
  upload.single("file"),
  catchAsync(async (req, res, next) => {
    //checks to see if image was uploaded and renames path so PostPage can reference image,  otherwise remains 'null'
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }
    // verifies user to see who posted
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      try {
        if (err) throw err;

        const { title, summary, content } = req.body;

        // creates post using Post.js model
        const post = await Post.create({
          title,
          summary,
          content,
          cover: newPath,
          author: info.id,
        });
        res.status(200).json(post);
      } catch (error) {
        res.status(400).json(error.message);
      }
    });
  })
);

// put catcher from EditPost.jsx
app.put(
  "/post",
  upload.single("file"),
  catchAsync(async (req, res, next) => {
    let newPath = null;
    if (req.file) {
      console.log(req.file);
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }
    // verifies token and finds post user is updating in database
    const { token } = req.cookies;

    jwt.verify(token, secret, {}, async (err, info) => {
      try {
        if (err) throw err;
        const { id, title, summary, content } = req.body;
        // console.log(req.body);
        const post = await Post.findById(id);
        // checks to see if updater is author
        const isAuthor =
          JSON.stringify(post.author) === JSON.stringify(info.id);
        if (!isAuthor) {
          return res.status(400).json("you are not the author");
        }
        // sets data from database to new data passed by user in req
        post.title = title;
        post.summary = summary;
        post.content = content;
        post.cover = newPath ? newPath : post.cover;
        await post.save();
        res.status(200).json(post);
      } catch (error) {
        res.status(400).json(error.message);
      }
    });
  })
);

// delete request from PostPage by author
app.delete(
  "/post/:id",
  catchAsync(async (req, res, next) => {
    const { token } = req.cookies;
    const { id } = req.params;

    jwt.verify(token, secret, {}, async (err, info, next) => {
      try {
        if (err) throw err;
        // finds post with Post.js method
        const post = await Post.findById(id);
        // checks to see if database user is same as token
        const isAuthor =
          JSON.stringify(post.author) === JSON.stringify(info.id);
        if (!isAuthor) {
          return res.status(400).json("you are not the author");
        }
        //////////////////////////////////////////////////
        // deletes image
        fs.unlink(post.cover, (err) => {
          if (err) throw err;
          else console.log("file deleted");
        });
        //////////////////////////////////////////////////////
        //delete post, and respond with confirm
        await Post.findByIdAndDelete(id);
        res.status(200).json("post deleted");
      } catch (error) {
        res.status(400).json("Somthing went wrong");
      }
    });
  })
);

////////////////////////////////////////////////////////////////

// get request from IndexPage.jsx to populate page
app.get(
  "/post",
  catchAsync(async (req, res, next) => {
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(posts);
  })
);

// get request from PostPage to show full post when selected
app.get(
  "/post/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const post = await Post.findById(id).populate("author", ["username"]);
    res.json(post);
  })
);

app.all("*", (req, res, next) => {
  // const err = new Error(`cant find ${req.originalUrl} on this server`);
  // err.status = "fail";
  // err.statusCode = 404;

  next(new AppError(`cant find ${req.originalUrl} on this server`, 404));
});

app.use(
  globalErrorHandler
  //   (err, req, res, next) => {
  //   console.log(err.stack);

  //   err.statusCode = err.statusCode || 500;
  //   err.status = err.status || "error";

  //   res.status(err.statusCode).json({
  //     status: err.status,
  //     message: err.message,
  //   });
  // }
);
// unhandles syncronos errors
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});
// handle unhandled errors
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});
