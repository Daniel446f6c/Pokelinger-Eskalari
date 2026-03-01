// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB5viRxjFt81JNCKQmDhiNRF9jcGC-bpr4",
    authDomain: "pokelinger-eskalari.firebaseapp.com",
    projectId: "pokelinger-eskalari",
    databaseURL: "https://pokelinger-eskalari-default-rtdb.europe-west1.firebasedatabase.app",
    storageBucket: "pokelinger-eskalari.firebasestorage.app",
    messagingSenderId: "812228757606",
    appId: "1:812228757606:web:6a825290c6241a016685a7",
    measurementId: "G-B19VE15CJS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);
