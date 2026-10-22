///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// FORMS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const loginUser = document.querySelector(".login");
const formDisplay = document.querySelector(".hidden");
formDisplay.classList.toggle("hidden");

function revealForm() {}

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
