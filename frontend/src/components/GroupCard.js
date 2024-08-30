import React from "react";
import styles from "./GroupCard.module.css";
import { ReactComponent as Favicon } from "../assets/favicon_s.svg";

function GroupCard({ group }) {
  const isImageAvailable = Boolean(group.image);
  const isPublic = group.isPublic;

  // D+ 형식으로 경과 일수 계산
  const calculateDday = (createdAt) => {
    const createdDate = new Date(createdAt);
    const today = new Date();
    const diffTime = Math.abs(today - createdDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `D+${diffDays}`;
  };

  let cardClassName;
  if (isPublic) {
    cardClassName = isImageAvailable
      ? styles.cardWithImage
      : styles.cardWithoutImage;
  } else {
    cardClassName = styles.cardPrivate;
  }

  return (
    <div className={`${styles.card} ${cardClassName}`}>
      {isImageAvailable && isPublic && (
        <img src={group.image} alt={group.name} className={styles.image} />
      )}
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.days}>{calculateDday(group.createdAt)}</span>{" "}
          {/* D+디데이 */}
          <span>{group.isPublic ? "공개" : "비공개"}</span>
        </div>
        <h2 className={styles.title}>{group.name}</h2>
        {isPublic && group.introduction && (
          <p className={styles.description}>{group.introduction}</p>
        )}
        <div className={styles.footer}>
          <div className={styles.footerSection}>
            <span className={styles.label}>획득 배지</span>
            <span className={styles.data}>{group.badgeCount}</span>
          </div>
          <div className={styles.footerSection}>
            <span className={styles.label}>게시물</span>
            <span className={styles.data}>{group.postCount}</span>
          </div>
          <div className={styles.likesSection}>
            <span className={styles.label}>그룹 공감</span>
            <span className={styles.data}>
              <Favicon className={styles.favicon} /> {group.likeCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupCard;
