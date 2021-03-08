const admin = require("firebase-admin");

if (process.env.FUNCTIONS_EMULATOR) {
  admin.initializeApp(
    {
      databaseURL: "localhost:8084",
    }
  );
} else {
  admin.initializeApp(
    {
      databaseURL: "https://masterframing-cee70.firebaseio.com",
    }
  );
}


module.exports = admin;
