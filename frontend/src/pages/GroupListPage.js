import React, { useState } from "react";
import SearchBar from "./SearchBar"; // SearchBar 컴포넌트
import PublicGroupListPage from "./PublicGroupListPage"; // 공개 그룹 목록 페이지 컴포넌트
import PrivateGroupListPage from "./PrivateGroupListPage"; // 비공개 그룹 목록 페이지 컴포넌트
import styles from "./GroupListPage.module.css"; // CSS 모듈

function GroupListPage() {
  const [activeTab, setActiveTab] = useState("public"); // 기본 탭은 공개 그룹
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [filter, setFilter] = useState("공감순"); // 기본 필터는 공감순

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  return (
    <div className={styles.groupListPage}>
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedFilter={filter}
        onFilterChange={handleFilterChange}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <div className={styles.tabContent}>
        {activeTab === "public" ? (
          <PublicGroupListPage searchTerm={searchTerm} filter={filter} />
        ) : (
          <PrivateGroupListPage searchTerm={searchTerm} filter={filter} />
        )}
      </div>
    </div>
  );
}

export default GroupListPage;
