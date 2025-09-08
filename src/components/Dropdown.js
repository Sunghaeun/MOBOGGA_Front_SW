import React, { useRef, useState, useEffect } from "react";
import styles from "./styles/Dropdown.module.css";
import useDetectClose from "./useDetectClose";
import down from "../assets/Arrow.svg";

function Dropdown({
  options = [],
  defaultValue = "",
  value, // 제어 모드 값
  onChange, // 제어 모드 변경 콜백
  className = "",
  style,
}) {
  const dropDownRef = useRef(null);
  const [isOpen, setIsOpen] = useDetectClose(dropDownRef);

  // 비제어 모드용 내부 상태
  const [innerValue, setInnerValue] = useState(defaultValue);

  // 표시할 값: 제어 모드면 value, 아니면 내부 상태
  const displayValue = value !== undefined ? value : innerValue;

  // defaultValue가 바뀌었고, 제어 모드가 아니라면 내부값 초기화
  useEffect(() => {
    if (value === undefined) setInnerValue(defaultValue);
  }, [defaultValue, value]);

  const handleSelect = (option) => {
    // 제어 모드: 부모에게 전달
    if (onChange) onChange(option);
    // 비제어 모드: 내부 상태 업데이트
    if (value === undefined) setInnerValue(option);
    setIsOpen(false);
  };

  const handleToggle = () => setIsOpen((o) => !o);

  return (
    <div className={`${styles.selectWrapper} ${className}`} style={style}>
      <div
        ref={dropDownRef}
        className={`${styles.selectBox} ${isOpen ? styles.open : ""} ${
          displayValue !== "카테고리" ? styles.selected : ""
        }`}
        onClick={handleToggle}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleToggle();
          if (e.key === "Escape") setIsOpen(false);
        }}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={styles.selected}>
          {displayValue || defaultValue || "선택"}
          {"  "}
          <img
            src={down}
            alt="down"
            className={`${styles.arrow} ${isOpen ? styles.rotate : ""} ${
              isOpen ? styles.arrowOpen : ""
            } ${displayValue !== "카테고리" ? styles.arrowOpen : ""}`}
          />
        </span>

        <ul
          className={`${styles.optionList} ${isOpen ? styles.open : ""}`}
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option}
              className={styles.optionItem}
              role="option"
              aria-selected={option === displayValue}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(option);
              }}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dropdown;
