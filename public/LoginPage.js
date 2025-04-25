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



let videoThumbnail = "";
let videoTitle = "";
let videoDescription = "";

function generateThumbnail() {
  // Simulated thumbnail URL
  videoThumbnail = 'https://via.placeholder.com/400x200.png?text=Thumbnail';
  const imgElement = document.querySelector("div div img");
  imgElement.src = videoThumbnail;
  imgElement.style.width = "400px";
  imgElement.style.height = "200px";
}

function generateTitle() {
  // Simulated title generation
  const titles = [
     "Top 10 Minecraft Mods"
    ,"Best Mods in Minecraft."
  ];
  videoTitle = titles[Math.floor(Math.random() * titles.length)];
  let titleDiv = document.getElementById("title");
  if (!titleDiv) {
    titleDiv = document.createElement("div");
    titleDiv.id = "title";
    document.body.appendChild(titleDiv);
  }
  titleDiv.textContent = `Title: ${videoTitle}`;
}

function generateDescription() {
  // Simulated description generation
  const descriptions = [
   "This is the best mod in minecraft."
  , "Mincraft mods are the best."
  ];
  videoDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
  let descDiv = document.getElementById("description");
  if (!descDiv) {
    descDiv = document.createElement("div");
    descDiv.id = "description";
    document.body.appendChild(descDiv);
  }
  descDiv.textContent = `Description: ${videoDescription}`;
}

function submitData() {
  if (!videoThumbnail || !videoTitle || !videoDescription) {
    alert("Please generate all fields before submitting.");
    return;
  }

  const newVideoRef = db.ref("videos").push();
  newVideoRef.set({
    thumbnail: videoThumbnail,
    title: videoTitle,
    description: videoDescription,
    timestamp: Date.now()
  });

  alert("Data submitted successfully!");
}
const formData = new FormData();
formData.append('blogIdeaFile', file);

// Make the API call to upload the blog idea file and fetch generated title & content
fetch('/upload-blog-idea', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => {
    // Populate title and content
    document.getElementById('blogTitle').value = data.title;
    document.getElementById('blogContent').value = data.content;
})
.catch(error => {
    console.error('Error:', error);
});


// Function to generate blog content from the uploaded Word document
function Generateblog() {
const fileInput = document.getElementById('blogIdeaFile');
const file = fileInput.files[0];

if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const arrayBuffer = event.target.result;

        mammoth.extractRawText({ arrayBuffer: arrayBuffer })
            .then(function(result) {
                const text = result.value;

                // Generate the blog content from the extracted text
                const blogTitle = generateTitle(text);
                const blogContent = generateContent(text);

                // Update the blog title and content on the page
                document.getElementById('blogContent').value = blogContent;
                document.getElementById('blogTitle').value = blogTitle;
            })
            .catch(function(err) {
                console.error('Error parsing document:', err);
            });
    };
    reader.readAsArrayBuffer(file);
}
}

// Helper functions to generate title and content
function generateTitle(text) {
// Example: Take the first 20 words from the document and generate the title
const words = text.split(/\s+/);
const title = words.slice(0, 20).join(' ') + '...';
return title;
}

function generateContent(text) {
// Example: Take the first paragraph as the blog content
const firstParagraph = text.split('\n')[0];
return firstParagraph;
}

// Submit blog data to Firebase
function submitData() {
const title = document.getElementById('blogTitle').value;
const content = document.getElementById('blogContent').value;

if (!title || !content) {
    alert("Please generate both the title and content before submitting.");
    return;
}

const newBlogRef = db.ref("blogs").push();
newBlogRef.set({
    title: title,
    content: content,
    timestamp: Date.now()
});

alert("Blog submitted successfully!");
}
