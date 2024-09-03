// 게시글 생성 (추억 올리기)
export const createPost = async (groupId, postData) => {
  try {
    const response = await fetch(`/api/groups/${groupId}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.message || "잘못된 요청입니다.");
      } else {
        throw new Error("게시글 생성에 실패했습니다.");
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};
