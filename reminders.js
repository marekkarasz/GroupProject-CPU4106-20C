// MediReminder – Add Reminder form + showing saved reminders on the Reminders page.
// Wrapped in a function so its names can't clash with anything in index.js.
(function () {
  const STORAGE_KEY = "medireminder.reminders";
  const EXAMPLE_NAME = "Morning tablet"; // fictional example name

  const form = document.getElementById("reminder-form");
  const nameInput = document.getElementById("reminder-name");
  const timeInput = document.getElementById("reminder-time");

  const savedName = document.getElementById("saved-name");
  const savedTime = document.getElementById("saved-time");
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
  const reminderList = document.querySelector("#reminders #reminder-list");
  const scheduleList = document.getElementById("schedule-list"); //Grab the list of schedules

  //History card is right here Starting with a table body
  const historyBody = document.getElementById("history-body");

  // The Due / Upcoming / Taken counters at the top of the Schedule page
  const counters = {
    due: document.getElementById("due-count"),
    upcoming: document.getElementById("upcoming-count"),
    taken: document.getElementById("taken-count"),
  };

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
    renderAll();
  }
  // Fill the "Reminder saved" page with the reminder that was just saved
  function showSaved(reminder) {
    savedName.textContent = reminder.name; // textContent, so typed text can't inject HTML
    savedTime.textContent = displayTime(reminder.time);
  }
  // ---- Schedule page: work out each reminder's state for today --------
  // Adds a leading zero: 8 -> '08'
  function pad(number) {
    return String(number).padStart(2, "0");
  }

  // Today's local date as "yyyy-mm-dd"(not to ISOS string, which uses UTC)
  function todayKey() {
    const now = new Date();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  }
  function displayDate(dateKey) {
    const [year, month, day] = dateKey.split("-");
    return `${day}/${month}/${year.slice(2)}`;
  }
  // The current time as "hh:mm", the same format as reminder.time
  function nowTime() {
    const now = new Date();
    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  // 'Taken' if recorded today, 'due' if its time has passed, otherwise 'upcoming'
  function getStatus(reminder) {
    const takenDates = reminder.takenDates || []; // Older saved reminders have no list
    if (takenDates.includes(todayKey())) return "taken";
    if (reminder.time <= nowTime()) return "due";
    return "upcoming";
  }

  // What each status say on its badge
  const STATUS_LABELS = {
    due: "Due",
    upcoming: "Upcoming",
    taken: "Taken",
  };

  function createScheduleCard(reminder, status) {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.reminderId = reminder.id;
    card.dataset.status = status; // for styling each state for the css later

    const time = document.createElement("time");
    time.className = "time";
    time.dateTime = reminder.time;
    time.textContent = displayTime(reminder.time);

    const info = document.createElement("div");
    info.className = "info";
    const title = document.createElement("h2");
    title.textContent = reminder.name;
    const description = document.createElement("p");
    description.textContent = "Daily Reminder";
    info.append(title, description);

    const due = document.createElement("div");
    due.className = "due";
    const badge = document.createElement("span");
    badge.className = "item status";
    badge.textContent = STATUS_LABELS[status];
    due.append(badge);

    // Only a due reminder can be recorded as taken
    if (status === "due") {
      const markButton = document.createElement("button");
      markButton.type = "button";
      markButton.className = "item mark-button";
      markButton.textContent = "Mark as taken";
      markButton.setAttribute("aria-label", `Mark ${reminder.name} as taken`);
      // Click handler comes in step 5 (markTaken)
      due.append(markButton);
    }
    card.append(time, info, due);
    return card;
  }

  function renderSchedule() {
    // Remove cards drawn last time (the exapmle card is left alone)
    scheduleList
      .querySelectorAll("[data-reminder-id]")
      .forEach((card) => card.remove());

    //Earliest time first
    const sorted = [...reminders].sort((a, b) => a.time.localeCompare(b.time));
    sorted.forEach((reminder) =>
      scheduleList.append(createScheduleCard(reminder, getStatus(reminder))),
    );

    updateCounters();
  }

  // Count the schedule cards by status and show the numbers in the counters.
  // No reminders yet: count the demo card(s), so the counters match the example.
  function updateCounters() {
    const selector = reminders.length > 0 ? "[data-reminder-id]" : "[data-demo]";
    const cards = scheduleList.querySelectorAll(selector);

    const totals = { due: 0, upcoming: 0, taken: 0 };
    cards.forEach((card) => {
      // each card carries its status in data-status ("due", "upcoming" or "taken")
      if (card.dataset.status in totals) totals[card.dataset.status]++;
    });

    Object.keys(counters).forEach((status) => {
      counters[status].textContent = totals[status];
    });
  }
  // ----- History page: table of reminders -----
  // Builds one <tr> with four <td> cells
  function createHistoryRow(reminder, status) {
    const row = document.createElement("tr");
    row.dataset.reminderId = reminder.id;

    const cells = [
      reminder.name,
      displayTime(reminder.time),
      "Not Recorded", // the taken time isnt saved yet, comes with markTaken
      STATUS_LABELS[status],
    ];
    cells.forEach((text) => {
      const cell = document.createElement("td");
      cell.textContent = text; // textcontent, so typed text cant inject html
      row.append(cell);
    });
    return row;
  }
  function renderHistory() {
    // Remove rows drawn last time (the demo rows are left alone, updateDemos hides them)
    historyBody
      .querySelectorAll("[data-reminder-id]")
      .forEach((row) => row.remove());

    //earliest time first
    const sorted = [...reminders].sort((a, b) => a.time.localeCompare(b.time));
    sorted.forEach((reminder) =>
      historyBody.append(createHistoryRow(reminder, getStatus(reminder))),
    );
  }

  // ----- Demo examples: shown only while the user has no reminders -----
  // Every example in the HTML is tagged with data-demo. One rule for all panels:
  // no reminders -> show the examples, at least one reminder -> hide them.
  // Uses the .hidden class from style.css (the hidden attribute would lose to .card's display: grid)
  function updateDemos() {
    const hasReminders = reminders.length > 0;
    document
      .querySelectorAll("[data-demo]")
      .forEach((demo) => demo.classList.toggle("hidden", hasReminders));
  }

  // Redraw every panel that shows reminders. Call this after any change to `reminders`,
  // so a new panel only needs adding here.
  function renderAll() {
    renderReminders();
    renderSchedule();
    renderHistory();
    updateDemos();
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

    const newReminder = {
      id: Date.now().toString(),
      name: name,
      time: time,
      createdAt: new Date().toISOString(),
      takenDates: [], // days this reminder was recorded as taken, yyyy-mm-dd
    };

    reminders.push(newReminder);
    storeReminders();
    renderAll();
    showSaved(newReminder);
    clearForm();

    // Go to the 'Reminder saved' page
    window.location.hash = "reminder-saved";
  });

  // ----- Cancel: clear the form; the link itself goes back to #reminders -----
  cancelLink.addEventListener("click", clearForm);

  // Draw saved reminders (or the demo examples) when the page loads
  renderAll();
})();
