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

// Video upload button
const videoInput = document.getElementById('videoInput');
// Document upload button
const docInput = document.getElementById('docInput');

// Trigger video upload
function triggerUploadVideo() {
  videoInput.click();  // Opens the file manager for video
}

// Trigger document upload
function triggerUploadDoc() {
  docInput.click();  // Opens the file manager for document
}

// Handle video file selection
videoInput.addEventListener('change', (event) => {
  if (videoInput.files.length > 0) {
    const videoFile = videoInput.files[0];
    
    // Store video data temporarily (could be done using sessionStorage, localStorage, or another approach)
    window.localStorage.setItem("videoFile", JSON.stringify(videoFile));
    
    // Redirect to the generation page
    window.location.href = "videoUpload.html";  
  }
});

// Handle document file selection (for blog content)
docInput.addEventListener('change', (event) => {
  if (docInput.files.length > 0) {
    const docFile = docInput.files[0];
    
    // Store document data temporarily
    window.localStorage.setItem("docFile", JSON.stringify(docFile));
    
    // Redirect to the generation page
    window.location.href = "blogUpload.html";  
  }
});
// Retrieve uploaded video or document from localStorage
let videoFile = JSON.parse(localStorage.getItem("videoFile"));
let docFile = JSON.parse(localStorage.getItem("docFile"));
let title = "";
let description = "";
let thumbnailUrl = "";

// Generate title from video
function generateTitle() {
  const formData = new FormData();
  formData.append('file', videoFile);

  fetch('/generate-title', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    title = data.title;
    document.getElementById('title').innerText = data.title;  // Display generated title
  });
}

// Generate description from video
function generateDescription() {
  const formData = new FormData();
  formData.append('file', videoFile);

  fetch('/generate-description', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    description = data.description;
    document.getElementById('description').innerText = data.description;  // Display generated description
  });
}

// Generate thumbnail from video
function generateThumbnail() {
  const formData = new FormData();
  formData.append('file', videoFile);

  fetch('/generate-thumbnail', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    thumbnailUrl = data.thumbnailUrl;
    document.getElementById('thumbnail').src = thumbnailUrl;  // Display generated thumbnail
  });
}

// Submit the generated content and video to Firebase
function submitData() {
  const formData = new FormData();
  formData.append('file', videoFile);
  formData.append('title', title);
  formData.append('description', description);
  formData.append('thumbnail', thumbnailUrl);

  fetch('/submit-video', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    alert('Video uploaded and data saved to Firebase');
    localStorage.removeItem("videoFile");  // Clear localStorage
    window.location.href = "/";  // Redirect to the upload page
  })
  .catch(err => console.error('Error uploading video: ', err));
}
