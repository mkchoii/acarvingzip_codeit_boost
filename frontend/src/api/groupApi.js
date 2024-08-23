// 그룹 등록
export const createGroup = async (groupData) => {
  try {
    const response = await fetch("/api/groups", {
      method: "POST",
      body: groupData,
    });

    if (!response.ok) {
      throw new Error("그룹 생성에 실패했습니다.");
    }

    return await response.json(); // 서버로부터 성공 메시지 등을 받을 수 있음
  } catch (error) {
    console.error("Error:", error);
    throw error; // 상위 컴포넌트에서 에러를 처리할 수 있게 함
  }
};
