import { BookAPI } from "../app/api.js";
import BookCard from "../components/BookCard.js";
import EditModal from "../components/EditModal.js";

let books = [];
let keyword = "";
let sortType = "date";
let searchTimer = null;
let requestNumber = 0;

const escapeHTML = (value) => {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[char],
  );
};

export default function Library() {
  keyword = "";
  sortType = "date";
  return `
    <main class="p-8 max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">
            My Library
          </h1>
          <p class="text-gray-500 mt-2">
            나의 도서를 관리하세요.
          </p>
        </div>
        <button id="addBookBtn"
          class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg">
          + 도서 등록
        </button>
      </div>
      <!-- 등록 폼 -->
      <section id="addBookForm"
        class="hidden bg-white border rounded-xl p-6 mb-8">
        <h2 class="text-xl font-bold mb-5">
          새 도서 등록
        </h2>
        <form id="bookForm">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" required
              placeholder="도서 제목"
              class="border rounded-lg p-3">
            <input name="author" required
              placeholder="저자"
              class="border rounded-lg p-3">
            <input name="genre" required
              placeholder="장르"
              class="border rounded-lg p-3">
            <input name="year" type="number"
              min="1" required
              placeholder="출판 연도"
              class="border rounded-lg p-3">
          </div>
          <textarea name="description"
            placeholder="간단한 도서 설명"
            class="border rounded-lg p-3 w-full mt-4"
            rows="3"></textarea>
          <div class="flex justify-end gap-3 mt-4">
            <button type="button" id="cancelAddBtn"
              class="px-5 py-2 border rounded-lg">
              취소
            </button>
            <button type="submit"
              class="px-5 py-2 bg-blue-600 text-white rounded-lg">
              등록하기
            </button>
          </div>
        </form>
      </section>
      <div class="flex flex-col sm:flex-row gap-3 mb-5">
        <input id="searchInput"
          type="text"
          placeholder="도서 제목 또는 장르 검색"
          class="border bg-white rounded-lg p-3 flex-1">
        <select id="sortSelect"
          class="border bg-white rounded-lg p-3">
          <option value="date">등록일순</option>
          <option value="title">제목순</option>
        </select>
      </div>
      <!-- 개수 -->
      <div class="mb-5 text-gray-600">
        전체 도서
        <span id="bookCount"
          class="font-bold text-blue-600">0</span>권
      </div>
      <!-- 목록 -->
      <section id="bookList"
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <p class="text-gray-400">불러오는 중...</p>
      </section>
    </main>
  `;
}

const renderBooks = () => {
  const bookList = document.querySelector("#bookList");
  const bookCount = document.querySelector("#bookCount");

  if (!bookList || !bookCount) return;

  let sortedBooks = [...books];

  if (sortType === "date") {
    sortedBooks.sort((a, b) => b.created_at.localeCompare(a.created_at));
  } else {
    sortedBooks.sort((a, b) => a.title.localeCompare(b.title, "ko"));
  }

  bookCount.textContent = sortedBooks.length;

  if (sortedBooks.length === 0) {
    bookList.innerHTML = `
      <div class="col-span-full bg-white border rounded-xl text-center py-20">
        <div class="text-5xl mb-4">📚</div>
        <p class="text-gray-500">
          검색된 도서가 없습니다.
        </p>
      </div>
    `;
    return;
  }

  bookList.innerHTML = sortedBooks.map((book) => BookCard(book)).join("");
};

const loadBooks = async () => {
  const currentRequest = ++requestNumber;
  const bookList = document.querySelector("#bookList");
  if (!bookList) return;
  try {
    const result = keyword ? await BookAPI.search(keyword) : await BookAPI.getAll();
    if (currentRequest !== requestNumber) return;
    books = result;
    renderBooks();
  } catch (error) {
    if (currentRequest !== requestNumber) return;
    bookList.innerHTML = `
      <div class="col-span-full text-center text-red-500 py-10">
        ${escapeHTML(error.message)}
      </div>
    `;
  }
};

const getFormData = (form) => {
  const data = new FormData(form);
  return {
    title: data.get("title").trim(),
    author: data.get("author").trim(),
    genre: data.get("genre").trim(),
    year: Number(data.get("year")),
    description: data.get("description").trim(),
  };
};

const validateBook = (book) => {
  if (!book.title || !book.author || !book.genre || !Number.isInteger(book.year) || book.year < 1) {
    alert("모든 필수 항목을 올바르게 입력해 주세요.");
    return false;
  }
  return true;
};

const closeEditModal = () => {
  document.querySelector("#editModal")?.remove();
};

const openEditModal = (id) => {
  const book = books.find((item) => item.id === id);
  if (!book) return;
  closeEditModal();
  document.body.insertAdjacentHTML("beforeend", EditModal(book));
  const modal = document.querySelector("#editModal");
  const form = document.querySelector("#editBookForm");
  document.querySelector("#closeModal").addEventListener("click", closeEditModal);
  document.querySelector("#cancelModal").addEventListener("click", closeEditModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeEditModal();
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const updatedBook = getFormData(form);
    if (!validateBook(updatedBook)) return;
    try {
      await BookAPI.update(id, updatedBook);
      closeEditModal();
      await loadBooks();
      alert("도서 정보가 수정되었습니다.");
    } catch (error) {
      alert(error.message);
    }
  });
};

export const initLibrary = () => {
  const addBookBtn = document.querySelector("#addBookBtn");
  const addBookForm = document.querySelector("#addBookForm");
  const cancelAddBtn = document.querySelector("#cancelAddBtn");
  const bookForm = document.querySelector("#bookForm");
  const searchInput = document.querySelector("#searchInput");
  const sortSelect = document.querySelector("#sortSelect");
  const bookList = document.querySelector("#bookList");

  if (!addBookBtn) return;
  addBookBtn.addEventListener("click", () => {
    addBookForm.classList.toggle("hidden");
  });
  cancelAddBtn.addEventListener("click", () => {
    addBookForm.classList.add("hidden");
    bookForm.reset();
  });
  bookForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const book = getFormData(bookForm);
    if (!validateBook(book)) return;
    try {
      await BookAPI.create(book);
      alert("도서가 등록되었습니다.");
      bookForm.reset();
      addBookForm.classList.add("hidden");
      keyword = "";
      searchInput.value = "";
      await loadBooks();
    } catch (error) {
      alert(error.message);
    }
  });

  searchInput.addEventListener("input", (e) => {
    keyword = e.target.value.trim();
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      loadBooks();
    }, 250);
  });

  sortSelect.addEventListener("change", (e) => {
    sortType = e.target.value;
    renderBooks();
  });

  bookList.addEventListener("click", async (e) => {
    const editBtn = e.target.closest("[data-edit]");
    const deleteBtn = e.target.closest("[data-delete]");

    if (editBtn) {
      openEditModal(Number(editBtn.dataset.edit));
      return;
    }

    if (deleteBtn) {
      const id = Number(deleteBtn.dataset.delete);
      if (!confirm("정말 이 도서를 삭제하시겠습니까?")) {
        return;
      }
      try {
        await BookAPI.delete(id);
        await loadBooks();
        alert("도서가 삭제되었습니다.");
      } catch (error) {
        alert(error.message);
      }
    }
  });

  loadBooks();
};
