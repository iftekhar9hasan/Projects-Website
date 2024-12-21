const stars = document.querySelectorAll(".star");
const rating = document.getElementById("rating");
const reviewText = document.getElementById("review");
const submitBtn = document.getElementById("submit");
const reviewsContainer = document.getElementById("reviews");

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = message;

    document.body.appendChild(notification);
    notification.getBoundingClientRect();

    notification.style.opacity = '1'; 

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✖';
    closeButton.className = 'notification-close';
    notification.appendChild(closeButton);

    closeButton.addEventListener('click', () => {
        notification.style.opacity = '0'; 
        setTimeout(() => {
            notification.remove();
        }, 1000); 
    });
}



stars.forEach((star) => {
    star.addEventListener("click", () => {
        const value = parseInt(star.getAttribute("data-value"));
        rating.innerText = value;
        stars.forEach((s) => s.classList.remove("one", "two", "three", "four", "five"));
        stars.forEach((s, index) => {
            if (index < value) {
                s.classList.add(getStarColorClass(value));
            }
        });

        stars.forEach((s) => s.classList.remove("selected"));
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

    fetch('https://csc4110-group8.vercel.app/save_review', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
    })
    .then(response => {
        console.log("Response status:", response.status);
        console.log("Response status text:", response.statusText);
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        console.log("Data received:", data);
        showNotification(data.message || 'Review saved successfully!');
        
        document.getElementById("review").classList.add("hidden-after-submit");
        document.getElementById("stars").classList.add("hidden-after-submit");
        document.getElementById("submit").classList.add("hidden-after-submit");
        
        displayReviews(); 
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
    fetch('https://csc4110-group8.vercel.app/get_reviews')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(reviews => {
            reviewsContainer.innerHTML = ''; 
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

document.addEventListener('DOMContentLoaded', displayReviews);
