/* eslint-disable */
// components/Dropdown.jsx
import React, { useRef, forwardRef, useImperativeHandle } from "react";
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
const Dropdown = forwardRef(function Dropdown(
  {
    defaultValue,
    options,
    name,                 // ← 추가
    value,                // ← 추가 (제어)
    onChange,             // ← 추가 (제어)
    className = "",
    style,
  },
  ref
) {
  const innerRef = useRef(null);
  useImperativeHandle(ref, () => innerRef.current);

  const [isOpen, setIsOpen] = useDetectClose(innerRef);

  const displayValue = value || defaultValue; // 값 없을 때 placeholder 출력

  const handleSelect = (option, e) => {
    e?.stopPropagation?.();
    setIsOpen(false);
    // 부모 onChangeInput과 동일한 인터페이스로 전달
    onChange?.({ target: { name, value: option } });
  };

  return (
    <div className={`${styles.selectWrapper} ${className}`} style={style}>
      <div
        ref={innerRef}
        className={`${styles.selectBox} ${isOpen ? styles.open : ""} ${
          displayValue && displayValue !== "카테고리" ? styles.selected : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.selected}>
          {displayValue}
          {"  "}
          <img
            src={down}
            alt="down"
            className={`${styles.arrow} ${isOpen ? styles.rotate : ""} ${
              isOpen ? styles.arrowOpen : ""
            } ${displayValue && displayValue !== "카테고리" ? styles.arrowOpen : ""}`}
          />
        </span>

        <ul className={`${styles.optionList} ${isOpen ? styles.open : ""}`}>
          {options.map((option, index) => (
            <li
              key={index}
              className={styles.optionItem}
              onClick={(e) => handleSelect(option, e)}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

export default Dropdown;
