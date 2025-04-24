const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');  // For image fetching from the alternative API

const app = express();
const port = 3000;

// Use multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(express.json());

// Route for video title generation
app.post('/generate-title', upload.single('file'), async (req, res) => {
    const videoFile = req.file;

    // Send the video file to OpenAI for analysis to generate a title
    const title = await generateTitle(videoFile); // Implement the logic to generate a title using OpenAI
    res.json({ title });
});

// Route for video description generation
app.post('/generate-description', upload.single('file'), async (req, res) => {
    const videoFile = req.file;

    // Send the video file to OpenAI for analysis to generate a description
    const description = await generateDescription(videoFile); // Implement the logic to generate a description using OpenAI
    res.json({ description });
});

// Route for video thumbnail generation (using external image API)
app.post('/generate-thumbnail', upload.single('file'), async (req, res) => {
    const videoFile = req.file;

    // Fetch image related to the video using your chosen API (substitute this with the correct API logic)
    const thumbnailUrl = await generateThumbnail(videoFile); // Image API request
    res.json({ thumbnailUrl });
});

// Route for saving video data (this will only store references, no file)
app.post('/submit-video', upload.single('file'), async (req, res) => {
    const videoFile = req.file;
    const title = req.body.title;
    const description = req.body.description;
    const thumbnail = req.body.thumbnail;

    // Save the data to Firebase Realtime Database
    const videoData = {
        title,
        description,
        thumbnail,
    };

    // Add to Firebase (Firebase setup omitted)
    const videoRef = await firebase.database().ref('videos').push(videoData);
    res.json({ message: 'Video uploaded and data saved to Firebase' });
});

// Helper function to generate title from video (OpenAI API interaction)
async function generateTitle(videoFile) {
    // Interact with OpenAI API here
    return "Generated Title for Video";
}

// Helper function to generate description from video (OpenAI API interaction)
async function generateDescription(videoFile) {
    // Interact with OpenAI API here
    return "Generated description for video based on analysis.";
}

// Helper function to fetch thumbnail from the external API
async function generateThumbnail(videoFile) {
    const imageAPIUrl = 'https://api.pexels.com/v1/search?query=gaming&per_page=1';  // Replace with actual image API
    try {
        const response = await axios.get(imageAPIUrl);
        return response.data.thumbnailUrl;
    } catch (error) {
        console.error("Error fetching thumbnail: ", error);
        return ''; // Return empty if there's an error
    }
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
