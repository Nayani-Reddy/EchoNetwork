// Basic session/user check and logout
const user = JSON.parse(sessionStorage.getItem("currentUser"));
if (!user || user.role !== "volunteer") window.location.href = "login.html";
document.getElementById("logoutBtn").addEventListener("click", () => {
  sessionStorage.clear();
  window.location.href = "login.html";
});

// Populate static profile display on page load
document.getElementById("userName").textContent = user.name || "";
document.getElementById("userAadhaar").textContent = user.aadhaar || "";

// Render feedback from localStorage
function renderFeedback() {
  const feedbackList = JSON.parse(localStorage.getItem("donorFeedback")) || [];
  const container = document.getElementById("feedbackContainer");

  if (feedbackList.length === 0) {
    container.innerHTML = "<p>No feedback yet.</p>";
  } else {
    container.innerHTML = feedbackList.map(f => `
      <div class="feedback">
        <p><strong>${f.donor}</strong> (${f.date})</p>
        <p>⭐ Rating: ${f.rating || "No rating"}</p>
        <p>💬 Feedback: ${f.feedback || "No comments"}</p>
        ${f.fraud ? "<p style='color:red;'>⚠ Fraud Reported!</p>" : ""}
      </div><hr/>
    `).join("");
  }
}

// Render volunteer requests in both sections
function renderVolunteerRequests() {
  const requests = JSON.parse(localStorage.getItem("volunteerRequests")) || [];
  const allRequestsDiv = document.getElementById("allRequests");
  const tasksNearMeDiv = document.getElementById("tasksNearMe");

  if (requests.length === 0) {
    allRequestsDiv.innerHTML = "<p>No requests available.</p>";
    tasksNearMeDiv.innerHTML = "<p>No active tasks nearby</p>";
  } else {
    // All requests section
    allRequestsDiv.innerHTML = requests.map((req, index) => `
      <div class="request-card">
        <p><strong>${req.name}</strong> (${req.category})</p>
        <p>${req.description}</p>
        <p><small>${req.date}</small></p>
      </div>
    `).join("");

    // Tasks Near Me with Accept/Deny buttons
    tasksNearMeDiv.innerHTML = requests.map((req, index) => `
      <div class="request-card">
        <p><strong>${req.name}</strong> (${req.category})</p>
        <p>${req.description}</p>
        <p><small>${req.date}</small></p>
        <button onclick="handleTaskResponse(${index}, 'accept')">✅ Accept</button>
        <button onclick="handleTaskResponse(${index}, 'deny')">❌ Deny</button>
      </div>
    `).join("");
  }
}

// Handle Accept/Deny action
function handleTaskResponse(index, action) {
  let requests = JSON.parse(localStorage.getItem("volunteerRequests")) || [];
  let myTasks = JSON.parse(localStorage.getItem("myTasks")) || [];

  if (action === 'accept') {
    myTasks.push(requests[index]);
    localStorage.setItem("myTasks", JSON.stringify(myTasks));
    alert("Task accepted!");
  } else {
    alert("Task denied!");
  }

  // Remove the task from 'Tasks Near Me'
  requests.splice(index, 1);
  localStorage.setItem("volunteerRequests", JSON.stringify(requests));

  // Re-render both sections
  renderVolunteerRequests();
  renderMyTasks();
}

// Render tasks assigned to the volunteer
function renderMyTasks() {
  const myTasks = JSON.parse(localStorage.getItem("myTasks")) || [];
  const myTasksDiv = document.getElementById("myTasks");

  if (myTasks.length === 0) {
    myTasksDiv.innerHTML = "<p>No tasks yet</p>";
  } else {
    myTasksDiv.innerHTML = myTasks.map((task, index) => `
      <div class="request-card">
        <p><strong>${task.name}</strong> (${task.category})</p>
        <p>${task.description}</p>
        <p><small>${task.date}</small></p>
      </div>
    `).join("");
  }
}

// Initial rendering on page load
document.addEventListener("DOMContentLoaded", () => {
  renderVolunteerRequests();
  renderMyTasks();
  renderFeedback();
});
