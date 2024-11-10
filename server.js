const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000; // Use PORT environment variable or default to 3000

// S3 bucket details
const bucketName = 'nilaychowdhury'; 
const fileName = 'reviews.json'; // The name of the file in S3

// Configure CORS for the specified origin
app.use(cors({ origin: 'https://csc4110-group8.netlify.app/' }));

// Configure AWS SDK with hard-coded credentials
const s3 = new AWS.S3({
    accessKeyId: 'AKIA23WHT42ZWMFJTMGE',  
    secretAccessKey: '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',  
    region: 'us-east-2', 
});

app.use(express.static(__dirname));
app.use(express.json());

// Endpoint to save review to S3
app.post('/save_review', async (req, res) => {
    const newReview = req.body;
    console.log("Received review:", newReview); // Log incoming data

    try {
        // Fetch current reviews
        const data = await s3.getObject({ Bucket: bucketName, Key: fileName }).promise();
        let reviews = [];
        if (data.Body) reviews = JSON.parse(data.Body.toString());

        // Append new review
        reviews.push(newReview);

        // Log the updated reviews before saving
        console.log("Updated reviews:", reviews);

        // Save updated reviews to S3
        await s3.putObject({
            Bucket: bucketName,
            Key: fileName,
            Body: JSON.stringify(reviews, null, 2),
            ContentType: 'application/json'
        }).promise();

        res.json({ message: 'Review saved!' });
    } catch (error) {
        console.error("Error saving review:", error); // Detailed error log
        res.status(500).json({ message: 'Error saving review' });
    }
});

// Endpoint to get reviews from S3
app.get('/get_reviews', async (req, res) => {
    try {
        const data = await s3.getObject({ Bucket: bucketName, Key: fileName }).promise();
        const reviews = JSON.parse(data.Body.toString());
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving reviews' });
    }
});

// Start the server on the specified port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});