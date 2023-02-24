import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { dbConnect } from "./db";
import User from "./models/user";

const APIKey = process.env.ASSEMBLYAI_API_KEY;

const app = express();
const urlencodedParser = express.urlencoded({ extended: false });
app.use(express.json(), urlencodedParser);
// app.use(cors({ origin: "http://localhost:5173/", credentials: false }));
app.use(cors({ origin: "*", credentials: false }));

// Regiseter a new user
app.post("/api/register", async (req, res) => {
  await dbConnect();

  const user: { email: string; password: string } = req.body;
  const email = await User.findOne({ email: user.email });

  if (email) res.json({ message: "Email has already been taken" });
  else {
    user.password = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      email: user.email.toLowerCase(),
      password: user.password,
      records: [],
    });
    await newUser.save();
    res.json({ message: "Success" });
  }
});

// JWT token with login

app.post("/api/login", async (req, res) => {
  await dbConnect().catch((err) => {
    console.log("Could not connect to database", err);
  });

  const user = req.body;

  User.findOne({ email: user.email }).then((dbUser) => {
    if (!dbUser) return res.json({ message: "Invalid Email or Password" });
    bcrypt.compare(user.password, dbUser.password).then((isCorrect) => {
      if (isCorrect) {
        const payload = {
          id: dbUser._id,
          email: dbUser.email,
        };
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: 86400 },
          (err, token) => {
            if (err) res.json({ message: err });
            res.json({ message: "Success", token: "Bearer " + token });
          }
        );
      } else res.json({ message: "Invalid Email or Password" });
    });
  });
});

// verify JWT
const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"].split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err)
        return res.json({
          isLoggedIn: false,
          message: "Failed to authenticate token.",
        });
      req.user = {};
      req.user.id = decoded.id;
      req.user.email = decoded.email;
      next();
    });
  } else res.json({ message: "No token provided", isLoggedIn: false });
};

// check if the user is authenticated
app.get("/api/isUserAuth", verifyJWT, (req, res) => {
  return res.json({
    isLoggedIn: true,
  });
});

// Get current user info
app.get("/api/userInfo", verifyJWT, async (req, res) => {
  await dbConnect();

  const email = await User.findOne({ email: req.user.email }).then(
    (dbUser) => dbUser?.email
  );

  res.json({
    isLoggedIn: true,
    email,
  });
});

// Update current user info
app.post("/api/updateUserInfo", verifyJWT, async (req, res) => {
  await dbConnect();

  const cryptedPassword = await bcrypt.hash(req.body.password, 10);

  await User.updateOne(
    { email: req.body.email },
    { $set: { email: req.body.email, password: cryptedPassword } }
  ).then(() => res.json({ message: "Your account has been updated" }));
});

// Delete user info
app.delete("/api/deleteUser", verifyJWT, async (req, res) => {
  await dbConnect();

  User.deleteOne({ email: req.body.email }).then(() =>
    res.json({ message: "Your account has been deleted" })
  );
});

// Save a new recor

app.post("/api/newRecord", verifyJWT, async (req, res) => {
  await dbConnect().catch((err) =>
    console.log("Couldn't connect to database : ", err)
  );

  let records;
  await User.findOne({ email: req.user.email }).then(
    (dbUser) => (records = dbUser.records)
  );

  if (records.length < 1) {
    await User.updateOne(
      { email: req.user.email },
      {
        $set: { records: [req.body] },
      }
    ).then(() => res.json({ message: "Success" }));
  } else {
    records.push(req.body);
    await User.updateOne(
      { email: req.user.email },
      {
        $set: { records: records },
      }
    ).then(() => res.json({ message: "Success" }));
  }
});

// ACCESS RECORDS
app.get("/api/getRecords", verifyJWT, async (req, res) => {
  await dbConnect();

  const records = await User.findOne({ email: req.user.email }).then(
    (dbUser) => dbUser.records
  );

  res.json({
    isLoggedIn: true,
    records: records,
  });
});

// DELETE RECORD
app.post("/api/deleteRecord", verifyJWT, async (req, res) => {
  await dbConnect().catch((err) =>
    console.log("Couldn't connect to database : ", err)
  );

  let records;
  await User.findOne({ email: req.user.email }).then(
    (dbUser) => (records = dbUser.records)
  );

  const recordsUpdated = records.filter(
    (record) => record.id !== parseInt(req.body.id)
  );

  await User.updateOne(
    { email: req.user.email },
    {
      $set: { records: recordsUpdated },
    }
  ).then(() => res.json({ message: "Success" }));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server is live"));
