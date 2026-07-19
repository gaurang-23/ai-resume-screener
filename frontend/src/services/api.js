const request = async (path, { method = "GET", body } = {}) => {
  const token = localStorage.getItem("token");
  const isFormData = body instanceof FormData;

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(isFormData || body === undefined
      ? {}
      : { "Content-Type": "application/json" }),
  };

  const url = API_BASE_URL.startsWith("http")
    ? `${API_BASE_URL}${path}`
    : `https://ai-resume-screener-qwzq.onrender.com/api${path}`;

  const res = await fetch(url, {
    method,
    headers,
    body: isFormData || body === undefined ? body : JSON.stringify(body),
  });

  // --- ADD THIS LOGIC ---
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
