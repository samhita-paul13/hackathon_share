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
const serviceAccount = require('./serviceAccountKey.json'); // Your Firebase service account key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://hackathon-9b458-default-rtdb.firebaseio.com'
});

const db = admin.database();

const app = express();
const upload = multer({ dest: 'uploads/' });

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

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
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

const upload = multer({ storage: storage });

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

