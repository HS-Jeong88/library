export default function BookCard(book, showActions = true) {
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

  return `
    <article class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition">
      <div class="flex justify-between items-start mb-4">
        <span class="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
          ${escapeHTML(book.genre)}
        </span>
        <span class="text-xs text-gray-400">
          #${book.id}
        </span>
      </div>
      <h3 class="text-lg font-bold text-gray-800 mb-2">
        ${escapeHTML(book.title)}
      </h3>
      <p class="text-sm text-gray-500 mb-2">
        저자 : ${escapeHTML(book.author)}
      </p>
      <p class="text-sm text-gray-500 mb-4">
        출판 연도 : ${book.year}
      </p>
      <p class="text-sm text-gray-600 min-h-12 mb-4">
        ${escapeHTML(book.description || "설명이 없습니다.")}
      </p>
      <div class="flex justify-between items-center border-t pt-4">
        <span class="text-xs text-gray-400">
          ${escapeHTML(book.created_at)}
        </span>
        ${
          showActions
            ? `
            <div class="flex gap-2">
              <button
                data-edit="${book.id}"
                class="text-sm text-blue-600 hover:text-blue-800">
                수정
              </button>
              <button
                data-delete="${book.id}"
                class="text-sm text-red-500 hover:text-red-700">
                삭제
              </button>
            </div>
          `
            : ""
        }
      </div>
    </article>
  `;
}
