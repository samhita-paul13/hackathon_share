function triggerUploadDoc() {
  const docFile = document.getElementById("docInput").files[0];

  if (!docFile) {
    alert('Please select a blog document!');
  }
  // else {
  //  localStorage.setItem("docFile", JSON.stringify(docFile));
  //  window.location.href = 'blogUpload.html';
  // }
}

function triggerUploadVideo() {
  const videoFile = document.getElementById("videoInput").files[0];

  if (!videoFile) {
    alert('Please select a video file!');
  } else {
    // Store the video file object
    localStorage.setItem('videoFile', JSON.stringify(videoFile));
    window.location.href = 'videoUpload.html';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Attempt to get the video upload button
  const videoButton = document.getElementById("videoUploadButton");
  if (videoButton) {
    videoButton.addEventListener("click", triggerUploadVideo);
  } else {
    console.log("Video upload button not found on this page.");
  }

  // Attempt to get the blog upload button
  const blogButton = document.getElementById("blogUploadButton");
  if (blogButton) {
    // It's better to use an event listener here as well
    // blogButton.addEventListener("click", triggerUploadDoc);
  } else {
    console.log("Blog upload button not found on this page.");
  }

  // Function to handle file upload and fetch generated title & content
  function uploadBlogIdea() {
    const fileInput = document.getElementById('docInput');
    const file = fileInput.files[0];

    if (!file) {
      alert('Please select a blog idea file!');
      return;
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
  }

  // Attach the uploadBlogIdea function to the onclick event of your button (in blogUpload.html)
  const uploadButton = document.querySelector('.add');
  if (uploadButton) {
    uploadButton.onclick = uploadBlogIdea;
  }

  // Submit blog data to Firebase (in blogUpload.html)
  const submitButton = document.getElementById('submitButton');
  if (submitButton) {
    submitButton.onclick = function submitData() {
      const title = document.getElementById('blogTitle').value;
      const content = document.getElementById('blogContent').value;
      const db = firebase.database();

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
    };
  }
});

// Helper functions (now likely only used server-side)
