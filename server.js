const express = require('express');
const AWS = require('aws-sdk');
const app = express();
const bucketName = 'nilaychowdhury'; // Replace with your bucket name
const fileName = 'reviews.json'; // The name of the file in S3

/// Configure AWS SDK with hard-coded credentials
const s3 = new AWS.S3({
    accessKeyId: 'AKIA23WHT42ZWMFJTMGE',  // Replace with your AWS Access Key ID
    secretAccessKey: 'ZxQYlV+R/bBulNjm/xLeU9kcunmk0AOgpkJ2/lr4',  // Replace with your AWS Secret Access Key
    region: 'us-east-2', // Replace with your AWS region, e.g., 'us-west-2'
});

app.use(express.static(__dirname));
app.use(express.json());

// Endpoint to save review to S3
app.post('/save_review', async (req, res) => {
    const newReview = req.body;

    try {
        // Get the current reviews from S3
        const data = await s3.getObject({ Bucket: bucketName, Key: fileName }).promise();
        let reviews = [];
        if (data.Body) reviews = JSON.parse(data.Body.toString());

        // Add the new review
        reviews.push(newReview);

        // Upload the updated reviews to S3
        await s3.putObject({
            Bucket: bucketName,
            Key: fileName,
            Body: JSON.stringify(reviews, null, 2),
            ContentType: 'application/json'
        }).promise();

        res.json({ message: 'Review saved!' });
    } catch (error) {
        console.error(error);
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

app.listen(3000, () => {
    console.log('Server running on port 3000');
});