import React, { useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GroupCard from "../components/GroupCard";
import styles from "./PrivateGroupListPage.module.css";
import emptyGroupImage from "../assets/emptyGroup.svg";
import { fetchGroups } from "../api/groupApi"; // 그룹 목록 조회 API 임포트

const initialState = {
  groups: [],
  loading: true,
  error: false,
  displayedGroups: [],
  page: 1, // 현재 페이지 번호
  itemsPerPage: 8, // 페이지당 아이템 수
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
        groups: action.payload, // 이전 데이터를 유지하지 않고 새로운 데이터로만 상태를 업데이트
        displayedGroups: action.payload.slice(
          0,
          state.page * state.itemsPerPage
        ),
        allItemsLoaded: action.payload.length < state.itemsPerPage,
      };
    case "LOAD_MORE":
      const moreItems = state.groups.slice(0, state.page * state.itemsPerPage);
      return {
        ...state,
        page: state.page + 1, // 페이지 증가
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
  const {
    groups,
    loading,
    error,
    displayedGroups,
    allItemsLoaded,
    page,
    itemsPerPage,
  } = state;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroupsData = async () => {
      console.log("PrivateGroupListPage 데이터 가져오기 시작");
      dispatch({ type: "FETCH_INIT" });

      try {
        // 그룹 목록 조회 API 호출, 비공개 그룹 필터링 (isPublic: false), 페이지당 8개씩 가져오기
        const response = await fetchGroups(
          page,
          itemsPerPage,
          selectedFilter,
          searchTerm,
          false
        );
        let fetchedGroups = response.data;

        // 검색어 필터링
        if (searchTerm) {
          fetchedGroups = fetchedGroups.filter((group) =>
            group.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // 비공개 그룹만 필터링 (중복 방지)
        fetchedGroups = fetchedGroups.filter((group) => !group.isPublic);

        // 필터에 따른 정렬
        const sortBy = {
          mostLiked: (a, b) => b.likeCount - a.likeCount,
          latest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
          mostPosted: (a, b) => b.postCount - a.postCount,
          mostBadge: (a, b) => b.badges.length - a.badges.length,
        };

        const sortFunction = sortBy[selectedFilter] || sortBy.mostLiked;
        fetchedGroups.sort(sortFunction);

        dispatch({ type: "FETCH_SUCCESS", payload: fetchedGroups });
      } catch (err) {
        console.error("그룹을 가져오는 중 오류 발생:", err);
        dispatch({ type: "FETCH_FAILURE" });
      }
    };

    fetchGroupsData();
  }, [selectedFilter, searchTerm, page, itemsPerPage]);

  const loadMoreItems = () => {
    dispatch({ type: "LOAD_MORE" });
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
