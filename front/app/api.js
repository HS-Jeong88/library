// const API_URL = "http://127.0.0.1:8000";
const API_URL = `http://${window.location.hostname}:8000`;

const request = async (url, options = {}) => {
  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.detail || "서버 요청에 실패했습니다.");
  }

  return data;
};

export const BookAPI = {
  getAll() {
    return request("/books");
  },

  search(keyword) {
    return request(`/books?search=${encodeURIComponent(keyword)}`);
  },

  create(book) {
    return request("/books", {
      method: "POST",
      body: JSON.stringify(book),
    });
  },

  update(id, book) {
    return request(`/books/${id}`, {
      method: "PUT",
      body: JSON.stringify(book),
    });
  },

  delete(id) {
    return request(`/books/${id}`, {
      method: "DELETE",
    });
  },
};
