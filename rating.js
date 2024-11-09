const stars = document.querySelectorAll(".star");
const rating = document.getElementById("rating");
const reviewText = document.getElementById("review");
const submitBtn = document.getElementById("submit");
const reviewsContainer = document.getElementById("reviews");

// Function to show styled notifications
function showNotification(message, type = 'success') {
    const notification = document.getElementById("feedbackMessage");
    notification.innerText = message;

    // Clear previous classes and add "show" class
    notification.classList.remove("hidden", "error", "warning", "success");
    notification.classList.add("show");

    // Add type-specific class
    if (type === 'error') {
        notification.classList.add("error");
    } else if (type === 'warning') {
        notification.classList.add("warning");
    } else {
        notification.classList.add("success");
    }
}

stars.forEach((star) => {
    star.addEventListener("click", () => {
        const value = parseInt(star.getAttribute("data-value"));
        rating.innerText = value;

        // Remove all existing classes from stars
        stars.forEach((s) => s.classList.remove("one", "two", "three", "four", "five"));

        // Add the appropriate class to each star based on the selected star's value
        stars.forEach((s, index) => {
            if (index < value) {
                s.classList.add(getStarColorClass(value));
            }
        });

        // Remove "selected" class from all stars
        stars.forEach((s) => s.classList.remove("selected"));
        // Add "selected" class to the clicked star
        star.classList.add("selected");
    });
});

submitBtn.addEventListener("click", () => {
    const review = reviewText.value;
    const userRating = parseInt(rating.innerText);

    if (!userRating || !review) {
        showNotification("Please select a rating and provide a review before submitting.", 'warning');
        return;
    }

    const reviewData = {
        rating: userRating,
        review: review
    };

    // Send review data to the backend to save in S3
    fetch('https://projects-website-review.onrender.com/save_review', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        showNotification(data.message || 'Review saved successfully!');

        // document.getElementById("review").classList.add("hidden-after-submit");
        // document.getElementById("stars").classList.add("hidden-after-submit");
        // document.getElementById("submit").classList.add("hidden-after-submit");
        // document.getElementById("share").classList.add("hidden-after-submit");

        displayReviews(); // Refresh the reviews after saving
    })
    .catch(error => {
        console.error('Error saving review:', error);
        showNotification('There was an error saving your review. Please try again.', 'error');
    });
});

function getStarColorClass(value) {
    switch (value) {
        case 1:
            return "one";
        case 2:
            return "two";
        case 3:
            return "three";
        case 4:
            return "four";
        case 5:
            return "five";
        default:
            return "";
    }
}

function displayReviews() {
    // Fetch reviews from the backend, which retrieves them from S3
    fetch('https://projects-website-review.onrender.com/get_reviews')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(reviews => {
            reviewsContainer.innerHTML = ''; // Clear current reviews
            reviews.forEach(review => {
                const reviewElement = document.createElement("div");
                reviewElement.classList.add("review");
                reviewElement.innerHTML = `<p><strong>Rating: ${review.rating}/5</strong></p><p>${review.review}</p>`;
                reviewsContainer.appendChild(reviewElement);
            });
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
            showNotification('There was an error loading reviews. Please try again later.', 'error');
        });
}

// Call displayReviews on page load to load the reviews from S3
document.addEventListener('DOMContentLoaded', displayReviews);
