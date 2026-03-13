import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"; // Import doc, setDoc, getDoc
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCO3VUfjG0p8Va5jb0pATcDEkS9Abqr86g",
    authDomain: "osis-kece.firebaseapp.com",
    projectId: "osis-kece",
    storageBucket: "osis-kece.firebasestorage.app",
    messagingSenderId: "758831569610",
    appId: "1:758831569610:web:3d7aeda94d6e028a623233",
    measurementId: "G-3QTCTNJVJC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Update data (Menggunakan setDoc agar strukturnya FLAT di satu dokumen)
const addData = async (col, data) => {
    try {
        // Kita kunci ID dokumennya di "config" supaya gak buat dokumen baru terus
        await setDoc(doc(db, col, "config"), data, { merge: true });
        return { success: true };
    } catch (e) {
        console.error("Error saving document: ", e);
        return { success: false, error: e };
    }
};

// Read data (Mengambil langsung dari dokumen "config")
const getData = async (col) => {
    try {
        const docRef = doc(db, col, "config");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data(); // Ini akan mengembalikan { url: "...", server_name: "..." }
        } else {
            return {};
        }
    } catch (e) {
        console.error("Error fetching: ", e);
        return {};
    }
};

export { db, auth, addData, getData };