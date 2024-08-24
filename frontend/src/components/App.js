import { useState } from "react";
import "./App.module.css";
import "./App.font.css";
import GNB from "./GNB";
import SearchBar from "./SearchBar";
import PublicGroupListPage from "../pages/PublicGroupListPage";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("공감순");
  const [activeTab, setActiveTab] = useState("public");

  // 검색어 변경 핸들러
  const handleSearchChange = (term) => setSearchTerm(term);

  // 필터 변경 핸들러
  const handleFilterChange = (filter) => setSelectedFilter(filter);

  // 탭 변경 핸들러
  const handleTabChange = (tab) => setActiveTab(tab);

  return (
    <>
      <GNB />
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <PublicGroupListPage
        searchTerm={searchTerm}
        selectedFilter={selectedFilter}
        activeTab={activeTab}
      />
    </>
  );
}

export default App;
