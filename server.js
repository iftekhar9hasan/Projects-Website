const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// AWS S3 configuration
const s3 = new AWS.S3({
    accessKeyId: 'AKIA23WHT42ZWMFJTMGE',  
    secretAccessKey: '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',  
    region: 'us-east-2', 
});

const bucketName = 'nilaychowdhury';
const fileName = 'reviews.json';

app.use(cors({ origin: 'https://csc4110-group8.netlify.app' }));
app.use(express.json());

// Endpoint to fetch reviews
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

// Endpoint to save a new review
app.post('/save_review', async (req, res) => {
    const newReview = req.body;

    try {
        const data = await s3.getObject({ Bucket: bucketName, Key: fileName }).promise();
        let reviews = [];
        if (data.Body) reviews = JSON.parse(data.Body.toString());

        reviews.push(newReview);

        await s3.putObject({
            Bucket: bucketName,
            Key: fileName,
            Body: JSON.stringify(reviews, null, 2),
            ContentType: 'application/json',
        }).promise();

        res.json({ message: 'Review saved!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving review' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
