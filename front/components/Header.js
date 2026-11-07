import Header from "./Header.js";
import Footer from "./Footer.js";
import Sidebar from "./Sidebar.js";

export default function Home() {
  return `
    ${Header()}
    <div class="flex">
      ${Sidebar()}
      <main>
        <h1>홈 페이지</h1>
      </main>
    </div>
    ${Footer()}
  `;
}
