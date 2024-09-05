import React, { useState } from "react";
import MemoryCard from "../components/MemoryCard";
import styles from "./PublicGroupDetail.module.css";
import noPostsImage from "../assets/emptyMemory.svg";

function PublicGroupDetail({ group, memories }) {
  const [visibleMemories, setVisibleMemories] = useState(8); // 초기 상태로 10개의 메모리를 표시

  const handleLoadMore = () => {
    setVisibleMemories((prev) => prev + 8); // 더보기 버튼 클릭 시 10개씩 추가로 표시
  };

  return (
    <div className={styles.groupDetail}>
      <div className={styles.posts}>
        {memories.length > 0 ? (
          <>
            <div className={styles.postList}>
              {memories.slice(0, visibleMemories).map((post) => (
                <MemoryCard key={post.id} post={post} isPublic={true} />
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

export default PublicGroupDetail;
