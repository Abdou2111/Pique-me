// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAuWNjQLsuMuSSDXbiJ-GQBlkRjimTyuHA",
    authDomain: "pique-me.firebaseapp.com",
    projectId: "pique-me",
    storageBucket: "pique-me.firebasestorage.app",
    messagingSenderId: "11198341114",
    appId: "1:11198341114:web:682651122e0edfaa1dce43",
    measurementId: "G-T3BBFXZPT3"
};



// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(firebaseApp);

export default firebaseApp;