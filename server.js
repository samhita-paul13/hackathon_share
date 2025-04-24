const express = require('express');
const multer = require('multer');
const fluent_ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth');
const app = express();
const port = process.env.PORT || 3000;

// Set up static file serving
app.use(express.static('public'));

// Set up multer for file uploads
const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/videos');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
    },
});

const docStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/blogs');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
    },
});

const videoUpload = multer({ storage: videoStorage });
const docUpload = multer({ storage: docStorage });

// Endpoint for uploading videos
app.post('/upload-video', videoUpload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No video file uploaded' });
    }

    // Generate video thumbnail using FFmpeg
    const videoPath = path.join(__dirname, 'uploads', 'videos', req.file.filename);
    const thumbnailPath = path.join(__dirname, 'uploads', 'thumbnails', req.file.filename + '.jpg');
    
    fluent_ffmpeg(videoPath)
        .on('end', () => {
            console.log('Thumbnail generated');
            res.status(200).json({ message: 'Video uploaded successfully', thumbnail: thumbnailPath });
        })
        .on('error', (err) => {
            console.error('Error generating thumbnail:', err);
            res.status(500).json({ message: 'Error generating thumbnail' });
        })
        .screenshots({
            timestamps: ['00:00:01.000'],  // Take a snapshot at 1 second
            filename: path.basename(thumbnailPath),
            folder: path.dirname(thumbnailPath),
            size: '320x240', // Resize the thumbnail if needed
        });
});

// Endpoint for uploading blog documents
app.post('/upload-blog', docUpload.single('doc'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No document file uploaded' });
    }

    const docPath = path.join(__dirname, 'uploads', 'blogs', req.file.filename);
    
    // If it's a .docx file
    if (path.extname(docPath) === '.docx') {
        mammoth.extractRawText({ path: docPath })
            .then((result) => {
                const textContent = result.value;
                const blogTitle = `How to Generate a Blog from Your Document: ${req.file.filename}`;
                const blogIntro = `This blog explores how to generate a meaningful article from your document titled: ${req.file.filename}. Here's the content extracted from it:`;

                // Apply a simple blog template
                const generatedBlog = `
                    <h1>${blogTitle}</h1>
                    <p>${blogIntro}</p>
                    <p>${textContent}</p>
                `;

                res.status(200).json({ message: 'Blog uploaded and content generated', blog: generatedBlog });
            })
            .catch((error) => {
                console.error('Error reading the document:', error);
                res.status(500).json({ message: 'Error processing document' });
            });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
