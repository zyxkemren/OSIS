// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { collection, addDoc, getDocs } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCO3VUfjG0p8Va5jb0pATcDEkS9Abqr86g",
    authDomain: "osis-kece.firebaseapp.com",
    projectId: "osis-kece",
    storageBucket: "osis-kece.firebasestorage.app",
    messagingSenderId: "758831569610",
    appId: "1:758831569610:web:3d7aeda94d6e028a623233",
    measurementId: "G-3QTCTNJVJC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// nambahain data
const addData = async (col, data) => {
    try {
        const docRef = await addDoc(collection(db, col), data);
        return {};
    } catch (e) {
        console.error("Error adding document: ", e);
        return e;
    }
};

// read data
const getData = async (col) => {
    return await getDocs(collection(db, col));
}

export { db, analytics, auth, addData, getData };