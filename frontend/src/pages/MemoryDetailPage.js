import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostDetail, likePost, deletePost } from "../api/postApi";
import { ReactComponent as LikeIcon } from "../assets/favicon_s.svg";
import { ReactComponent as CommentIcon } from "../assets/icon_bubble.svg";
import { ReactComponent as Logo } from "../assets/logo.svg";
import { ReactComponent as LikeButton } from "../assets/likeButton.svg";
import GroupDeleteModal from "../components/GroupDeleteModal";
import MemoryUpdateModal from "../components/MemoryUpdateModal";
import CommentModal from "../components/CommentModal";
import CommentList from "../components/CommentList";
import styles from "./MemoryDetailPage.module.css";

function MemoryDetailPage() {
  const { postId } = useParams();
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [reloadComments, setReloadComments] = useState(false); // reloadComments 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemoryDetail = async () => {
      try {
        const foundMemory = await getPostDetail(postId);
        setMemory(foundMemory);
        setLoading(false);
      } catch (err) {
        setError("게시글을 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    };
    fetchMemoryDetail();
  }, [postId]);

  const handleLike = async () => {
    try {
      await likePost(postId);
      setMemory((prevMemory) => ({
        ...prevMemory,
        likeCount: prevMemory.likeCount + 1,
      }));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDelete = async (password) => {
    try {
      await deletePost(postId, password);
      alert("게시글이 성공적으로 삭제되었습니다.");

      // groupId를 제대로 전달하여 GroupDetailPage로 이동
      navigate(`/group/${memory.groupId}`, { state: { reload: true } });
    } catch (error) {
      console.error("Error deleting post:", error);
      alert(error.message);
    }
  };

  const handleUpdateSuccess = (updatedData) => {
    setMemory(updatedData);
    setIsUpdateModalOpen(false);
  };

  // 댓글 추가 후 목록 재로드 핸들러
  const handleAddComment = () => {
    setMemory((prevMemory) => ({
      ...prevMemory,
      commentCount: prevMemory.commentCount + 1,
    }));
    setReloadComments((prev) => !prev); // reloadComments 상태 변경
  };

  // 댓글 삭제 후 목록 재로드 핸들러
  const handleDeleteComment = () => {
    setMemory((prevMemory) => ({
      ...prevMemory,
      commentCount: prevMemory.commentCount - 1,
    }));
    setReloadComments(!reloadComments); // reloadComments 상태 변경
  };

  // 댓글 수정 후 목록 재로드 핸들러
  const handleEditComment = () => {
    setReloadComments((prev) => !prev); // reloadComments 상태 변경
  };

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.memoryDetailContainer}>
      <header className={styles.header}>
        <Logo className={styles.logo} onClick={() => navigate("/")} />
      </header>
      <div className={styles.metaInfo}>
        <div className={styles.authorInfo}>
          <span className={styles.author}>{memory.nickname}</span> ・
          <span className={styles.visibility}>
            {memory.isPublic ? "공개" : "비공개"}
          </span>
        </div>
        <div className={styles.managementButtons}>
          <button
            className={styles.textButton}
            onClick={() => setIsUpdateModalOpen(true)}
          >
            추억 수정하기
          </button>
          <button
            className={styles.textButton}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            추억 삭제하기
          </button>
        </div>
      </div>
      <h1 className={styles.title}>{memory.title}</h1>
      <div className={styles.tags}>
        {(Array.isArray(memory.tags)
          ? memory.tags
          : memory.tags
          ? memory.tags.split(",")
          : []
        ).map((tag, index) => (
          <span key={index}>#{tag} </span>
        ))}
      </div>
      <div className={styles.interactionsWrapper}>
        <div className={styles.interactionsLeft}>
          <span className={styles.location}>{memory.location}</span>・
          <span className={styles.date}>{memory.moment}</span>
          <LikeIcon className={styles.icon} />
          <span className={styles.likeCount}>{memory.likeCount}</span>
          <CommentIcon className={styles.icon} />
          <span className={styles.commentCount}>{memory.commentCount}</span>
        </div>
        <div className={styles.interactionsRight}>
          <LikeButton className={styles.likeButton} onClick={handleLike} />
        </div>
      </div>
      <div className={styles.separator}></div>
      <div className={styles.content}>
        <img
          src={memory.imageUrl}
          alt={memory.title}
          className={styles.image}
        />
        <p className={styles.description}>{memory.content}</p>
      </div>
      <button
        className={styles.commentButton}
        onClick={() => setIsCommentModalOpen(true)}
      >
        댓글 등록하기
      </button>
      <div className={styles.commentSection}>
        <h2 className={styles.commentHeader}>
          <span>댓글</span>
          <span>{memory.commentCount}</span>
        </h2>
        <div className={styles.commentSeparator}></div>
        <CommentList
          postId={postId}
          reload={reloadComments}
          onDeleteComment={handleDeleteComment}
          onEditComment={handleEditComment}
        />
      </div>
      {isDeleteModalOpen && (
        <GroupDeleteModal
          title="추억 삭제"
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDelete}
        />
      )}
      {isUpdateModalOpen && (
        <MemoryUpdateModal
          onClose={() => setIsUpdateModalOpen(false)}
          onSave={handleUpdateSuccess}
        />
      )}
      {isCommentModalOpen && (
        <CommentModal
          postId={postId}
          onClose={() => setIsCommentModalOpen(false)}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
}

export default MemoryDetailPage;
