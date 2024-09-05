import React from "react";
import styles from "./MemoryCard.module.css";
import { ReactComponent as LikeIcon } from "../assets/favicon_s.svg"; // 좋아요 아이콘
import { ReactComponent as CommentIcon } from "../assets/icon_bubble.svg"; // 댓글 아이콘
import { useNavigate } from "react-router-dom"; // useNavigate 훅 임포트

function MemoryCard({ post, isPublic }) {
  const navigate = useNavigate(); // 네비게이션을 위한 훅

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return "날짜 없음";
    }
    return date.toLocaleDateString("ko-KR", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formattedDate = formatDate(post.date); // 날짜 포맷팅

  const handleCardClick = () => {
    if (isPublic) {
      // 공개된 메모리로 바로 이동
      navigate(`/post/${post.id}`);
    } else {
      // 비공개 메모리로 비밀번호 확인 페이지로 이동
      navigate(`/post/${post.id}/access`);
    }
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      {" "}
      {/* 카드 클릭 시 동작 추가 */}
      {isPublic && post.imageUrl && (
        <img src={post.imageUrl} alt={post.title} className={styles.image} />
      )}
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.author}>{post.author}</span>
          <span className={styles.visibility}>
            {isPublic ? "공개" : "비공개"}
          </span>
        </div>

        <h3 className={styles.title}>{post.title}</h3>

        {/* 공개 카드에서만 태그 표시 */}
        {isPublic && post.tags.length > 0 && (
          <div className={styles.tags}>
            {post.tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 공개일 경우 주소와 날짜 표시 */}
        {isPublic ? (
          <div className={styles.footer}>
            <div className={styles.location}>
              {post.location} ・ {formattedDate}
            </div>
            <div className={styles.interactions}>
              <div className={styles.likes}>
                <LikeIcon className={styles.icon} /> {post.likes}
              </div>
              <div className={styles.comments}>
                <CommentIcon className={styles.icon} /> {post.comments}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.interactions}>
            <div className={styles.likes}>
              <LikeIcon className={styles.icon} /> {post.likes}
            </div>
            <div className={`${styles.comments} ${styles.marginLeft}`}>
              <CommentIcon className={styles.icon} /> {post.comments}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemoryCard;
