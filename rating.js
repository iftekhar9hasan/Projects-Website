const stars = document.querySelectorAll(".star");
const rating = document.getElementById("rating");
const reviewText = document.getElementById("review");
const submitBtn = document.getElementById("submit");
const reviewsContainer = document.getElementById("reviews");

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
    const review = reviewText.value.trim();
    const userRating = parseInt(rating.innerText);

    if (!userRating || !review) {
        alert("Please select a rating and provide a review before submitting.");
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
        alert(data.message || 'Review saved successfully!');
        displayThankYouMessage(userRating);
        displayReviews(); // Refresh the reviews after saving
    })
    .catch(error => {
        console.error('Error saving review:', error);
        alert('There was an error saving your review. Please try again.');
    });
});

function displayThankYouMessage(userRating) {
    const card = document.querySelector(".card");
    card.innerHTML = `
        <div class="thank-you-icon"></div>
        <p class="selected-stars">You selected ${userRating} out of 5</p>
        <h1 class="thank-you">Thank you!</h1>
        <p class="appreciation">We appreciate you taking the time to give a rating. If you ever need more support, don’t hesitate to get in touch!</p>
    `;
}

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
            alert('There was an error loading reviews. Please try again later.');
        });
}

// Call displayReviews on page load to load the reviews from S3
document.addEventListener('DOMContentLoaded', displayReviews);
