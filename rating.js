const card = document.querySelector(".card");
const numbers = document.querySelector(".numbers");
const submitBtn = document.getElementById("submit");
const reviewsContainer = document.getElementById("reviews");
const feedbackMessage = document.getElementById("feedbackMessage");

const dots = document.querySelectorAll(".dot");
let selectedRating = 0;

// Add event listener to each rating dot
dots.forEach((dot) => {
  dot.addEventListener("click", function () {
    // Clear previous selections
    dots.forEach((dot) => dot.classList.remove("selected"));
    this.classList.add("selected");

    // Update selected rating and styles for selected dot
    selectedRating = parseInt(this.textContent);
    dots.forEach(dot => {
      if(dot.classList.contains('selected')) {
        dot.style.backgroundColor = 'var(--Light-Grey)';
        dot.style.color = 'white';
      } else {
        dot.style.backgroundColor = 'hsl(213, 10%, 21%)';
        dot.style.color = 'var(--Light-Grey)';
      }
    });
  });
});

submitBtn.addEventListener("click", () => {
    const review = document.getElementById("review").value.trim();

    // Clear any existing feedback message
    feedbackMessage.className = "hidden";
    feedbackMessage.innerText = "";

    // Validation
    if (!selectedRating || !review) {
        showFeedbackMessage("Please select a rating and provide a review before submitting.", "error");
        return;
    }

    const reviewData = {
        rating: selectedRating,
        review: review
    };

    // Send review data to the backend to save in S3 or `reviews.json`
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
        showFeedbackMessage(data.message || 'Review saved successfully!', "success");
        displayReviews();  // Refresh the reviews after saving
        displayThankYouMessage(selectedRating);  // Display the thank-you message
    })
    .catch(error => {
        console.error('Error saving review:', error);
        showFeedbackMessage('There was an error saving your review. Please try again.', "error");
    });
});

// Display a thank-you message
function displayThankYouMessage(rating) {
    card.innerHTML = `
        <div class="thank-you-icon"></div>
        <p class="selected-stars">You selected ${rating} out of 5</p>
        <h1 class="thank-you">Thank you!</h1>
        <p class="appreciation">We appreciate you taking the time to give a rating. If you ever need more support, don’t hesitate to get in touch!</p>
    `;
}

// Fetch and display reviews from the backend
function displayReviews() {
    fetch('https://projects-website-review.onrender.com/get_reviews')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(reviews => {
            reviewsContainer.innerHTML = '';  // Clear current reviews
            reviews.forEach(review => {
                const reviewElement = document.createElement("div");
                reviewElement.classList.add("review");
                reviewElement.innerHTML = `<p><strong>Rating: ${review.rating}/5</strong></p><p>${review.review}</p>`;
                reviewsContainer.appendChild(reviewElement);
            });
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
            showFeedbackMessage('There was an error loading reviews. Please try again later.', "error");
        });
}

// Call displayReviews on page load to load the reviews from S3 or `reviews.json`
document.addEventListener('DOMContentLoaded', displayReviews);

// Display feedback message for validation or success
function showFeedbackMessage(message, type) {
    feedbackMessage.classList.remove("hidden");
    feedbackMessage.classList.add(type === "error" ? "feedback-error" : "feedback-success");
    feedbackMessage.innerText = message;
}
