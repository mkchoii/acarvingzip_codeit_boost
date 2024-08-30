import React, { useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 임포트
import GroupCard from "../components/GroupCard";
import styles from "./PrivateGroupListPage.module.css";
import emptyGroupImage from "../assets/emptyGroup.svg"; // 이미지 파일 임포트
import mockGroups from "../api/mockGroups"; // 모크 그룹 데이터 가져오기

const initialState = {
  groups: [],
  loading: true,
  error: false,
  displayedGroups: [], // 페이지에 표시할 그룹들
  itemsToShow: 10, // 처음에 보여줄 항목 수
  allItemsLoaded: false, // 모든 항목이 로드되었는지 여부를 나타내는 플래그
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        loading: true,
        error: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        groups: action.payload,
        displayedGroups: action.payload.slice(0, state.itemsToShow),
        allItemsLoaded: action.payload.length <= state.itemsToShow,
      };
    case "LOAD_MORE":
      const moreItems = state.groups.slice(
        0,
        state.displayedGroups.length + action.payload
      );
      return {
        ...state,
        displayedGroups: moreItems,
        allItemsLoaded: moreItems.length >= state.groups.length,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
}

function PrivateGroupListPage({
  searchTerm = "",
  selectedFilter = "mostLiked",
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { groups, loading, error, displayedGroups, allItemsLoaded } = state;
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

  useEffect(() => {
    const fetchGroups = async () => {
      dispatch({ type: "FETCH_INIT" });
      console.log("PrivateGroupListPage 데이터 가져오기 시작");

      try {
        // 비공개 그룹만 필터링
        let fetchedGroups = mockGroups.filter((group) => !group.isPublic);
        console.log("비공개 그룹 필터링 후:", fetchedGroups);

        // 검색어 필터링
        if (searchTerm) {
          fetchedGroups = fetchedGroups.filter((group) =>
            group.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        const sortBy = {
          mostLiked: (a, b) => b.likeCount - a.likeCount,
          latest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          mostPosted: (a, b) => b.postCount - a.postCount,
          mostBadge: (a, b) => b.badgeCount - a.badgeCount,
        };

        const sortFunction = sortBy[selectedFilter] || sortBy.mostLiked;
        fetchedGroups.sort(sortFunction);
        console.log("정렬 후 그룹:", fetchedGroups);

        dispatch({ type: "FETCH_SUCCESS", payload: fetchedGroups });
      } catch (err) {
        console.error("그룹을 가져오는 중 오류 발생:", err);
        dispatch({ type: "FETCH_FAILURE" });
      }
    };

    fetchGroups();
  }, [selectedFilter, searchTerm]);

  const loadMoreItems = () => {
    dispatch({ type: "LOAD_MORE", payload: 8 });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorMessage}>
        그룹 목록을 불러오는 데 실패했습니다.
      </div>
    );
  }

  if (!groups.length) {
    return (
      <div className={styles.emptyState}>
        <img
          src={emptyGroupImage}
          alt="Empty group"
          className={styles.emptyImage}
        />
        <button
          className={styles.createButton}
          onClick={() => navigate("/create-group")} // 그룹 만들기 버튼 클릭 시 페이지 이동
        >
          그룹 만들기
        </button>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.groupList}>
        {displayedGroups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
      {!allItemsLoaded && (
        <button className={styles.loadMoreButton} onClick={loadMoreItems}>
          더보기
        </button>
      )}
    </div>
  );
}

export default PrivateGroupListPage;
