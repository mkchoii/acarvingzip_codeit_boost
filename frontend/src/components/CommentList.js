import React, { useEffect, useState, useCallback } from "react";
import Comment from "./Comment";
import CommentModal from "./CommentModal"; // 댓글 수정 모달
import GroupDeleteModal from "./GroupDeleteModal"; // 삭제 모달
import { deleteComment, fetchComments, updateComment } from "../api/commentApi"; // 댓글 삭제 및 조회 API 임포트

function CommentSection({ postId, reload, onDeleteComment, onEditComment }) {
  const [comments, setComments] = useState([]); // 댓글 목록
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 삭제 모달 상태
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 수정 모달 상태
  const [selectedCommentId, setSelectedCommentId] = useState(null); // 선택한 댓글 ID
  const [editingComment, setEditingComment] = useState(null); // 수정 중인 댓글
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 오류 상태
  const pageSize = 10; // 페이지당 댓글 수

  // useCallback으로 loadComments 메모이제이션
  const loadComments = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchComments(postId, page, pageSize);
        setComments(response.data);
        setLoading(false);
      } catch (err) {
        setError("댓글을 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    },
    [postId, pageSize]
  );

  // 페이지가 로드될 때 및 `reload`가 변경될 때 댓글 목록을 가져옴
  useEffect(() => {
    loadComments();
  }, [loadComments, reload]); // 의존성 배열에 `reload` 추가

  // 댓글 삭제 핸들러
  const handleDelete = async (password) => {
    try {
      // 댓글 삭제 API 호출
      await deleteComment(selectedCommentId, password);

      // 삭제 성공 시, 댓글 목록에서 해당 댓글 제거
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== selectedCommentId)
      );

      // 부모 컴포넌트에 삭제된 댓글을 알림
      if (onDeleteComment) {
        onDeleteComment();
      }

      // 모달 닫기
      setIsDeleteModalOpen(false);
    } catch (error) {
      alert("댓글 삭제에 실패했습니다. 비밀번호를 확인하세요.");
    }
  };

  // 댓글 수정 핸들러
  const handleEdit = async (nickname, content, password) => {
    try {
      // 댓글 수정 API 호출
      const updatedComment = await updateComment(selectedCommentId, {
        nickname,
        content,
        password,
      });

      // 수정된 댓글을 목록에서 업데이트
      if (updatedComment && updatedComment.id) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === selectedCommentId
              ? {
                  ...comment,
                  nickname: updatedComment.nickname,
                  content: updatedComment.content,
                }
              : comment
          )
        );

        // 수정 모달 닫기
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("댓글 수정 오류:", error);
    }
  };

  // 댓글 삭제 아이콘 클릭 시 모달 열기
  const handleDeleteClick = (commentId) => {
    setSelectedCommentId(commentId); // 삭제할 댓글 ID 설정
    setIsDeleteModalOpen(true); // 삭제 모달 열기
  };

  // 댓글 수정 아이콘 클릭 시 모달 열기
  const handleEditClick = (commentId) => {
    const commentToEdit = comments.find((comment) => comment.id === commentId);
    setSelectedCommentId(commentId); // 수정할 댓글 ID 설정
    setEditingComment(commentToEdit); // 수정할 댓글 데이터 설정
    setIsEditModalOpen(true); // 수정 모달 열기
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  console.error("댓글 수정 오류:", error);

  return (
    <div>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Comment
            key={comment.id}
            id={comment.id}
            nickname={comment.nickname}
            content={comment.content}
            createdAt={comment.createdAt}
            onDelete={handleDeleteClick} // 삭제 아이콘 클릭 시 삭제 모달 열기
            onEdit={handleEditClick} // 수정 아이콘 클릭 시 수정 모달 열기
          />
        ))
      ) : (
        <div>댓글이 없습니다.</div>
      )}

      {/* 삭제 모달 */}
      {isDeleteModalOpen && (
        <GroupDeleteModal
          title="댓글 삭제" // 모달 제목
          onClose={() => setIsDeleteModalOpen(false)} // 모달 닫기 핸들러
          onDelete={handleDelete} // 댓글 삭제 API 호출 핸들러
        />
      )}

      {/* 수정 모달 */}
      {isEditModalOpen && (
        <CommentModal
          postId={postId}
          onClose={() => setIsEditModalOpen(false)} // 모달 닫기 핸들러
          onAddComment={handleEdit} // 댓글 수정 API 호출 핸들러
          isEditing={true} // 수정 모드
          initialData={editingComment} // 수정할 댓글 데이터 전달
        />
      )}
    </div>
  );
}

export default CommentSection;
