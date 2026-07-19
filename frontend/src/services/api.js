const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://ai-resume-screener-qwzq.onrender.com/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const request = async (path, { method = "GET", body } = {}) => {
  const token = localStorage.getItem("token");
  const isFormData = body instanceof FormData;

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isFormData || body === undefined
      ? {}
      : { "Content-Type": "application/json" }),
  };

  const url = `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    method,
    headers,
    body: isFormData || body === undefined ? body : JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(data.message || "Something went wrong", res.status);
  }

  return data;
};

export const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body }),
};
