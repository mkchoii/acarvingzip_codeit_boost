import React, { useState } from "react";
import styles from "./CommentModal.module.css";
import { registerComment, updateComment } from "../api/commentApi"; // 댓글 등록, 수정 API 호출 함수 import
import { ReactComponent as CloseIcon } from "../assets/icon_x.svg"; // 닫기 아이콘 추가

function CommentModal({
  postId,
  onClose,
  onAddComment,
  onEditComment,
  isEditing = false,
  initialData = {},
}) {
  const [nickname, setNickname] = useState(initialData.nickname || "");
  const [comment, setComment] = useState(initialData.content || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nickname || !comment || !password) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    try {
      if (isEditing) {
        // 댓글 수정 API 호출
        const updatedComment = await updateComment(initialData.id, {
          nickname,
          content: comment,
          password,
        });

        // 수정된 댓글을 부모 컴포넌트로 전달
        onEditComment(updatedComment);
      } else {
        // 댓글 등록 API 호출
        const newComment = { nickname, content: comment, password };
        const response = await registerComment(postId, newComment);

        // 성공 시 부모 컴포넌트로 댓글 정보 전달
        onAddComment(response);
      }

      // 폼 초기화 및 모달 닫기
      setNickname("");
      setComment("");
      setPassword("");
      setError("");
      onClose();
    } catch (err) {
      console.error("댓글 수정 오류:", err.message);
      setError("처리에 실패했습니다.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {/* 닫기 아이콘을 우측 상단에 추가 */}
        <div className={styles.closeIconWrapper} onClick={onClose}>
          <CloseIcon className={styles.closeIcon} />
        </div>
        <h2 className={styles.modalTitle}>
          {isEditing ? "댓글 수정" : "댓글 등록"}
        </h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="nickname" className={styles.label}>
            닉네임
          </label>
          <input
            type="text"
            id="nickname"
            placeholder="닉네임을 입력해 주세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className={styles.inputField}
          />

          <label htmlFor="comment" className={styles.label}>
            댓글
          </label>
          <textarea
            id="comment"
            placeholder="댓글을 입력해 주세요"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles.textArea}
          />

          <label htmlFor="password" className={styles.label}>
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
          />

          {error && <p className={styles.errorMessage}>{error}</p>}
          <button type="submit" className={styles.submitButton}>
            {isEditing ? "수정하기" : "등록하기"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CommentModal;
