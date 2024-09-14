import React from "react";
import styles from "./MemoryCard.module.css";
import { ReactComponent as LikeIcon } from "../assets/favicon_s.svg";
import { ReactComponent as CommentIcon } from "../assets/icon_bubble.svg";
import { useNavigate } from "react-router-dom";

function MemoryCard({ post }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return "날짜 없음";
    }

    const formattedDate = date
      .toLocaleDateString("ko-KR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\s+/g, "")
      .replace(/\.$/, "");

    const formattedTime = date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${formattedDate} ${formattedTime}`;
  };

  const formattedDate = formatDate(post.moment);

  // isPublic 값을 boolean으로 처리
  const isPublic =
    post.isPublic === true || post.isPublic === 1 || post.isPublic === "true";

  const handleCardClick = () => {
    if (isPublic) {
      navigate(`/post/${post.id}`);
    } else {
      navigate(`/post/${post.id}/access`);
    }
  };

  const tags = post.tags ? post.tags.split(",").map((tag) => tag.trim()) : [];

  return (
    <div className={styles.card} onClick={handleCardClick}>
      {isPublic && post.imageUrl && (
        <img src={post.imageUrl} alt={post.title} className={styles.image} />
      )}
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.author}>{post.nickname}</span>
          <span className={styles.visibility}>
            {isPublic ? "공개" : "비공개"}
          </span>
        </div>

        <h3 className={styles.title}>{post.title}</h3>

        {isPublic && tags.length > 0 && (
          <div className={styles.tags}>
            <span>{tags.map((tag) => `#${tag}`).join(" ")}</span>
          </div>
        )}

        {isPublic ? (
          <div className={styles.footer}>
            <div className={styles.location}>
              {post.location} ・ {formattedDate}
            </div>
            <div className={styles.interactions}>
              <div className={styles.likes}>
                <LikeIcon className={styles.icon} /> {post.likeCount || 0}
              </div>
              <div className={styles.comments}>
                <CommentIcon className={styles.icon} /> {post.commentCount || 0}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.interactions}>
            <div className={styles.likes}>
              <LikeIcon className={styles.icon} /> {post.likeCount || 0}
            </div>
            <div className={`${styles.comments} ${styles.marginLeft}`}>
              <CommentIcon className={styles.icon} /> {post.commentCount || 0}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemoryCard;
