import React from "react";
import styles from "./GroupCard.module.css";
import { ReactComponent as Favicon } from "../assets/favicon_s.svg";

function GroupCard({ group }) {
  const isImageAvailable = Boolean(group.image);
  const isPublic = group.isPublic;

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
          <span className={styles.days}>{`D+${group.days}`}</span>
          <span>{group.isPublic ? "공개" : "비공개"}</span>
        </div>
        <h2 className={styles.title}>{group.name}</h2>
        {isPublic && group.description && (
          <p className={styles.description}>{group.description}</p>
        )}
        <div className={styles.footer}>
          {isPublic && (
            <div className={styles.footerSection}>
              <span className={styles.label}>획득 배지</span>
              <span className={styles.data}>{group.badgeCount}</span>
            </div>
          )}
          <div className={styles.footerSection}>
            <span className={styles.label}>추억</span>
            <span className={styles.data}>{group.memoryCount}</span>
          </div>
          <div className={styles.likesSection}>
            <span className={styles.label}>그룹 공감</span>
            <span className={styles.data}>
              <Favicon className={styles.favicon} /> {group.likes}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupCard;
