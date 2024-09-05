import React from "react";
import MemoryCard from "../components/MemoryCard"; // MemoryCard 컴포넌트 가져오기
import styles from "./PrivateGroupDetail.module.css";
import noPostsImage from "../assets/emptyMemory.svg"; // '게시된 추억이 없습니다'를 위한 이미지

function PrivateGroupDetail({ group, memories }) {
  return (
    <div className={styles.groupDetail}>
      <div className={styles.posts}>
        {/* 게시글이 있을 때와 없을 때를 구분 */}
        {memories.length > 0 ? (
          <div className={styles.postList}>
            {memories.map((post) => (
              <MemoryCard key={post.id} post={post} isPublic={false} />
            ))}
          </div>
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
