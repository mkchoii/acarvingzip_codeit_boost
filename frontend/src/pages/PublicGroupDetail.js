import React from "react";
import styles from "./PublicGroupDetail.module.css";
import noPostsImage from "../assets/emptyMemory.svg"; // '게시된 추억이 없습니다'를 위한 SVG 이미지

function PublicGroupDetail({ group }) {
  return (
    <div className={styles.groupDetail}>
      <div className={styles.posts}>
        {/* 게시글이 있을 때와 없을 때를 구분*/}
        {group.posts && group.posts.length > 0 ? (
          <div className={styles.postList}>
            {group.posts.map((post) => (
              <div key={post.id} className={styles.postCard}>
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className={styles.postImage}
                />
                <h3>{post.title}</h3>
                <p>{post.description}</p>
              </div>
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

export default PublicGroupDetail;
