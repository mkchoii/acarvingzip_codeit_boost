import React, { useEffect, useState } from "react";
import { ReactComponent as PublicActiveIcon } from "../assets/public_active.svg";
import { ReactComponent as PublicInactiveIcon } from "../assets/public_inactive.svg";
import { ReactComponent as PrivateActiveIcon } from "../assets/private_active.svg";
import { ReactComponent as PrivateInactiveIcon } from "../assets/private_inactive.svg";
import { ReactComponent as SearchIcon } from "../assets/icon_search.svg";
import styles from "./SearchBar.module.css";
import Dropdown from "./Dropdown";

function SearchBar({
  searchTerm,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  activeTab,
  onTabChange,
}) {
  const sortOptions = [
    { label: "최신순", value: "latest" },
    { label: "게시물순", value: "mostPosted" },
    { label: "공감순", value: "mostLiked" },
    { label: "배지순", value: "mostBadge" },
  ];

  const [currentFilter, setCurrentFilter] = useState(
    selectedFilter || "mostLiked"
  );

  useEffect(() => {
    // selectedFilter가 변경되면 currentFilter를 업데이트
    if (selectedFilter && selectedFilter !== currentFilter) {
      setCurrentFilter(selectedFilter);
    }
  }, [selectedFilter, currentFilter]);

  useEffect(() => {
    // 필터와 탭 상태 초기화
    if (!selectedFilter) {
      onFilterChange("mostLiked");
    }
    if (activeTab === undefined) {
      onTabChange(true);
    }
  }, [selectedFilter, activeTab, onFilterChange, onTabChange]);

  const selectedOptionLabel =
    sortOptions.find((option) => option.value === currentFilter)?.label ||
    "공감순";

  return (
    <div className={styles.searchBar}>
      <div className={styles.tabs}>
        <div
          className={`${styles.tabButton} ${activeTab ? styles.activeTab : ""}`}
          onClick={() => onTabChange(true)}
        >
          {activeTab ? (
            <PublicActiveIcon className={styles.tabIcon} />
          ) : (
            <PublicInactiveIcon className={styles.tabIcon} />
          )}
        </div>
        <div
          className={`${styles.tabButton} ${
            !activeTab ? styles.activeTab : ""
          }`}
          onClick={() => onTabChange(false)}
        >
          {!activeTab ? (
            <PrivateActiveIcon className={styles.tabIcon} />
          ) : (
            <PrivateInactiveIcon className={styles.tabIcon} />
          )}
        </div>
      </div>

      <div className={styles.searchInputWrapper}>
        <SearchIcon className={styles.searchIcon} />
        <input
          type="text"
          placeholder="그룹명을 검색해 주세요"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <Dropdown
        options={sortOptions.map((option) => option.label)}
        selectedOption={selectedOptionLabel}
        onOptionSelect={(selectedLabel) => {
          const selectedValue =
            sortOptions.find((option) => option.label === selectedLabel)
              ?.value || "mostLiked";
          if (selectedValue !== currentFilter) {
            setCurrentFilter(selectedValue);
            onFilterChange(selectedValue); // 필터 변경 알림
          }
        }}
      />
    </div>
  );
}

export default SearchBar;
