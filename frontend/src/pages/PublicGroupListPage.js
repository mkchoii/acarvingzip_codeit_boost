import React, { useReducer, useEffect } from "react";
import GroupCard from "../components/GroupCard";
import styles from "./PublicGroupListPage.module.css";
import mockGroups from "../api/mockGroups";

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

function PublicGroupListPage({
  searchTerm = "",
  selectedFilter = "mostLiked",
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { groups, loading, error, displayedGroups, allItemsLoaded } = state;

  useEffect(() => {
    const fetchGroups = async () => {
      dispatch({ type: "FETCH_INIT" });

      try {
        let fetchedGroups = [...mockGroups];

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
        <img src="emptyGroup.svg" alt="Empty group" />
        <button className={styles.createButton}>그룹 만들기</button>
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

export default PublicGroupListPage;
