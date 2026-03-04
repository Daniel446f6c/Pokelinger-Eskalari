// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { initializeAppCheck, ReCaptchaV3Provider, getToken } from "firebase/app-check";

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

// Configure App Check for local development
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    // Set debug token for local development
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = "071ED566-2468-4BD7-90EB-0EA8D213DAA3";
    console.log("App Check Debug Mode is ACTIVE");
}

export const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider("6LdkZ38sAAAAAEr6CMsQ5g47-h-vpm9y7xTP5iI-"),
    isTokenAutoRefreshEnabled: true
});

// Initialize Analytics and get a reference to the service
export const analytics = getAnalytics(app);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);

// Diese Funktion exportieren wir für unsere Hooks/Komponenten
export const ensureAppCheck = () => getToken(appCheck);