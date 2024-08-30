import React, { useState } from "react";
import styles from "./Dropdown.module.css";

function Dropdown({ options, selectedOption, onOptionSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    onOptionSelect(option);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <button onClick={handleDropdownClick} className={styles.dropdownButton}>
        {selectedOption} <span className={styles.arrow}>▼</span>
      </button>
      {isOpen && (
        <ul className={styles.dropdownMenu}>
          {options.map((option) => (
            <li
              key={option}
              className={styles.dropdownItem}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
