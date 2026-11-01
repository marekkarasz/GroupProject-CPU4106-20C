///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PAGES
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function show() {
  const id = location.hash.slice(1) || "home";

  // show the matching page, hide the rest
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.toggle("active", p.id === id));

  //highlight the matching nac link
  // (a page can borrow another link with data-nav, e.g. the saved page uses 'reminders')
  const page = document.getElementById(id);
  const navId = page?.dataset.nav || id;

  document.querySelectorAll(".sidebar-navigation a").forEach((a) => {
    if (a.hash === "#" + navId) {
      a.setAttribute("aria-current", "page");
    } else {
      a.removeAttribute("aria-current");
    }
  });
}

window.addEventListener("hashchange", show);
show();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HEADER MENUS (tablet / phone)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Both buttons are only visible up to 1024px wide (see RESPONSIVE in style.css).
// Hamburger: adds .menu-open to the header -> icon turns into a cross, nav panel drops down.
// User icon: adds .user-open to the header -> login / register panel drops down.
// Only one panel is open at a time.

const header = document.querySelector(".sidebar");
const menuButton = document.querySelector(".menu-toggle");
const userButton = document.querySelector(".user-toggle");

function setMenu(open) {
  if (open) setUserMenu(false); // close the other panel first
  header.classList.toggle("menu-open", open);

  // tell screen readers whether the menu is open, and what the button will do next
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

function setUserMenu(open) {
  if (open) setMenu(false); // close the other panel first
  header.classList.toggle("user-open", open);

  userButton.setAttribute("aria-expanded", String(open));
  userButton.setAttribute(
    "aria-label",
    open ? "Close account menu" : "Open account menu",
  );
}

menuButton.addEventListener("click", () => {
  setMenu(!header.classList.contains("menu-open"));
});

userButton.addEventListener("click", () => {
  setUserMenu(!header.classList.contains("user-open"));
});

// picking a page (any link that changes the #hash) closes both panels
window.addEventListener("hashchange", () => {
  setMenu(false);
  setUserMenu(false);
});

// Escape closes whichever panel is open, and puts the keyboard focus back on its button
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (header.classList.contains("menu-open")) {
    setMenu(false);
    menuButton.focus();
  } else if (header.classList.contains("user-open")) {
    setUserMenu(false);
    userButton.focus();
  }
});

// widening the window past tablet size (or rotating a tablet) resets both panels
window.matchMedia("(max-width: 1024px)").addEventListener("change", () => {
  setMenu(false);
  setUserMenu(false);
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FORMS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const loginButton = document.querySelector(".login");
const loginForm = document.querySelector("#login-form");
const emailInput = document.querySelector("#user-name");

loginButton.addEventListener("click", () => {
  // close the register form so only one form is open at a time
  registerForm.classList.add("hidden");
  registerButton.setAttribute("aria-expanded", "false");

  const isHidden = loginForm.classList.toggle("hidden");

  // tell screen readers whether the form is open
  loginButton.setAttribute("aria-expanded", String(!isHidden));

  // move the cursor into the form when it opens
  if (!isHidden) emailInput.focus();
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page reloading

  const email = emailInput.value.trim();

  loginForm.classList.add("hidden");
  loginButton.setAttribute("aria-expanded", "false");
  loginButton.textContent = "Logged in: " + email;
  loginForm.reset();
});

const registerButton = document.querySelector(".register");
const registerForm = document.querySelector("#register-form");
const registerName = document.querySelector("#register-name");

registerButton.addEventListener("click", () => {
  //close the login form so only one form is open at a time
  loginForm.classList.add("hidden");
  loginButton.setAttribute("aria-expanded", "false");

  const isHidden = registerForm.classList.toggle("hidden");
  // tell screen readers whether the form is open
  registerButton.setAttribute("aria-expanded", String(!isHidden));

  // move the cursor into the form when it opens
  if (!isHidden) registerName.focus();
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// USERS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Real users go in here once registering works.
// example shape for later:
// { id: 1, name: "Jane", avatar: "...", reminders: [{ id: 1, name: "Vitamin D", time: "08:00", history: [] }] }
const users = [];

// Example user shown while `users` is empty (same idea as the demo cards in the pages).
// It disappears as soon as a real user is added, and comes back if the list is empty again.
const DEMO_USER = {
  id: "demo",
  name: "User name",
  avatar: "assets/streamline-milano--400x400-PNG/User/User_Circle.svg",
};

const userList = document.querySelector(".user-list");
function renderUsers() {
  if (!userList) return; //stops errors on pages without a user list
  userList.innerHTML = ""; // clear before rebuilding

  // No real users yet: draw the example user instead
  const shown = users.length > 0 ? users : [DEMO_USER];

  shown.forEach((user) => {
    const li = document.createElement("li");
    li.className = "user-profile";
    li.dataset.userId = user.id;

    const img = document.createElement("img");
    img.className = "avatar";
    img.src = user.avatar;
    img.alt = "";

    const name = document.createElement("span");
    name.className = "user-name";
    name.textContent = user.name;

    li.append(img, name);
    userList.append(li);
  });
}
renderUsers();
