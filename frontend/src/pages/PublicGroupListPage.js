import React, { useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GroupCard from "../components/GroupCard";
import styles from "./PublicGroupListPage.module.css";
import emptyGroupImage from "../assets/emptyGroup.svg";
import mockGroups from "../api/mockGroups";

const initialState = {
  groups: [],
  loading: true,
  error: false,
  displayedGroups: [],
  itemsToShow: 10,
  allItemsLoaded: false,
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      console.log("PublicGroupListPage 데이터 가져오기 시작");
      dispatch({ type: "FETCH_INIT" });

      try {
        let fetchedGroups = mockGroups.filter((group) => group.isPublic);
        console.log("공개 그룹 필터링 후:", fetchedGroups);

        if (searchTerm) {
          fetchedGroups = fetchedGroups.filter((group) =>
            group.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          console.log("검색어 필터링 후:", fetchedGroups);
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
          onClick={() => navigate("/create-group")}
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

export default PublicGroupListPage;
