import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./container/Home";
import { useEffect } from "react";
import { fetchUser } from "./utils/fetchUser";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = fetchUser();
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/*" element={<Home />} />
    </Routes>
  );
}
