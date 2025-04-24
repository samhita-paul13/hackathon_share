document.addEventListener("DOMContentLoaded", () => {
    
const firebaseConfig = {
  apiKey: "AIzaSyD4PvKcHD72FY7FpVIqcjCJRz0bwxzp9Ms",
  authDomain: "hackathon-9b458.firebaseapp.com",
  databaseURL: "https://hackathon-9b458-default-rtdb.firebaseio.com",
  projectId: "hackathon-9b458",
  storageBucket: "hackathon-9b458.appspot.com",
  messagingSenderId: "203489211048",
  appId: "1:203489211048:web:61365127dc1962632a889d",
  measurementId: "G-D83F536TTB"
};

const app = firebase.initializeApp(firebaseConfig);
 


  firebase.analytics();
  const auth = firebase.auth();
  const db = firebase.database();
 document.getElementById("login").addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("error-message");
  // All your addEventListener code goes here...
});



    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        errorMsg.textContent = "";
        // If credentials match admin account
        if (email === "datta.arshia@gmail.com" && password === "Adp1@700042") {
          window.location.href = "homeManager.html";
        } else {
          window.location.href = "home.html";
        }
      })
      .catch(() => {
        errorMsg.textContent = "Try again";
      });
  });

  // Add button click event (for opening the popup form)
  document.getElementById("add").addEventListener("click", () => {
    document.getElementById("popup").style.display = "block";
  });

  // Cancel button click event (for closing the popup form)
  document.getElementById("cancel-btn").addEventListener("click", () => {
    document.getElementById("popup").style.display = "none";
  });

  // Submit button click event (for adding the member)
  document.getElementById("submit-btn").addEventListener("click", () => {
    const name = document.getElementById("name-input").value.trim();
    const role = document.getElementById("role-input").value.trim();

    if (!name || !role) {
      alert("Please fill in both fields.");
      return;
    }

    // Save new member to Firebase
    const newMemberRef = db.ref("members").push();
    newMemberRef.set({
      name: name,
      role: role,
      completion: "0%"
    });

    // Create the member card and add it to the container
    const card = document.createElement("div");
    card.className = "mcard";
    card.innerHTML = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Role:</strong> ${role}</p>
      <p><strong>Completion:</strong> 0%</p>
    `;
    document.getElementById("container").appendChild(card);

    // Hide the popup and reset form inputs
    document.getElementById("popup").style.display = "none";
    document.getElementById("name-input").value = "";
    document.getElementById("role-input").value = "";
  });
});
