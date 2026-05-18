export const getApiUrl = () => {
  let apiUrl = import.meta.env.VITE_API_URL?.trim();
  
  if (apiUrl) {
    // If the URL has no protocol (e.g. week-8-backend.onrender.com), prepend https://
    if (!/^https?:\/\//i.test(apiUrl)) {
      apiUrl = `https://${apiUrl}`;
    }
    // Remove any trailing slashes
    return apiUrl.replace(/\/+$/, "");
  }

  if (import.meta.env.MODE === "development") {
    return "http://localhost:5000";
  }

  if (typeof window !== "undefined") {
    // Returns the current origin (e.g. https://week-8-nine.vercel.app)
    // This allows same-domain API routing if deploying frontend and backend together on Vercel
    return window.location.origin;
  }

  return "";
};
