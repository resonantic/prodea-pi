import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFCV6zBADtP3oay-leJ5e00x_R3iqWjdY",
  authDomain: "prodea-pi.firebaseapp.com",
  projectId: "prodea-pi",
  storageBucket: "prodea-pi.appspot.com",
  messagingSenderId: "258044886668",
  appId: "1:258044886668:web:f874519946be2c8e3205a9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
