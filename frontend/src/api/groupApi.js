// 그룹 등록
export const createGroup = async (groupData) => {
  try {
    const response = await fetch("/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(groupData), // JSON 문자열로 변환하여 전송
    });

    if (!response.ok) {
      const errorText = await response.text(); // 응답이 JSON이 아니면 텍스트로 에러 확인
      console.error("Error response:", errorText);
      throw new Error("그룹 생성에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
// 그룹 목록 조회
export const fetchGroups = async (
  page,
  pageSize,
  sortBy,
  keyword,
  isPublic
) => {
  try {
    const queryParams = new URLSearchParams({
      page,
      pageSize,
      sortBy,
      keyword,
      isPublic,
    });

    const response = await fetch(`/api/groups?${queryParams.toString()}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("그룹 목록 조회에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
