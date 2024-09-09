import React, { useState } from "react";
import Comment from "./Comment";
import GroupDeleteModal from "./GroupDeleteModal"; // 삭제 모달 임포트
import { deleteComment } from "../api/commentApi"; // 댓글 삭제 API 임포트
import mockComments from "../api/mockComments"; // 가짜 댓글 데이터 사용

function CommentSection({ postId }) {
  const [comments, setComments] = useState(mockComments); // 댓글 목록
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 모달 상태
  const [selectedCommentId, setSelectedCommentId] = useState(null); // 선택한 댓글 ID

  // 댓글 삭제 핸들러
  const handleDelete = async (password) => {
    try {
      // 댓글 삭제 API 호출
      await deleteComment(selectedCommentId, password);

      // 삭제 성공 시, 댓글 목록에서 해당 댓글 제거
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== selectedCommentId)
      );

      // 모달 닫기
      setIsDeleteModalOpen(false);
    } catch (error) {
      alert("댓글 삭제에 실패했습니다. 비밀번호를 확인하세요.");
    }
  };

  // 댓글 삭제 아이콘 클릭 시 모달 열기
  const handleDeleteClick = (commentId) => {
    setSelectedCommentId(commentId); // 삭제할 댓글 ID 설정
    setIsDeleteModalOpen(true); // 삭제 모달 열기
  };

  return (
    <div>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          id={comment.id}
          nickname={comment.nickname}
          content={comment.content}
          createdAt={comment.createdAt}
          onDelete={handleDeleteClick} // 삭제 아이콘 클릭 시 삭제 모달 열기
        />
      ))}

      {/* 삭제 모달 */}
      {isDeleteModalOpen && (
        <GroupDeleteModal
          title="댓글 삭제" // 모달 제목
          onClose={() => setIsDeleteModalOpen(false)} // 모달 닫기 핸들러
          onDelete={handleDelete} // 댓글 삭제 API 호출 핸들러
        />
      )}
    </div>
  );
}

export default CommentSection;
