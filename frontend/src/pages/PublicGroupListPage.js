import React, { useEffect, useState } from "react";
import GroupCard from "../components/GroupCard";
import styles from "./PublicGroupListPage.module.css";
import SearchBar from "../components/SearchBar";
import { fetchGroups } from "../api/groupApi"; // 실제 API 호출 함수

function PublicGroupListPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("latest"); // 기본 정렬 기준
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [isPublic, setIsPublic] = useState(true); // 공개/비공개 여부

  const loadGroups = async () => {
    setLoading(true);
    try {
      const response = await fetchGroups(
        currentPage,
        10,
        sortBy,
        searchTerm,
        isPublic
      );
      setGroups(response.data); // 서버로부터 받은 그룹 데이터 설정
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, [currentPage, sortBy, searchTerm, isPublic]);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (error) {
    return (
      <div className={styles.errorMessage}>
        그룹 목록을 불러오는 데 실패했습니다.
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className={styles.emptyState}>
        <img src="emptyGroup.svg" alt="Empty group" />
        <button className={styles.createButton}>그룹 만들기</button>
      </div>
    );
  }

  return (
    <div className={styles.groupList}>
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedFilter={sortBy}
        onFilterChange={setSortBy}
        activeTab={isPublic}
        onTabChange={setIsPublic}
      />
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
      <div className={styles.pagination}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          이전
        </button>
        <button
          disabled={groups.length < 10} // 만약 데이터가 페이지당 아이템 수보다 적다면 다음 버튼 비활성화
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default PublicGroupListPage;
