import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import PublicGroupListPage from "./PublicGroupListPage";
import PrivateGroupListPage from "./PrivateGroupListPage";
import styles from "./GroupListPage.module.css";

function GroupListPage() {
  const [activeTab, setActiveTab] = useState("public");
  const [searchTerm, setSearchTerm] = useState("");
  const [publicFilter, setPublicFilter] = useState("mostLiked");
  const [privateFilter, setPrivateFilter] = useState("mostLiked");

  // 탭 변경 시 필터 상태 초기화
  useEffect(() => {
    setSearchTerm(""); // 검색어 초기화
  }, [activeTab]);

  const handleTabChange = (tab) => {
    console.log("탭 변경:", tab);
    setActiveTab(tab);
  };

  const handleSearchChange = (term) => {
    console.log("검색어 변경:", term);
    setSearchTerm(term);
  };

  const handleFilterChange = (selectedFilter) => {
    console.log("필터 변경:", selectedFilter, "활성 탭:", activeTab);
    if (activeTab === "public") {
      setPublicFilter(selectedFilter);
    } else if (activeTab === "private") {
      setPrivateFilter(selectedFilter);
    }
  };

  return (
    <div className={styles.groupListPage}>
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedFilter={activeTab === "public" ? publicFilter : privateFilter}
        onFilterChange={handleFilterChange}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <div className={styles.tabContent}>
        {activeTab === "public" ? (
          <PublicGroupListPage
            searchTerm={searchTerm}
            selectedFilter={publicFilter}
          />
        ) : (
          <PrivateGroupListPage
            searchTerm={searchTerm}
            selectedFilter={privateFilter}
          />
        )}
      </div>
    </div>
  );
}

export default GroupListPage;
