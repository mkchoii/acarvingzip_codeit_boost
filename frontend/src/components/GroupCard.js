import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅을 가져옵니다.
import styles from "./GroupCard.module.css";
import { ReactComponent as Favicon } from "../assets/favicon_s.svg";

function GroupCard({ group }) {
  const navigate = useNavigate(); // 페이지 이동을 위해 useNavigate 훅을 사용합니다.
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

  const handleClick = () => {
    if (!isPublic) {
      // 그룹이 비공개일 때만 접근 권한 페이지로 이동합니다.
      navigate(`/private-group-access/${group.id}`);
    } else {
      // 공개 그룹일 경우, 다른 페이지로 이동하거나 해당 동작을 추가할 수 있습니다.
      console.log("공개 그룹 클릭");
    }
  };

  return (
    <div
      className={`${styles.card} ${cardClassName}`}
      onClick={handleClick} // 클릭 핸들러를 추가하여 비공개 그룹일 때 접근 권한 페이지로 이동하도록 합니다.
    >
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
