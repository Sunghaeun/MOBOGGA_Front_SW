import React, { useRef, useState, useEffect, useMemo } from "react";
import styles from "./styles/Dropdown.module.css";
import useDetectClose from "./useDetectClose";
import down from "../assets/Arrow.svg";

/*dropdown 사용법
    1. 원하는 페이지에 
    <Dropdown
        defaultValue=""
        options={["", "", "", ""]}
    />
    붙여 넣는다.
    2. defaultValue에는 기본으로 띄워지는 것을 넣는다.
    3. options에는 아래 들어갈 항목을 넣는다
    4. 끗
*/
function Dropdown({
  defaultValue = "",
  value, // 있으면 컨트롤드
  onChange, // onChange(e)로 호출됨
  options = [],
  placeholder = "카테고리",
  className = "",
  style,
}) {
  const dropDownRef = useRef(null);
  const [isOpen, setIsOpen] = useDetectClose(dropDownRef);

  // 컨트롤드 여부
  const isControlled = value !== undefined;

  // 내부 상태 (언컨트롤드일 때만 사용)
  const [innerValue, setInnerValue] = useState(
    isControlled ? "" : defaultValue ?? ""
  );

  // 외부 value/defaultValue 변화 동기화
  useEffect(() => {
    if (isControlled) return; // 컨트롤드는 내부값 무시
    setInnerValue(defaultValue ?? "");
  }, [defaultValue, isControlled]);

  // 실제 표시값
  const displayValue = isControlled ? value ?? "" : innerValue;

  const selectedClass =
    displayValue && displayValue !== placeholder ? styles.selected : "";

  const handleSelect = (option) => {
    if (!isControlled) setInnerValue(option);
    setIsOpen(false);
    // onChange(e) 형태로 전달
    onChange?.({ target: { value: option } });
  };

  // 옵션 10개 이상이면 스크롤 (이미 CSS에 있다면 생략 가능)
  const optionListClass = useMemo(
    () => `${styles.optionList} ${isOpen ? styles.open : ""}`,
    [isOpen]
  );

  return (
    <div className={`${styles.selectWrapper} ${className}`} style={style}>
      <div
        ref={dropDownRef}
        className={`${styles.selectBox} ${
          isOpen ? styles.open : ""
        } ${selectedClass}`}
        onClick={() => setIsOpen((o) => !o)}
      >
        <span className={styles.selected}>
          {displayValue || placeholder}
          {"  "}
          <img
            src={down}
            alt="down"
            className={`${styles.arrow} ${isOpen ? styles.rotate : ""} ${
              isOpen || (displayValue && displayValue !== placeholder)
                ? styles.arrowOpen
                : ""
            }`}
          />
        </span>

        <ul
          className={optionListClass}
          style={{ maxHeight: 240, overflowY: "auto" }}
        >
          {options.map((option, index) => (
            <li
              key={`${option}-${index}`}
              className={styles.optionItem}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(option);
              }}
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
