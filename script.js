const API_URL = "https://habit-tracker-backend-37ra.onrender.com/api";

let currentUser = null;
document.getElementById("loginButton").addEventListener("click", async () => {
    const username = document.getElementById("usernameInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();
  
    if (!username || !password) {
      return alert("Please enter both username and password.");
    }
  
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      return alert(error.message || "Failed to log in.");
    }
  
    const user = await response.json();
    currentUser = user.username;
  
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("habitTrackerPage").style.display = "block";
  
    displayHabits();
  });
  


async function displayHabits() {
  const response = await fetch(`${API_URL}/habits/${currentUser}`);
  const habits = await response.json();

  const habitList = document.getElementById("todayHabits");
  habitList.innerHTML = "";

  habits.forEach(habit => {
    const habitItem = document.createElement("div");
    habitItem.className = `habit ${habit.completed ? "completed" : ""}`;
    habitItem.innerHTML = `
      <span>${habit.name} (Repetitions: ${habit.repetitions})</span>
      <button onclick="toggleComplete('${habit.name}', ${!habit.completed})">
        ${habit.completed ? "Undo" : "Complete"}
      </button>
    `;
    habitList.appendChild(habitItem);
  });
}

document.getElementById("addHabitButton").addEventListener("click", async () => {
  const habitName = document.getElementById("habitInput").value.trim();
  if (!habitName) return alert("Please enter a habit.");

  await fetch(`${API_URL}/habits/${currentUser}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: habitName }),
  });

  displayHabits();
});

async function toggleComplete(name, completed) {
  await fetch(`${API_URL}/habits/${currentUser}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, completed }),
  });

  displayHabits();
}

document.getElementById("logoutButton").addEventListener("click", () => {
  currentUser = null;
  document.getElementById("loginPage").style.display = "block";
  document.getElementById("habitTrackerPage").style.display = "none";
});
