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

  // ✅ LOGIN button event handler
  document.getElementById("login").addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("error-message");

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        errorMsg.textContent = "";
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

  // ✅ "Add Member" button (open popup)
  document.getElementById("add").addEventListener("click", () => {
    document.getElementById("popup").style.display = "block";
  });

  // ✅ Cancel button (close popup)
  document.getElementById("cancel-btn").addEventListener("click", () => {
    document.getElementById("popup").style.display = "none";
  });

  // ✅ Submit button (add member to Firebase)
  document.getElementById("submit-btn").addEventListener("click", () => {
    const name = document.getElementById("name-input").value.trim();
    const role = document.getElementById("role-input").value.trim();

    if (!name || !role) {
      alert("Please fill in both fields.");
      return;
    }

    const newMemberRef = db.ref("members").push();
    newMemberRef.set({
      name: name,
      role: role,
      completion: "0%"
    });

    const card = document.createElement("div");
    card.className = "mcard";
    card.innerHTML = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Role:</strong> ${role}</p>
      <p><strong>Completion:</strong> 0%</p>
    `;
    document.getElementById("container").appendChild(card);

    document.getElementById("popup").style.display = "none";
    document.getElementById("name-input").value = "";
    document.getElementById("role-input").value = "";
  });
});

// For handling video upload
function triggerUploadVideo() {
    const videoFile = document.getElementById("videoInput").files[0];
    
    // Store the video file in local storage or process as needed
    if (videoFile) {
        localStorage.setItem("videoFile", JSON.stringify(videoFile));

        // Redirect to the video generation page
        window.location.href = 'videoUpload.html';  // Replace with your actual path
    } else {
        alert('Please select a video file!');
    }
}

// For handling blog document upload
function triggerUploadDoc() {
    const docFile = document.getElementById("docInput").files[0];

    // Store the doc file in local storage or process as needed
    if (docFile) {
        localStorage.setItem("docFile", JSON.stringify(docFile));

        // Redirect to the blog generation page
        window.location.href = 'blogUpload.html';  // Replace with your actual path
    } else {
        alert('Please select a blog document!');
    }
}
