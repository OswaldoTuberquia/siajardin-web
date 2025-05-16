import { createRoot } from "react-dom/client";
import { AppContext } from "./context/AppContext";
import { PrimeReactProvider } from "primereact/api";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LoginComponent from "./components/login/LoginComponent";
import HomeComponent from "./components/home/HomeComponent";
import CalendarioComponent from "./components/calendario/CalendarioComponent";

createRoot(document.getElementById("root")).render(
  <PrimeReactProvider>
    <AppContext>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<LoginComponent />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/views/home" element={<HomeComponent />} />
          <Route path="/views/calendario" element={<CalendarioComponent />} />
        </Routes>
      </BrowserRouter>
    </AppContext>
  </PrimeReactProvider>
);
