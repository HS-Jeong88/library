import { BookAPI } from "../app/api.js";
import BookCard from "../components/BookCard.js";

export default function Home() {
  return `
    <main class="p-8 max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p class="text-gray-500 mt-2">
          나의 독서 현황을 확인하세요.
        </p>
      </div>
      <!-- 통계 카드 -->
      <section class="grid grid-cols-1 sm:grid-cols-2
                      xl:grid-cols-3 gap-5 mb-10">
        <div class="bg-white border rounded-xl p-6 shadow-sm">
          <div class="flex justify-between items-center">
            <p class="text-gray-500">전체 도서</p>
            <span class="text-2xl">📚</span>
          </div>
          <h2 id="totalBooks"
            class="text-3xl font-bold text-blue-600 mt-4">
            -
          </h2>
          <p class="text-sm text-gray-400 mt-2">
            등록된 도서 수
          </p>
        </div>
        <div class="bg-white border rounded-xl p-6 shadow-sm">
          <div class="flex justify-between items-center">
            <p class="text-gray-500">전체 장르</p>
            <span class="text-2xl">🏷️</span>
          </div>
          <h2 id="totalGenres"
            class="text-3xl font-bold text-green-600 mt-4">
            -
          </h2>
          <p class="text-sm text-gray-400 mt-2">
            등록된 장르 종류
          </p>
        </div>
        <div class="bg-white border rounded-xl p-6 shadow-sm">
          <div class="flex justify-between items-center">
            <p class="text-gray-500">최근 등록</p>
            <span class="text-2xl">🆕</span>
          </div>
          <h2 id="latestBook"
            class="text-lg font-bold text-purple-600 mt-4 truncate">
            -
          </h2>
          <p class="text-sm text-gray-400 mt-2">
            가장 최근 등록한 도서
          </p>
        </div>
      </section>
      <section>
        <div class="flex justify-between items-center mb-5">
          <h2 class="text-xl font-bold text-gray-800">
            최근 등록 도서
          </h2>
          <a href="#/library" data-link
            class="text-blue-600 text-sm hover:underline">
            전체 도서 보기 →
          </a>
        </div>
        <div id="recentBooks"
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <p class="text-gray-400">
            불러오는 중...
          </p>
        </div>
      </section>
    </main>
  `;
}

export async function initHome() {
  try {
    const books = await BookAPI.getAll();

    document.querySelector("#totalBooks").textContent = books.length;

    const genres = new Set(books.map((book) => book.genre));

    document.querySelector("#totalGenres").textContent = genres.size;

    const sortedBooks = [...books].sort((a, b) => b.created_at.localeCompare(a.created_at));

    document.querySelector("#latestBook").textContent =
      sortedBooks.length > 0 ? sortedBooks[0].title : "등록된 도서 없음";

    const recentBooks = sortedBooks.slice(0, 5);

    const recentBooksArea = document.querySelector("#recentBooks");

    if (recentBooks.length === 0) {
      recentBooksArea.innerHTML = `
        <div class="col-span-full bg-white border rounded-xl text-center py-20">
          <div class="text-5xl mb-4">📖</div>
          <p class="text-gray-500">
            아직 등록된 도서가 없습니다.
          </p>
          <a href="#/library" data-link
            class="inline-block mt-4 text-blue-600 hover:underline">
            도서 등록하러 가기 →
          </a>
        </div>
      `;
    } else {
      recentBooksArea.innerHTML = recentBooks.map((book) => BookCard(book, false)).join("");
    }
  } catch (error) {
    document.querySelector("#recentBooks").innerHTML = `
      <p class="col-span-full text-red-500">
        데이터를 불러오지 못했습니다.
        ${error.message}
      </p>
    `;
  }
}
