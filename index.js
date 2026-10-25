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
// FORMS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const loginButton = document.querySelector(".login");
const loginForm = document.querySelector("#login-form");
const emailInput = document.querySelector("#user-name");

loginButton.addEventListener("click", () => {
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// USERS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const users = [
  {
    id: 1,
    name: "User name",
    avatar: "assets/streamline-milano--400x400-PNG/User/User_Circle.svg",
    reminders: [
      // example shape for later:
      // { id: 1, name: "Vitamin D", time: "08:00", history: [] }
    ],
  },
];

const userList = document.querySelector(".user-list");
function renderUsers() {
  if (!userList) return; //stops errors on pages without a user list
  userList.innerHTML = ""; // clear before rebuilding

  users.forEach((user) => {
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
