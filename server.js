const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Serve static files from the current directory
app.use(express.static(__dirname));
app.use(express.json());

// Endpoint to save review
app.post('/save_review', (req, res) => {
    const newReview = req.body;
    const filePath = path.join(__dirname, 'reviews.json');

    fs.readFile(filePath, (err, data) => {
        if (err) throw err;

        let reviews = [];
        if (data.length) reviews = JSON.parse(data);

        reviews.push(newReview);

        fs.writeFile(filePath, JSON.stringify(reviews, null, 2), (err) => {
            if (err) throw err;
            res.json({ message: 'Review saved!' });
        });
    });
});

// Endpoint to get reviews
app.get('/get_reviews', (req, res) => {
    const filePath = path.join(__dirname, 'reviews.json');
    fs.readFile(filePath, (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
