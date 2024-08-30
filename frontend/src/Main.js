import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./components/App";
import CreateGroupPage from "./pages/CreateGroupPage";
import PrivateGroupAccessPage from "./pages/PrivateGroupAccessPage";

function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}></Route>
        <Route path="/create-group" element={<CreateGroupPage />} />
        <Route
          path="/private-group-access/:groupId"
          element={<PrivateGroupAccessPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Main;
