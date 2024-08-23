import React from "react";
import styles from "./Modal.module.css";

function Modal({ title, message, onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>{title}</h2>
        <p className={styles.modalMessage}>{message}</p>
        <button onClick={onClose} className={styles.modalButton}>
          확인
        </button>
      </div>
    </div>
  );
}

export default Modal;
