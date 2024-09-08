import React, { useState } from "react";
import styles from "./GroupDeleteModal.module.css";
import { ReactComponent as CloseIcon } from "../assets/icon_x.svg"; // X 아이콘 임포트

// title을 props로 받도록 수정
function GroupDeleteModal({ title, onClose, onDelete }) {
  const [password, setPassword] = useState(""); // 비밀번호 상태

  const handleDelete = () => {
    if (password.trim() === "") {
      alert("비밀번호를 입력하세요.");
      return;
    }
    onDelete(password); // 부모 컴포넌트로 비밀번호 전달
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{title}</h2>{" "}
          {/* 동적으로 제목 변경 */}
          <CloseIcon onClick={onClose} className={styles.closeIcon} />
        </div>
        <p className={styles.modalDescription}>삭제 권한 인증</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해주세요."
          className={styles.passwordInput}
        />
        <div className={styles.buttonContainer}>
          <button onClick={handleDelete} className={styles.deleteButton}>
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default GroupDeleteModal;
