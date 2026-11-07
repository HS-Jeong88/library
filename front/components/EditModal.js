export default function EditModal(book) {
  return `
    <div id="editModal"
      class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-lg rounded-2xl shadow-xl p-7">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">
            도서 수정
          </h2>
          <button id="closeModal"
            class="text-gray-400 hover:text-gray-700 text-2xl">
            &times;
          </button>
        </div>
        <form id="editBookForm">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">
                도서 제목
              </label>
              <input name="title"
                value="${escapeHTML(book.title)}"
                required
                class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">
                저자
              </label>
              <input name="author"
                value="${escapeHTML(book.author)}"
                required
                class="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium mb-2">
                  장르
                </label>
                <input name="genre"
                  value="${escapeHTML(book.genre)}"
                  required
                  class="w-full border rounded-lg p-3">
              </div>
              <div>
                <label class="block text-sm font-medium mb-2">
                  출판 연도
                </label>
                <input name="year"
                  type="number"
                  min="1"
                  value="${book.year}"
                  required
                  class="w-full border rounded-lg p-3">
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">
                도서 설명
              </label>
              <textarea name="description"
                rows="4"
                class="w-full border rounded-lg p-3 resize-none">${escapeHTML(book.description)}</textarea>
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-7">
            <button type="button"
              id="cancelModal"
              class="px-5 py-2.5 border rounded-lg hover:bg-gray-100">
              취소
            </button>
            <button type="submit"
              class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              수정 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function escapeHTML(value) {
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
}
