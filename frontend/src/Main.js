import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./components/App";
import CreateGroupPage from "./pages/CreateGroupPage";
import PrivateGroupAccessPage from "./pages/PrivateGroupAccessPage";
import GroupDetailPage from "./pages/GroupDetailPage";
import MemoryUploadPage from "./pages/MemoryUploadPage";
import MemoryDetailPage from "./pages/MemoryDetailPage";
import PrivatePostAccessPage from "./pages/PrivatePostAccessPage";
import NotFoundPage from "./pages/404Page";

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
        <Route path="/group/:groupId" element={<GroupDetailPage />} />
        <Route
          path="/group/:groupId/upload-memory"
          element={<MemoryUploadPage />}
        />

        <Route
          path="/post/:postId/access"
          element={<PrivatePostAccessPage />} // 비공식 게시글 접근 권한 페이지 라우트
        />
        <Route path="/post/:postId" element={<MemoryDetailPage />} />

        {/* 404 페이지 라우팅 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Main;
