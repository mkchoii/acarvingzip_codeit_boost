import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MemoryCard from "../components/MemoryCard";
import styles from "./PrivateGroupDetail.module.css";
import noPostsImage from "../assets/emptyMemory.svg";

function PrivateGroupDetail({ group, memories, selectedFilter }) {
  const [visibleMemories, setVisibleMemories] = useState(8);
  const [filteredMemories, setFilteredMemories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const filterMemories = () => {
      const sortBy = {
        mostLiked: (a, b) => (b.likeCount || 0) - (a.likeCount || 0), // 공감순
        latest: (a, b) =>
          new Date(b.createdAt || 0) - new Date(a.createdAt || 0), // 최신순
        mostCommented: (a, b) => (b.commentCount || 0) - (a.commentCount || 0), // 댓글순 추가
      };

      const sortedMemories = [...memories].sort(
        sortBy[selectedFilter] || sortBy.mostLiked
      );
      setFilteredMemories(sortedMemories);
    };

    filterMemories();
  }, [selectedFilter, memories]);

  const handleLoadMore = () => {
    setVisibleMemories((prev) => prev + 8);
  };

  const handleMemoryClick = (postId) => {
    navigate(`/post/${postId}/access`);
  };

  // 추억 올리기 버튼 클릭 핸들러
  const handleUploadClick = () => {
    navigate(`/group/${group.id}/upload-memory`); // groupId를 사용하여 이동
  };

  return (
    <div className={styles.groupDetail}>
      <div className={styles.posts}>
        {filteredMemories.length > 0 ? (
          <>
            <div className={styles.postList}>
              {filteredMemories.slice(0, visibleMemories).map((post) => (
                <MemoryCard
                  key={post.id}
                  post={post}
                  isPublic={false}
                  onClick={handleMemoryClick}
                />
              ))}
            </div>
            {visibleMemories < filteredMemories.length && (
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
            <button className={styles.uploadButton} onClick={handleUploadClick}>
              추억 올리기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrivateGroupDetail;
