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
        stars.forEach((s) => s.classList.remove("one", 
                                                "two", 
                                                "three", 
                                                "four", 
                                                "five"));

        // Add the appropriate class to 
        // each star based on the selected star's value
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

// submitBtn.addEventListener("click", () => {
//     const review = reviewText.value;
//     const userRating = parseInt(rating.innerText);

//     if (!userRating || !review) {
//         alert(
// "Please select a rating and provide a review before submitting."
//             );
//         return;
//     }

//     if (userRating > 0) {
//         const reviewElement = document.createElement("div");
//         reviewElement.classList.add("review");
//         reviewElement.innerHTML = 
// `<p><strong>Rating: ${userRating}/5</strong></p><p>${review}</p>`;
//         reviewsContainer.appendChild(reviewElement);

//         // Reset styles after submitting
//         reviewText.value = "";
//         rating.innerText = "0";
//         stars.forEach((s) => s.classList.remove("one", 
//                                                 "two", 
//                                                 "three", 
//                                                 "four", 
//                                                 "five", 
//                                                 "selected"));
//     }
// });

submitBtn.addEventListener("click", () => {
    const review = reviewText.value;
    const userRating = parseInt(rating.innerText);

    if (!userRating || !review) {
        alert("Please select a rating and provide a review before submitting.");
        return;
    }

    const reviewData = {
        rating: userRating,
        review: review
    };

    fetch('http://localhost:3000/save_review', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Review saved successfully!');
        displayReviews();
    })
    .catch(error => console.error('Error:', error));
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
    fetch('http://localhost:3000/get_reviews')
        .then(response => response.json())
        .then(reviews => {
            reviewsContainer.innerHTML = ''; // Clear current reviews
            reviews.forEach(review => {
                const reviewElement = document.createElement("div");
                reviewElement.classList.add("review");
                reviewElement.innerHTML = `<p><strong>Rating: ${review.rating}/5</strong></p><p>${review.review}</p>`;
                reviewsContainer.appendChild(reviewElement);
            });
        })
        .catch(error => console.error('Error fetching reviews:', error));
}

// Call displayReviews on page load
document.addEventListener('DOMContentLoaded', displayReviews);
