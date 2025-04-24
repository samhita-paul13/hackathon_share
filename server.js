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
