import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"; // Import Realtime Database
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiYMqKtJoRpPmKia0uQl_6dK6IFyUETiE",
  authDomain: "hotel-booking-186c3.firebaseapp.com",
  projectId: "hotel-booking-186c3",
  storageBucket: "hotel-booking-186c3.appspot.com",
  messagingSenderId: "430411177093",
  appId: "1:430411177093:web:9995485ab03d57f0eeddec",
  databaseURL: "https://hotel-booking-186c3-default-rtdb.firebaseio.com/", // Add your database URL here
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app); // Initialize Realtime Database

// Helper function to save user info to Realtime Database
function saveUserInfo(userId, name, email) {
  set(ref(database, 'users/' + userId), {
    username: name,
    email: email,
  })
  .then(() => {
    console.log('User info saved successfully');
  })
  .catch((error) => {
    console.error('Error saving user info:', error);
  });
}

// Login
const submitButton = document.getElementById("submit");
submitButton.addEventListener("click", function () {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      window.alert("Success! Welcome back!");
      window.location = "./destination.html"; // Change as needed
    })
    .catch((error) => {
      window.alert("Error occurred. Try again.");
      console.error(error.message);
    });
});

// Sign Up
const signupButton = document.getElementById("sign-up");
signupButton.addEventListener("click", function () {
  const name = document.getElementById("signup-name").value; // Get name input
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      // Save user information to Realtime Database
      saveUserInfo(user.uid, name, email);

      window.alert("Fenton says Welcome. Account created successfully!");
      window.location = "./destination.html"; // Change as needed
    })
    .catch((error) => {
      window.alert("Fenton says account already exists. Try again.");
      console.error(error.message);
    });
});
