import React from "react";
import { ReactComponent as EditIcon } from "../assets/icon_edit.svg"; // 수정 아이콘
import { ReactComponent as DeleteIcon } from "../assets/icon_delete.svg"; // 삭제 아이콘
import styles from "./Comment.module.css";

function Comment({ id, nickname, content, createdAt, onEdit, onDelete }) {
  const formattedDate = new Date(createdAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24시간 형식
  });

  return (
    <div className={styles.comment}>
      <div className={styles.commentHeader}>
        <div className={styles.nicknameAndDate}>
          <span className={styles.nickname}>{nickname}</span>
          <span className={styles.createdAt}>{formattedDate}</span>
        </div>
      </div>
      <div className={styles.commentContentAndActions}>
        <p className={styles.content}>{content}</p>
        <div className={styles.actions}>
          <EditIcon onClick={() => onEdit(id)} className={styles.icon} />
          <DeleteIcon onClick={() => onDelete(id)} className={styles.icon} />
        </div>
      </div>
    </div>
  );
}

export default Comment;
