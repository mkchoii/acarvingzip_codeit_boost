import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MemoryCard from "../components/MemoryCard";
import styles from "./PrivateGroupDetail.module.css";
import noPostsImage from "../assets/emptyMemory.svg";

function PrivateGroupDetail({ group, memories }) {
  const [visibleMemories, setVisibleMemories] = useState(8);
  const navigate = useNavigate();

  const handleLoadMore = () => {
    setVisibleMemories((prev) => prev + 8);
  };

  const handleMemoryClick = (postId) => {
    navigate(`/post/${postId}/access`); // 비공식 메모리 접근 권한 페이지로 이동
  };

  return (
    <div className={styles.groupDetail}>
      <div className={styles.posts}>
        {memories.length > 0 ? (
          <>
            <div className={styles.postList}>
              {memories.slice(0, visibleMemories).map((post) => (
                <MemoryCard
                  key={post.id}
                  post={post}
                  isPublic={false}
                  onClick={handleMemoryClick} // 클릭 핸들러 추가
                />
              ))}
            </div>
            {visibleMemories < memories.length && (
              <button
                className={styles.loadMoreButton}
                onClick={handleLoadMore}
              >
                더보기
              </button>
            )}
          </>
        ) : (
          <div className={styles.noPosts}>
            <img src={noPostsImage} alt="No posts" />
            <button className={styles.uploadButton}>추억 올리기</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrivateGroupDetail;
