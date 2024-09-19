// 댓글 등록
export const registerComment = async (postId, commentData) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/posts/${postId}/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData), // commentData는 nickname, content, password가 포함
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 400) {
        throw new Error(errorData.message || "잘못된 요청입니다.");
      }
      throw new Error("댓글 등록에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error registering comment:", error);
    throw error;
  }
};

// 댓글 목록 조회
export const fetchComments = async (postId, page, pageSize) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    const response = await fetch(
      `${
        process.env.REACT_APP_API_URL
      }/api/posts/${postId}/comments?${queryParams.toString()}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 400) {
        throw new Error(errorData.message || "잘못된 요청입니다.");
      }
      throw new Error("댓글 목록 조회에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// 댓글 수정
export const updateComment = async (commentId, commentData) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/comments/${commentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 400) {
        throw new Error(errorData.message || "잘못된 요청입니다.");
      } else if (response.status === 403) {
        throw new Error(errorData.message || "비밀번호가 틀렸습니다.");
      } else if (response.status === 404) {
        throw new Error(errorData.message || "존재하지 않습니다.");
      }
      throw new Error("댓글 수정에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

// 댓글 삭제
export const deleteComment = async (commentId, password) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 400) {
        throw new Error(errorData.message || "잘못된 요청입니다.");
      } else if (response.status === 403) {
        throw new Error(errorData.message || "비밀번호가 틀렸습니다.");
      } else if (response.status === 404) {
        throw new Error(errorData.message || "존재하지 않습니다.");
      }
      throw new Error("댓글 삭제에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
