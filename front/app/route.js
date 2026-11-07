import Sidebar from "../components/Sidebar.js";
import Home, { initHome } from "../pages/Home.js";
import Library, { initLibrary } from "../pages/Library.js";

const routes = {
  "/": Home,
  "/library": Library,
};

function getPath() {
  return window.location.hash.slice(1) || "/";
}

export function router() {
  const app = document.querySelector("#app");
  const path = getPath();

  const Page = routes[path] || Home;

  app.innerHTML = `
    <div class="flex min-h-screen bg-gray-50">
      ${Sidebar()}
      <div class="flex-1 min-w-0">
        ${Page()}
      </div>
    </div>
  `;
  document.querySelectorAll(".sidebar-link").forEach((link) => {
    if (link.dataset.route === path) {
      link.classList.add("bg-blue-50", "text-blue-600", "font-semibold");
    }
  });
  if (path === "/") {
    initHome();
  }
  if (path === "/library") {
    initLibrary();
  }
}

window.addEventListener("hashchange", router);

export function initRouter() {
  if (!window.location.hash) {
    window.location.hash = "/";
  } else {
    router();
  }
}
