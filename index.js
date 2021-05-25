const express = require("express");
var bodyParser = require("body-parser");
const admin = require("firebase-admin");
const cors = require("cors");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

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
    .then(() => {
      console.log("Custom Claim Added to UID.");
      db.collection("users")
        .doc(req.body.uid)
        .set({
          email: req.body.email,
          password: req.body.password,
          uid: req.body.uid,
          userName: req.body.userName,
          userType: req.body.userType,
        })
        .then(() => {
          console.log("SuccessFully Stored To FireStore");
          res.sendStatus(200);
        })
        .catch((err) => {
          admin.auth().deleteUser(req.body.uid);
          console.error(err);
          res.send(err, 404);
        });
    })
    .catch((err) => {
      admin.auth().deleteUser(req.body.uid);
      console.error(err);
      res.send(err, 404);
    });
});

app.get("/", (req, res) => res.send("Hello"));

app.listen(PORT, () =>
  console.log("Admin Server Started Successfully on localhost", PORT)
);
