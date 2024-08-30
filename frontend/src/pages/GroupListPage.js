import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import PublicGroupListPage from "./PublicGroupListPage";
import PrivateGroupListPage from "./PrivateGroupListPage";
import styles from "./GroupListPage.module.css";

function GroupListPage() {
  const [activeTab, setActiveTab] = useState(true); // 기본 탭은 공개 그룹 (true)
  const [searchTerm, setSearchTerm] = useState(""); // 검색어
  const [filter, setFilter] = useState("mostLiked"); // 기본 필터는 mostLiked (공감순)

  const handleTabChange = (isPublic) => {
    setActiveTab(isPublic);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (selectedFilter) => {
    console.log("Selected Filter in GroupListPage:", selectedFilter);
    setFilter(selectedFilter);
  };

  useEffect(() => {
    console.log("Filter in GroupListPage after update:", filter);
  }, [filter]);

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
        {activeTab ? (
          <PublicGroupListPage
            key={filter} // 필터가 바뀔 때마다 컴포넌트가 새로 마운트되도록 key를 설정
            searchTerm={searchTerm}
            filter={filter}
          />
        ) : (
          <PrivateGroupListPage searchTerm={searchTerm} filter={filter} />
        )}
      </div>
    </div>
  );
}

export default GroupListPage;
