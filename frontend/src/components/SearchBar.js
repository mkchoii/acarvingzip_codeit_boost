import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  // sortOptions 배열을 useMemo로 메모이제이션
  const sortOptions = useMemo(
    () => [
      { label: "최신순", value: "latest" },
      { label: "게시물순", value: "mostPosted" },
      { label: "공감순", value: "mostLiked" },
      { label: "배지순", value: "mostBadge" },
    ],
    []
  );

  const [currentFilter, setCurrentFilter] = useState("mostLiked");

  // 필터가 변경될 때 currentFilter를 업데이트
  useEffect(() => {
    if (selectedFilter !== currentFilter) {
      setCurrentFilter(selectedFilter || "mostLiked");
    }
  }, [selectedFilter, currentFilter]);

  // 현재 탭이 변경될 때 searchTerm과 currentFilter를 초기화
  useEffect(() => {
    setCurrentFilter("mostLiked");
    onSearchChange(""); // 검색어 초기화
  }, [activeTab, onSearchChange]);

  // 필터 옵션을 선택할 때
  const handleOptionSelect = useCallback(
    (selectedLabel) => {
      const selectedValue =
        sortOptions.find((option) => option.label === selectedLabel)?.value ||
        "mostLiked";
      if (selectedValue !== currentFilter) {
        setCurrentFilter(selectedValue);
        onFilterChange(selectedValue); // 필터 변경 함수 호출
      }
    },
    [currentFilter, onFilterChange, sortOptions] // 'sortOptions'는 useMemo로 안정화됨
  );

  const selectedOptionLabel =
    sortOptions.find((option) => option.value === currentFilter)?.label ||
    "공감순";

  return (
    <div className={styles.searchBar}>
      <div className={styles.tabs}>
        <div
          className={`${styles.tabButton} ${
            activeTab === "public" ? styles.activeTab : ""
          }`}
          onClick={() => onTabChange("public")}
        >
          {activeTab === "public" ? (
            <PublicActiveIcon className={styles.tabIcon} />
          ) : (
            <PublicInactiveIcon className={styles.tabIcon} />
          )}
        </div>
        <div
          className={`${styles.tabButton} ${
            activeTab === "private" ? styles.activeTab : ""
          }`}
          onClick={() => onTabChange("private")}
        >
          {activeTab === "private" ? (
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
        onOptionSelect={handleOptionSelect}
      />
    </div>
  );
}

export default SearchBar;
