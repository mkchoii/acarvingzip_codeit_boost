import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GroupCard.module.css";
import { ReactComponent as Favicon } from "../assets/favicon_s.svg";

function GroupCard({ group }) {
  const navigate = useNavigate(); // 페이지 이동
  const isImageAvailable = Boolean(group.imageUrl);
  const isPublic = Boolean(group.isPublic); // isPublic을 boolean으로 변환

  // D+ 형식으로 경과 일수 계산
  const calculateDday = (createdAt) => {
    if (!createdAt) {
      return "D+0"; // createdAt이 없을 경우 기본값 반환
    }

    const createdDate = new Date(createdAt);
    if (isNaN(createdDate)) {
      return "Invalid Date"; // 날짜가 유효하지 않을 경우 대체 값 반환
    }

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

  // API 데이터 확인
  console.log("GroupCard data:", group);

  return (
    <div className={`${styles.card} ${cardClassName}`} onClick={handleClick}>
      {isImageAvailable && isPublic && (
        <img src={group.imageUrl} alt={group.name} className={styles.image} />
      )}
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.days}>{calculateDday(group.createdAt)}</span>
          <span>{isPublic ? "공개" : "비공개"}</span>
        </div>
        <h2 className={styles.title}>{group.name}</h2>
        {isPublic && group.introduction && (
          <p className={styles.description}>{group.introduction}</p>
        )}
        <div className={styles.footer}>
          <div className={styles.footerSection}>
            <span className={styles.label}>획득 배지</span>
            {/* badgeCount가 없을 경우 0으로 표시 */}
            <span className={styles.data}>{group.badgeCount ?? 0}</span>
          </div>
          <div className={styles.footerSection}>
            <span className={styles.label}>게시물</span>
            {/* postCount가 없을 경우 0으로 표시 */}
            <span className={styles.data}>{group.postCount ?? 0}</span>
          </div>
          <div className={styles.likesSection}>
            <span className={styles.label}>그룹 공감</span>
            {/* likeCount가 없을 경우 0으로 표시 */}
            <span className={styles.data}>
              <Favicon className={styles.favicon} /> {group.likeCount ?? 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupCard;
