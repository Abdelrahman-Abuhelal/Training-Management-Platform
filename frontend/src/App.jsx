import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateUsersForm from "./components/CreateUsersForm";
import CompleteRegistration from "./components/CompleteRegistration";
import ForgotPasswordEmail from "./components/ForgotPasswordEmail";
import Login from "./components/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<CreateUsersForm />} />
        <Route path="confirm-account/:token" element={<CompleteRegistration/>} />
        <Route path="login" element={<Login/>} />
        <Route path="forgot-password-email" element={<  ForgotPasswordEmail />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
