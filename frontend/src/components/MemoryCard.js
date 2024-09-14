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

    // 날짜 부분 (YY.MM.DD)과 시간 부분 (HH:MM) 분리
    const formattedDate = date
      .toLocaleDateString("ko-KR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\s+/g, "") // 공백 제거
      .replace(/\.$/, ""); // 마지막에 남은 . 제거

    const formattedTime = date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // 24시간 형식으로 설정
    });

    return `${formattedDate} ${formattedTime}`; // 시간과 날짜 사이에 공백 추가
  };

  const formattedDate = formatDate(post.moment); // API의 'moment' 필드를 사용

  const handleCardClick = () => {
    if (post.isPublic) {
      // 공개된 메모리로 바로 이동
      navigate(`/post/${post.id}`);
    } else {
      // 비공개 메모리로 비밀번호 확인 페이지로 이동
      navigate(`/post/${post.id}/access`);
    }
  };

  // XXX: 태그 관련 코드 추가하였습니다.
  const tags = post.tags
  ? post.tags.split(',').map(tag => tag.trim()) // 공백 제거
  : [];

  return (
    <div className={styles.card} onClick={handleCardClick}>
      {" "}
      {/* 카드 클릭 시 동작 추가 */}
      {post.isPublic && post.imageUrl && (
        <img src={post.imageUrl} alt={post.title} className={styles.image} />
      )}
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.author}>{post.nickname}</span>{" "}
          <span className={styles.visibility}>
            {post.isPublic ? "공개" : "비공개"}
          </span>
        </div>

        <h3 className={styles.title}>{post.title}</h3>

        {/* XXX: 태그 관련 코드 수정하였습니다. */}
        {/* 공개 카드에서만 태그 표시 */}
        {post.isPublic && post.tags.length > 0 && (
          <div className={styles.tags}>
            {tags.length > 0 ? (
              <span>{tags.map(tag => `#${tag}`).join(' ')}</span>
            ) : (
              <span></span>
            )}
          </div>
        )}

        {/* 공개일 경우 주소와 날짜 표시 */}
        {post.isPublic ? (
          <div className={styles.footer}>
            <div className={styles.location}>
              {post.location} ・ {formattedDate}
            </div>
            <div className={styles.interactions}>
              <div className={styles.likes}>
                <LikeIcon className={styles.icon} /> {post.likeCount}{" "}
              </div>
              <div className={styles.comments}>
                <CommentIcon className={styles.icon} /> {post.commentCount}{" "}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.interactions}>
            <div className={styles.likes}>
              <LikeIcon className={styles.icon} /> {post.likeCount}{" "}
            </div>
            <div className={`${styles.comments} ${styles.marginLeft}`}>
              <CommentIcon className={styles.icon} /> {post.commentCount}{" "}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemoryCard;
