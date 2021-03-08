// Import firebase-admin library
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// Import JSON data file
const data = require("../src/data/products.json");
// Setup collection name
const collectionKey = "products";

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://masterframing-cee70.firebaseio.com",
});

// Setup Firestore properties
const firestore = admin.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

// Check if any data exists in data file and if it is of object type
if (data && typeof data === "object") {
  // Loop on data object
  Object.keys(data).forEach((docKey) => {
    // Call Firestore API to store each document

    firestore
      .collection(collectionKey) // Set collection name
      .doc() // Set document name/key. If you need an auto generated key, please do not pass the document key.
      .set(data[docKey]) // Set document data
      .then((res) => {
        console.log("Document " + docKey + " successfully written!");
        // Write a 'Success' message after the document is successfully stored in Cloud Firestore database
        return docKey;
      })
      .catch((error) => {
        // console.error("Error writing document: ", error); // Write an 'Error' message if there is a failure
        throw new ErrorHandler(500, "Error writing document");
      });
  });
}
