// MediReminder – Add Reminder form + showing saved reminders on the Reminders page.
// Wrapped in a function so its names can't clash with anything in index.js.
(function () {
  const STORAGE_KEY = "medireminder.reminders";
  const EXAMPLE_NAME = "Morning tablet"; // fictional example name

  const form = document.getElementById("reminder-form");
  const nameInput = document.getElementById("reminder-name");
  const timeInput = document.getElementById("reminder-time");
  // Show "Choose a time" until the field is clicked, then switch to a real time picker
  timeInput.addEventListener("focus", () => {
    timeInput.type = "time";
  });

  timeInput.addEventListener("blur", () => {
    if (timeInput.value === "") timeInput.type = "text";
  });
  const nameError = document.getElementById("name-error");
  const timeError = document.getElementById("time-error");
  const cancelLink = document.getElementById("cancel-reminder");

  // Where the reminder cards go (same container as the demo cards)
  const reminderList = document.querySelector("#reminders .base_pages_setting");

  // ----- Storage (localStorage can be blocked, so use try/catch) -----
  function loadReminders() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved) ? saved : [];
    } catch (err) {
      return [];
    }
  }

  function storeReminders() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    } catch (err) {
      // still works until the page is closed, just not remembered
    }
  }

  let reminders = loadReminders();

  // ----- Show reminders on the Reminders page -----
  // "08:00" -> "8:00", to match the demo cards
  function displayTime(time) {
    const [hours, minutes] = time.split(":");
    return `${Number(hours)}:${minutes}`;
  }

  function createCard(reminder) {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.reminderId = reminder.id;

    const time = document.createElement("time");
    time.className = "time";
    time.dateTime = reminder.time;
    time.textContent = displayTime(reminder.time);

    const info = document.createElement("div");
    info.className = "info";
    const title = document.createElement("h2");
    title.textContent = reminder.name; // textContent, so typed text can't inject HTML
    const description = document.createElement("p");
    description.textContent = "Daily reminder";
    info.append(title, description);

    const due = document.createElement("div");
    due.className = "due";
    const status = document.createElement("span");
    status.className = "item status";
    status.textContent = "Active";
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "item mark-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${reminder.name}`);
    deleteButton.addEventListener("click", () => deleteReminder(reminder.id));
    due.append(status, deleteButton);

    card.append(time, info, due);
    return card;
  }

  function renderReminders() {
    // Remove cards drawn last time (the demo cards are left alone)
    reminderList
      .querySelectorAll("[data-reminder-id]")
      .forEach((card) => card.remove());

    // Earliest time first
    const sorted = [...reminders].sort((a, b) => a.time.localeCompare(b.time));
    sorted.forEach((reminder) => reminderList.append(createCard(reminder)));
  }

  function deleteReminder(id) {
    reminders = reminders.filter((reminder) => reminder.id !== id);
    storeReminders();
    renderReminders();
  }

  // ----- Form helpers -----
  function showError(input, errorEl, message) {
    errorEl.textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function clearForm() {
    form.reset();
    showError(nameInput, nameError, "");
    showError(timeInput, timeError, "");
    timeInput.type = "text";
  }

  // "Click here to use the example name"
  nameInput.addEventListener("click", () => {
    if (nameInput.value.trim() === "") {
      nameInput.value = EXAMPLE_NAME;
      nameInput.select(); // selected, so typing replaces it
      showError(nameInput, nameError, "");
    }
  });

  nameInput.addEventListener("input", () =>
    showError(nameInput, nameError, ""),
  );
  timeInput.addEventListener("input", () =>
    showError(timeInput, timeError, ""),
  );

  // ----- Save reminder -----
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    showError(nameInput, nameError, "");
    showError(timeInput, timeError, "");

    const name = nameInput.value.trim();
    const time = timeInput.value; // "HH:MM", or "" if no time chosen

    if (name === "") showError(nameInput, nameError, "Enter a reminder name.");
    if (time === "") showError(timeInput, timeError, "Choose a time.");

    if (name !== "" && time !== "") {
      const duplicate = reminders.some(
        (r) => r.name.toLowerCase() === name.toLowerCase() && r.time === time,
      );
      if (duplicate)
        showError(
          nameInput,
          nameError,
          "You already have this reminder at this time.",
        );
    }

    if (nameError.textContent || timeError.textContent) {
      (nameError.textContent ? nameInput : timeInput).focus();
      return;
    }

    reminders.push({
      id: Date.now().toString(),
      name: name,
      time: time,
      createdAt: new Date().toISOString(),
    });

    storeReminders();
    renderReminders();
    clearForm();

    // Go to the Reminders page so the new reminder is visible
    window.location.hash = "reminders";
  });

  // ----- Cancel: clear the form; the link itself goes back to #reminders -----
  cancelLink.addEventListener("click", clearForm);

  // Draw saved reminders when the page loads
  renderReminders();
})();
