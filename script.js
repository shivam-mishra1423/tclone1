// DOM Elements
const authSection = document.getElementById("auth-section");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const dashboardSection = document.getElementById("dashboard-section");
const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");
const signupUsername = document.getElementById("signup-username");
const signupPassword = document.getElementById("signup-password");
const profilePhoto = document.getElementById("profile-photo");
const profilePicture = document.getElementById("profile-picture");
const welcomeMessage = document.getElementById("welcome-message");
const tweetInput = document.getElementById("tweet-input");
const tweetImage = document.getElementById("tweet-image");
const tweetsFeed = document.getElementById("tweets-feed");
const followList = document.getElementById("follow-list");
const authMessage = document.getElementById("auth-message");
const deleteAccountButton = document.getElementById("delete-account");
const logoutButton = document.getElementById("logout");

// User Database Simulation
let users = JSON.parse(localStorage.getItem("users")) || {};
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Toggle Login/Signup
document.getElementById("show-signup").addEventListener("click", () => {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
});

document.getElementById("show-login").addEventListener("click", () => {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
});

// Signup
document.getElementById("signup-btn").addEventListener("click", () => {
    const username = signupUsername.value.trim();
    const password = signupPassword.value.trim();
    const photoFile = profilePhoto.files[0];

    if (users[username]) {
        authMessage.textContent = "Username already exists!";
        authMessage.style.color = "red";
    } else {
        const reader = new FileReader();
        reader.onload = () => {
            users[username] = { password, photo: reader.result, tweets: [], followers: [] };
            localStorage.setItem("users", JSON.stringify(users));
            authMessage.textContent = "Account created successfully!";
            authMessage.style.color = "green";
            document.getElementById("show-login").click();
        };
        reader.readAsDataURL(photoFile);
    }
});

// Login
document.getElementById("login-btn").addEventListener("click", () => {
    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    if (users[username] && users[username].password === password) {
        currentUser = username;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        showDashboard();
    } else {
        authMessage.textContent = "Invalid username or password!";
        authMessage.style.color = "red";
    }
});

// Show Dashboard
function showDashboard() {
    authSection.style.display = "none";
    dashboardSection.style.display = "block";
    profilePicture.src = users[currentUser].photo;
    welcomeMessage.textContent = `Hello, ${currentUser}!`;
    loadTweets();
    loadFollowList();
}

// Load Follow List
function loadFollowList() {
    followList.innerHTML = "";
    Object.keys(users).forEach((user) => {
        if (user !== currentUser) {
            const isFollowing = users[currentUser].followers.includes(user);
            const buttonText = isFollowing ? "Unfollow" : "Follow";
            const button = `<button onclick="toggleFollow('${user}')">${buttonText}</button>`;
            followList.innerHTML += `<div>${user} ${button}</div>`;
        }
    });
}

// Toggle Follow
function toggleFollow(user) {
    const followers = users[currentUser].followers;
    if (followers.includes(user)) {
        users[currentUser].followers = followers.filter((f) => f !== user);
    } else {
        followers.push(user);
    }
    localStorage.setItem("users", JSON.stringify(users));
    loadFollowList();
}

// Post Tweet
document.getElementById("post-tweet").addEventListener("click", () => {
    const tweetContent = tweetInput.value.trim();
    const imageFile = tweetImage.files[0];
    const tweet = { content: tweetContent, image: null };

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = () => {
            tweet.image = reader.result;
            saveTweet(tweet);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveTweet(tweet);
    }
});

function saveTweet(tweet) {
    users[currentUser].tweets.unshift(tweet);
    localStorage.setItem("users", JSON.stringify(users));
    loadTweets();
}

// Load Tweets
function loadTweets() {
    tweetsFeed.innerHTML = "";
    users[currentUser].tweets.forEach((tweet) => {
                const tweetElement = document.createElement("div");
                tweetElement.classList.add("tweet");
                tweetElement.innerHTML = `
      <div>${tweet.content}</div>
      ${tweet.image ? `<img src="${tweet.image}" alt="Tweet Image" />` : ""}
    `;
    tweetsFeed.appendChild(tweetElement);
  });
}

// Delete Account
deleteAccountButton.addEventListener("click", () => {
  delete users[currentUser];
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.removeItem("currentUser");
  location.reload();
});

// Logout
logoutButton.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  location.reload();
});

// Auto-login
if (currentUser) showDashboard();