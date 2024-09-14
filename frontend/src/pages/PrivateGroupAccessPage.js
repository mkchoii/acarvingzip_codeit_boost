import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./PrivateGroupAccessPage.module.css";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { checkPrivateGroupAccess } from "../api/groupApi";
import Modal from "../components/Modal"; // 모달 컴포넌트 임포트

function PrivateGroupAccessPage() {
  const { groupId } = useParams(); // URL에서 groupId를 추출
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await checkPrivateGroupAccess(groupId, password);
      console.log("API Response:", response); // 응답 내용을 확인

      // 응답 메시지 처리 개선
      if (response.message && response.message.includes("확인되었습니다")) {
        navigate(`/group/${groupId}`);
      } else {
        setError("비밀번호가 틀렸습니다.");
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("비밀번호가 틀렸습니다.");
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달을 닫음
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Logo className={styles.logo} onClick={handleLogoClick} />
      </div>
      <h1 className={styles.title}>비공개 그룹</h1>
      <p className={styles.description}>
        비공개 그룹에 접근하기 위해 비밀번호 확인이 필요합니다.
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.label}>비밀번호를 입력해 주세요</label>
        <input
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.submitButton}>
          제출하기
        </button>
      </form>

      {isModalOpen && (
        <Modal
          title="비공개 그룹 접근 실패"
          message="비밀번호가 일치하지 않습니다."
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default PrivateGroupAccessPage;
