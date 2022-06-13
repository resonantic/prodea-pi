import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAFCV6zBADtP3oay-leJ5e00x_R3iqWjdY",
  authDomain: "prodea-pi.firebaseapp.com",
  projectId: "prodea-pi",
  storageBucket: "prodea-pi.appspot.com",
  messagingSenderId: "258044886668",
  appId: "1:258044886668:web:f874519946be2c8e3205a9",
  measurementId: "G-QJ6M8FZ31M",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { auth, db, storage, analytics };
