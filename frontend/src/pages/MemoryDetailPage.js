import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import mockMemory from "../api/mockMemory"; // mock 데이터
import { ReactComponent as LikeIcon } from "../assets/favicon_s.svg";
import { ReactComponent as CommentIcon } from "../assets/icon_bubble.svg";
import { ReactComponent as Logo } from "../assets/logo.svg"; // 로고 추가
import { ReactComponent as LikeButton } from "../assets/likeButton.svg"; // 공감 보내기 버튼용 SVG
import GroupDeleteModal from "../components/GroupDeleteModal";
import MemoryUpdateModal from "../components/MemoryUpdateModal"; // 수정 모달 임포트
// import { getPostDetail, likePost, deletePost } from "../api/postApi"; // getPostDetail만 주석 처리
import { likePost, deletePost } from "../api/postApi"; // 공감, 삭제는 API 사용
import styles from "./MemoryDetailPage.module.css";

function MemoryDetailPage() {
  const { postId } = useParams();
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // 수정 모달 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemoryDetail = async () => {
      try {
        // const foundMemory = await getPostDetail(postId); // 실제 API 호출 (주석 처리)
        const foundMemory = mockMemory.find(
          (memory) => memory.id === parseInt(postId)
        );
        if (!foundMemory) {
          throw new Error("게시글을 찾을 수 없습니다.");
        }
        setMemory(foundMemory);
        setLoading(false);
      } catch (err) {
        setError("게시글을 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    };
    fetchMemoryDetail();
  }, [postId]);

  // 공감 보내기 처리 함수
  const handleLike = async () => {
    try {
      await likePost(postId); // 공감 API 호출
      setMemory((prevMemory) => ({
        ...prevMemory,
        likeCount: prevMemory.likeCount + 1, // 공감 수 업데이트
      }));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // 게시글 삭제 처리 함수
  const handleDelete = async (password) => {
    try {
      await deletePost(postId, password); // 삭제 API 호출
      alert("게시글이 성공적으로 삭제되었습니다.");
      navigate("/group/:groupId"); // 삭제 후 리다이렉트
    } catch (error) {
      alert(error.message);
    }
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
            onClick={() => setIsUpdateModalOpen(true)} // 수정 모달 열기
          >
            추억 수정하기
          </button>
          <button
            className={styles.textButton}
            onClick={() => setIsDeleteModalOpen(true)} // 삭제 모달 열기
          >
            추억 삭제하기
          </button>
        </div>
      </div>
      <h1 className={styles.title}>{memory.title}</h1>
      <div className={styles.tags}>
        {memory.tags.map((tag, index) => (
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
          {/* LikeButton 자체에 onClick 이벤트 추가 */}
          <LikeButton className={styles.likeButton} onClick={handleLike} />
        </div>
      </div>
      <div className={styles.separator}></div> {/* 회색 선 추가 */}
      <div className={styles.content}>
        <img
          src={memory.imageUrl}
          alt={memory.title}
          className={styles.image}
        />
        <p className={styles.description}>{memory.content}</p>
      </div>
      <button className={styles.commentButton}>댓글 등록하기</button>
      <div className={styles.commentSection}>
        <h2 className={styles.commentHeader}>
          <span>댓글</span>
          <span>{memory.commentCount}</span>
        </h2>
        <div className={styles.commentSeparator}></div>
        <ul className={styles.commentList}>{/* 여기에 댓글 데이터 */}</ul>
      </div>
      {isDeleteModalOpen && (
        <GroupDeleteModal
          title="추억 삭제"
          onClose={() => setIsDeleteModalOpen(false)} // 모달 닫기
          onDelete={handleDelete} // 삭제 처리 함수 연결
        />
      )}
      {isUpdateModalOpen && (
        <MemoryUpdateModal
          postId={postId}
          initialData={memory} // 게시글 데이터를 모달로 전달
          onClose={() => setIsUpdateModalOpen(false)} // 모달 닫기
          onSuccess={() => {
            alert("게시글이 성공적으로 수정되었습니다.");
            window.location.reload(); // 페이지 새로고침
          }}
        />
      )}
    </div>
  );
}

export default MemoryDetailPage;
