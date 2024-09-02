import React from "react";
import styles from "./GroupDetailPage.module.css";

function PrivateGroupDetail({ group }) {
  return (
    <div className={styles.groupDetail}>
      <h1>{group.name}</h1>
      <p>{group.introduction}</p>
      <div className={styles.posts}>
        <div className={styles.postList}>
          {group.posts ? (
            group.posts.map((post) => (
              <div key={post.id} className={styles.postCard}>
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className={styles.postImage}
                />
                <h3>{post.title}</h3>
                <p>{post.description}</p>
              </div>
            ))
          ) : (
            <p>추억이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PrivateGroupDetail;
