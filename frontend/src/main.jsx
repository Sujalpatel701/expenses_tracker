import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Auth from "./auth.jsx";
import App from "./App.jsx"; // Import App

function Main() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  return (
    <StrictMode>
      {isAuthenticated ? <App /> : <Auth setIsAuthenticated={setIsAuthenticated} />}
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<Main />);
