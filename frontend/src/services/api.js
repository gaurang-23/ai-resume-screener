const API_BASE_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}`;

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

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData || body === undefined ? body : JSON.stringify(body),
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : null;

  if (!res.ok) {
    throw new ApiError(data?.message || "Something went wrong.", res.status);
  }

  return data;
};

const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body }),
};

export default api;
