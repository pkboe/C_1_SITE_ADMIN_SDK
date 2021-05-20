const express = require("express");
var bodyParser = require("body-parser");
const admin = require("firebase-admin");
const cors = require("cors");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const PORT = process.env.PORT || 5000;

var corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
};

// function deleteUser(uid) {
//   admin
//     .auth()
//     .deleteUser(uid)
//     .then(function () {
//       console.log("Successfully deleted user", uid);
//     })
//     .catch(function (error) {
//       console.log("Error deleting user:", error);
//     });
// }

// function getAllUsers(nextPageToken) {
//   admin
//     .auth()
//     .listUsers(100, nextPageToken)
//     .then(function (listUsersResult) {
//       listUsersResult.users.forEach(function (userRecord) {
//         uid = userRecord.toJSON().uid;
//         deleteUser(uid);
//       });
//       if (listUsersResult.pageToken) {
//         getAllUsers(listUsersResult.pageToken);
//       }
//     })
//     .catch(function (error) {
//       console.log("Error listing users:", error);
//     });
// }
// getAllUsers();  Delete all users by fetchin em and delete one by one ;)

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/", function (req, res) {
  admin
    .auth()
    .setCustomUserClaims(req.body.uid, {
      userType: req.body.userType,
    })
    .then((ref) => {
      console.log("Custom Claim Added to UID.");
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

app.get("/", (req, res) => res.send("Hello"));

app.listen(PORT, () =>
  console.log("Admin Server Started Successfully on localhost", PORT)
);
