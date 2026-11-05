MediReminder: How the Code Works
A plain-English guide to the MediReminder app, from the HTML to the JavaScript.
Written by Marek Karasz for the CPU4106 group, November 2026.
Repository: https://github.com/marekkarasz/GroupProject-CPU4106-20C
You don't need to be a programmer to follow this. Read it with the code open next to it. Every file and name in this style can be found with Find (Cmd+F or Ctrl+F) in the code.
1. The big picture
MediReminder is a website that runs entirely in the browser. There is no server and no database. It is made of four files:
	•	index.html: what is on the page. All five pages live in this one file.
	•	style.css: how it looks. Colours, layout, buttons and the phone and tablet layout.
	•	index.js: moving around. Switching pages, the phone menu, and the Login and Register forms.
	•	reminders.js: the reminder logic. Adding, saving, showing, marking as taken and History.
The assets folder holds the illustrations (Streamline Milano) and the user icon.
How to run it
	•	Easiest: download the repository and double-click index.html. It opens in your browser.
	•	Or open the folder in VS Code and use the Live Server extension.
	•	Reminders are saved in your own browser only. A different browser or computer starts empty. Clearing your browser data deletes them.
The one idea to understand first: one page, five "pages"
The app looks like it has five pages: Home, Schedule, Reminders, History and Help. In fact they are all sections inside index.html, and only one is shown at a time. The address bar decides which one:
index.html#home       → shows the Home section
index.html#schedule   → shows the Schedule section
index.html#reminders  → shows the Reminders section
The part after # is called the hash. Clicking a menu link changes the hash, and JavaScript shows the matching section. The browser never loads a new page, so switching is instant and the sidebar, styles and scripts are only downloaded once.
2. The HTML (index.html)
The file has two main parts that sit side by side: the sidebar on the left and the main area on the right.
2.1 The sidebar: <header class="sidebar">
	•	Hamburger button (.menu-toggle) and account button (.user-toggle). Only visible on tablets and phones.
	•	User panel (#user-panel): the user picture and name, plus the Login and Register buttons and their forms (#login-form, #register-form). These are for demonstration only. They open and close, but they don't create real accounts.
	•	Navigation (.sidebar-navigation): the five links. Each one points to a hash, for example <a href="#schedule">.
2.2 The pages: <main>
Each page is a <section class="page"> with an id. The id is the hash name used in the links:
	•	#home: welcome text, the Add reminder and View Today buttons, and "How it works".
	•	#schedule: today's reminders with their status (Upcoming, Due or Taken), the three counters at the top, and the Mark as taken button.
	•	#reminders: the list of all saved reminders, each with a Delete button.
	•	#add-reminder: the form (reminder name and daily time). It isn't in the menu; you reach it from the Add reminder buttons.
	•	#reminder-saved: the confirmation page shown after saving.
	•	#history: a table of reminders and when they were taken today.
	•	#help and #help-alert: guidance and the app's limits.
2.3 Three special labels in the HTML
These data- labels are notes the HTML leaves for the CSS and JavaScript to read:
	•	data-nav="reminders": put on Add Reminder and Reminder Saved. It says "highlight the Reminders link in the menu while I'm showing", because these pages aren't in the menu themselves.
	•	data-demo: marks the example cards and rows (for example "Demo reminder A"). They are shown to new users so they can see what their reminders will look like. JavaScript hides them as soon as the user saves a real reminder.
	•	data-status="due": gives a card its status. The CSS uses it to colour the badge, and the counters use it to count.
2.4 Accessibility built into the HTML
	•	Every form field has a visible <label>.
	•	Buttons that open panels use aria-expanded, so screen readers know whether they're open.
	•	The current menu link gets aria-current="page".
	•	Pictures that are only decoration have alt="", so screen readers skip them.
At the very bottom, the two scripts are loaded: first index.js, then reminders.js.
3. The CSS (style.css)
3.1 Layers: the order of the file
The first line lists the layers of the stylesheet:
@layer reset, root, base, layout, components, navigation,
       home, schedule, reminders, historyPage, helpPage, responsive;
Each part of the file is wrapped in one of these layers. A later layer wins over an earlier one. That's why responsive is last: the phone and tablet rules always win over the desktop rules. Each layer has a big heading comment, for example /* ... HOME PAGE ... */, so you can jump to it.
	•	reset: removes the browser's default spacing so every browser starts the same.
	•	root: the design settings (see 3.2).
	•	base and layout: fonts, the two-column page (sidebar 290px wide plus the content area), and the 3-column grids.
	•	components: shared pieces such as the white panels, cards, buttons, the Mark as taken animation and the illustration circles.
	•	navigation: the sidebar and menu.
	•	home, schedule, reminders, historyPage, helpPage: one layer per page.
	•	responsive: tablet and phone (see 3.4).
3.2 Design settings: :root
All colours, font sizes and shadows are stored once as variables at the top of the file:
--clr-yellow-400: hsl(51, 89%, 79%);
--clr-heading:    hsl(234, 73%, 66%);
--fs-h1:          2.5rem;
Everywhere else uses them, for example color: var(--clr-heading). To change a colour across the whole app, change it once here.
3.3 How pages are hidden and statuses coloured
	•	.page:not(.active) { display: none; }: every section is hidden unless JavaScript has given it the class active.
	•	Status colours come from the card's data-status: blue for Upcoming, yellow for Due, green for Taken. The badge also says the word, so colour is never the only signal.
	•	.hidden: a general "hide this" class that JavaScript adds and removes (forms, demo examples).
	•	Users who switch off animations in their system settings get the colour changes without the movement (prefers-reduced-motion).
3.4 Phone and tablet: the responsive layer
	•	1024px wide and below (tablet): the sidebar becomes a top bar with the hamburger and account buttons, and the menu drops down.
	•	900px and 600px and below: the text sizes step down for tablet and phone. The grids go to one column.
	•	Text boxes stay at 16px on phones, because iPhones zoom the whole page into any smaller field.
4. The JavaScript: index.js (moving around)
4.1 Switching pages: show()
This small function is what makes the single page work:
	1	Read the hash from the address bar, for example #schedule. If there's none, use home.
	2	Give the section with that id the class active and remove it from all the others. The CSS then shows only that one.
	3	Highlight the matching menu link with aria-current="page", using data-nav if the page has one.
It runs once when the page opens, and again every time the hash changes (hashchange).
4.2 Phone and tablet menus
	•	The hamburger adds menu-open to the header. The CSS turns the icon into a cross and drops the menu down.
	•	The account icon does the same with user-open for the Login and Register panel.
	•	Only one can be open at a time. Picking a page, pressing Escape, or widening the window closes them.
4.3 Login, Register and users (demonstration)
	•	The Login and Register buttons open and close their forms. Only one form is open at a time.
	•	Submitting Login just shows "Logged in: your email". Nothing is checked or saved.
	•	users is an empty list ready for real accounts later. While it's empty, the sidebar shows DEMO_USER ("User name" and a placeholder icon).
5. The JavaScript: reminders.js (the reminder logic)
All of this file is wrapped in (function () { ... })();. That keeps its names private so they can't clash with index.js.
5.1 What a saved reminder looks like
{
  id: "1730457000000",          // unique number from the time it was created
  name: "Morning tablet",
  time: "08:00",                // the daily time, 24-hour
  createdAt: "2026-11-01T...",
  history: [ { date: "2026-11-01", takenAt: "08:03" } ]   // one entry per day taken
}
All reminders are kept in one list called reminders. The reminder repeats every day. Taking it today only adds a line to its history, so tomorrow's reminder is not affected.
5.2 Saving in the browser: loadReminders() and storeReminders()
	•	The list is saved in the browser's localStorage under the name medireminder.reminders, as text (JSON).
	•	When the app opens, loadReminders() reads it back. If it's missing or damaged, the app starts with an empty list instead of crashing.
	•	Both are wrapped in try/catch, because some browsers (for example private mode) block storage. The app still works until the page is closed.
5.3 Adding a reminder: the form
When Save reminder is pressed:
	1	The page is stopped from reloading (event.preventDefault()).
	2	Checks: is the name empty? Is the time missing? Is there already a reminder with the same name at the same time? Any problem shows a red message under the field (showError()), marks the field as invalid for screen readers, and moves the cursor to it.
	3	If everything is fine, a new reminder object is made (5.1) and added to the list.
	4	The list is saved (storeReminders()), every page is redrawn (renderAll()), and the app jumps to #reminder-saved.
Small helpers: clicking the empty name box fills in the example "Morning tablet". The time box shows "Choose a time" until clicked, then turns into a time picker. Cancel clears the form.
5.4 Working out the status: getStatus()
	•	Taken: today's date is in its history.
	•	Due: not taken, and its time has passed today.
	•	Upcoming: its time hasn't come yet today.
The date uses the device's local time, not world time (UTC), so it changes at your own midnight.
5.5 Drawing the pages: renderAll()
This is the heart of the file. Every time the reminders change, renderAll() redraws everything from the list:
	•	renderReminders(): builds a card for each reminder on the Reminders page, earliest time first, with a Delete button.
	•	renderSchedule(): builds a card for each reminder on the Schedule page with its status badge. Only Due cards get a Mark as taken button. Then updateCounters() counts the Due, Upcoming and Taken cards.
	•	renderHistory(): builds a table row for each reminder: name, time, when it was taken today (or "Not Recorded"), and status.
	•	updateDemos(): hides every data-demo example if there's at least one real reminder, and shows them again if there are none.
Cards are built with JavaScript (document.createElement), not written in the HTML. Names are inserted with textContent, so if someone types code into the name box it shows as plain text and can't break the page.
5.6 Mark as taken and Delete
	•	markTaken(id): finds the reminder and checks it really is Due. It then adds { date: today, takenAt: now } to its history, saves, redraws, and puts the keyboard focus on the card, so keyboard users don't get lost.
	•	The demo card's Mark as taken only shows what would happen. It saves nothing, and reloading resets it.
	•	deleteReminder(id): removes the reminder from the list, saves and redraws.
5.7 Keeping it up to date: the 15-second timer
At the bottom, setInterval checks every 15 seconds whether any status has changed. For example, a reminder's time has arrived and it should now be Due, or it's past midnight and Taken should go back to Upcoming. It only redraws when something actually changed, so the page doesn't jump while you're using it.
6. One full journey, step by step
	1	You open the app. show() displays Home. loadReminders() finds nothing, so updateDemos() shows the examples.
	2	You click Add reminder. The hash becomes #add-reminder and show() displays the form.
	3	You type "Morning tablet", choose 08:00 and press Save reminder. The checks pass, the reminder is added and saved, renderAll() redraws, the examples disappear, and you see Reminder Saved.
	4	At 08:00 the 15-second timer notices the status changed from Upcoming to Due and redraws. Schedule now shows Due with a Mark as taken button.
	5	You click Mark as taken. Today is added to its history and saved. Schedule shows Taken, the counters update, and History shows the time you took it.
	6	You close and reopen the browser. loadReminders() brings everything back.
7. "Where do I change…?"
	•	A colour or font size for the whole app: :root at the top of style.css.
	•	The text on a page: that page's <section> in index.html.
	•	The error messages on the form: the "Save reminder" part of reminders.js (search for Enter a reminder name).
	•	The status words (Due, Upcoming, Taken): STATUS_LABELS in reminders.js.
	•	The phone layout: the responsive layer at the bottom of style.css.
	•	Adding a new page: add a <section class="page" id="new-name"> to index.html and a link href="#new-name". show() handles the rest.
8. What the app does not do 
These limits are worth knowing for the viva:
	•	Login and Register are for demonstration only. There are no real accounts.
	•	Reminders can't be edited (only deleted), and Delete doesn't ask "are you sure?".
	•	There are no sound or pop-up notifications. The status only changes while the page is open. The "Reminder due" banner exists in the HTML but isn't switched on.
	•	History shows today only, not earlier days. The data is kept, but it isn't displayed.
	•	If the browser blocks storage, the app keeps working but doesn't tell the user that nothing is being saved.
	•	Everything is stored in one browser. There is no syncing between devices.
Questions about any part of this? Ask me (Marek). I'm happy to go through the code with you on a call.
