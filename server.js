const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

let admin = null;
let firebaseInitialized = false;

ffmpeg.setFfmpegPath(ffmpegPath);

// Attempt to initialize Firebase
try {
  const serviceAccount = require('./serviceAccountKey.json');
  admin = require('firebase-admin');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://hackathon-9b458-default-rtdb.firebaseio.com'
  });

  firebaseInitialized = true;
  console.log('✅ Firebase Admin initialized');
} catch (error) {
  console.warn('⚠️ Firebase Admin initialization failed. Continuing without DB access.');
}

const app = express();
const port = process.env.PORT || 3000;

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// Serve static files from the 'public' folder
app.use(express.static('public'));
app.use(express.json());

// Route for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'LoginPage.html'));
});

// Video upload route
app.post('/upload-video', upload.single('video'), (req, res) => {
  const videoPath = req.file.path;
  const thumbnailPath = `thumbnails/${uuidv4()}.png`;

  ffmpeg(videoPath)
    .on('end', () => {
      console.log('🎞️ Thumbnail created');

      const videoData = {
        title: `Generated Title ${Math.floor(Math.random() * 1000)}`,
        description: `Generated description for ${req.file.originalname}`,
        thumbnail: thumbnailPath,
        uploadedAt: Date.now()
      };

      if (firebaseInitialized) {
        const db = admin.database();
        const videoRef = db.ref('videos').push();
        videoRef.set(videoData);
      } else {
        console.log('🚫 Skipping Firebase DB write - Firebase not initialized.');
      }

      res.json({ success: true, ...videoData });
    })
    .on('error', (err) => {
      console.error('❌ Error generating thumbnail:', err);
      res.status(500).send('Error processing video');
    })
    .screenshots({
      count: 1,
      folder: 'thumbnails',
      size: '320x240',
      filename: path.basename(thumbnailPath)
    });
});

// Blog idea upload route
app.post('/upload-blog-idea', upload.single('blogIdeaFile'), (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.file.filename);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).send('Error reading file');

    const title = generateTitle(data);
    const content = generateBlogContent(data);

    res.json({ title, content });
  });
});

// Helpers to generate title and blog content
function generateTitle(idea) {
  return `How to Master ${idea.slice(0, 20).trim()}...`;
}

function generateBlogContent(idea) {
  return `In this article, we will explore how to master ${idea.trim()}. This is an essential skill that can help you grow and succeed.`;
}

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
