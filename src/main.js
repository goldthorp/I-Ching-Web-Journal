import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCieJM5t-ukAEl1QuQcyCAEJT3In5uGRQw",
  authDomain: "i-ching-journal.firebaseapp.com",
  projectId: "i-ching-journal",
  storageBucket: "i-ching-journal.appspot.com",
  messagingSenderId: "794578271535",
  appId: "1:794578271535:web:d514e761c85854a3f175da",
  measurementId: "G-4GRNHDYWC6"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const database = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

const app = createApp(App);
app.use(router);
app.mount('#app');
