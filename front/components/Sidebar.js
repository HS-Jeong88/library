export default function Sidebar() {
  return `
    <aside class="w-64 min-h-screen bg-white border-r border-gray-200 p-5 shrink-0">

      <div class="flex items-center gap-3 mb-10 px-2">
        <div class="bg-blue-100 text-blue-600 p-2 rounded-lg">
          📚
        </div>

        <h2 class="text-xl font-bold text-gray-800">
          Book Manager
        </h2>
      </div>

      <nav class="flex flex-col gap-2">

        <a href="#/"
          data-link
          data-route="/"
          class="sidebar-link flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition">

          <span>🏠</span>
          <span class="font-medium">Home</span>
        </a>

        <a href="#/library"
          data-link
          data-route="/library"
          class="sidebar-link flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition">

          <span>📚</span>
          <span class="font-medium">Library</span>
        </a>

      </nav>

    </aside>
  `;
}
