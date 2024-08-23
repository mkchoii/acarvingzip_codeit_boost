import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./components/App";
import CreateGroupPage from "./pages/CreateGroupPage";

function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
        <Route path="/create-group" element={<CreateGroupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Main;
