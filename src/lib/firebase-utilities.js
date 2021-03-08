// load firebase
// const firebase = require("firebase")
// require("firebase/firebase-auth")
//add analytics and hosting later on
import firebase from "firebase/app";
import "firebase/auth";

const config = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export default firebase;
