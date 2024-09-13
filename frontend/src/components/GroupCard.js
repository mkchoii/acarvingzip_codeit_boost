import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GroupCard.module.css";
import { ReactComponent as Favicon } from "../assets/favicon_s.svg";

function GroupCard({ group }) {
  const navigate = useNavigate(); // 페이지 이동
  const isImageAvailable = Boolean(group.imageUrl);
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
      // 그룹이 비공개일 때는 접근 권한 확인 페이지
      navigate(`/private-group-access/${group.id}`);
    } else {
      // 공개 그룹일 경우, 그룹 상세 페이지
      navigate(`/group/${group.id}`);
    }
  };

  return (
    <div
      className={`${styles.card} ${cardClassName}`}
      onClick={handleClick} // 페이지 이동
    >
      {isImageAvailable && isPublic && (
        <img src={group.imageUrl} alt={group.name} className={styles.image} />
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
            {/* badgeCount로 배지 개수만 표시 */}
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
