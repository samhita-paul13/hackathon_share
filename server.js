// This assumes you have ffmpeg-static and fluent-ffmpeg installed, and configured to work with multer
// This is server-side (Node.js) code for processing the video and extracting a thumbnail

const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

ffmpeg.setFfmpegPath(ffmpegPath);

// Firebase setup
const serviceAccount = require('/workspaces/hackathon_share/hackathon-9b458-firebase-adminsdk-fbsvc-31f0953de2.json'); // Your Firebase service account key
const { publicDecrypt } = require('crypto');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://hackathon-9b458-default-rtdb.firebaseio.com'
});

const db = admin.database();

const app = express();
let upload = multer({ dest: 'uploads/' });


// Serve static files from the 'public' folder
app.use(express.static('public'));

// Route for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'public', 'LoginPage.html')); // change to your actual login file name
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

app.use(express.static('public'));

app.post('/upload-video', upload.single('video'), (req, res) => {
  const videoPath = req.file.path;
  const thumbnailPath = `thumbnails/${uuidv4()}.png`;

  // Generate thumbnail
  ffmpeg(videoPath)
    .on('end', () => {
      console.log('Thumbnail created');

      // Store metadata in Firebase
      const videoRef = db.ref('videos').push();
      videoRef.set({
        title: `Generated Title ${Math.floor(Math.random() * 1000)}`,
        description: `Generated description for ${req.file.originalname}`,
        thumbnail: thumbnailPath,
        uploadedAt: Date.now()
      });

      res.json({
        success: true,
        title: `Generated Title ${Math.floor(Math.random() * 1000)}`,
        description: `Generated description for ${req.file.originalname}`,
        thumbnail: thumbnailPath
      });
    })
    .on('error', (err) => {
      console.error('Error generating thumbnail:', err);
      res.status(500).send('Error processing video');
    })
    .screenshots({
      count: 1,
      folder: 'thumbnails',
      size: '320x240',
      filename: path.basename(thumbnailPath)
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const port = 3000;

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

 upload = multer({ storage: storage });

// Middleware to serve static files (for HTML, CSS, JS)
app.use(express.static('public'));
app.use(express.json());

// Endpoint to upload blog idea file
app.post('/upload-blog-idea', upload.single('blogIdeaFile'), (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.file.filename);

  // Read file content
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading file');
    }

    // Generate title and blog content based on the file data
    const title = generateTitle(data);  // Generate a title based on the blog idea
    const content = generateBlogContent(data);  // Generate content based on the blog idea

    // Send the generated title and content back to the frontend
    res.json({ title, content });
  });
});

// Function to generate a title from the blog idea content
function generateTitle(idea) {
  return `How to Master ${idea.slice(0, 20)}...`;  // Example title generation logic
}

// Function to generate blog content from the blog idea
function generateBlogContent(idea) {
  return `In this article, we will explore how to master ${idea}. This is an essential skill that can help you ...`;  // Example content generation logic
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

