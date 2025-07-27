import React, { useState, useEffect } from "react";
import ShowCard from "./ShowCard";
import styles from "./styles/ShowList.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import image1 from "../assets/mainTest/1.png";

function ShowList() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [show, setShow] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("새로 만들기");

// 1) show 데이터 가져오기
  const getShow = async () => {
    try {
      const res = await axios.get(`https://jinjigui.info:443/attraction/list`);
      const converted = res.data.entireList.map((item) => {
        const [startDate, endDate] = item.period.split(" - ");
        return {
          id: item.id,
          name: item.title,
          clubID: item.club,
          startDate,
          endDate,
          tag: item.tag,
          category: item.category || "기타",
          photo: item.img?.trim() || image1,
        };
      });
      setShow(converted);
    } catch (err) {
      console.log("데이터 실패", err);
    }
  };

// 2) 페이지 로드되면 show값 불러옴
  useEffect(() => {
    getShow();
  }, []);

//3) 가져온 데이터별 카테고리 별로 필터링
  const filteredList =
    selectedCategory === "전체"
      ? show
      : show.filter((item) => item.category === selectedCategory);

  return (
    <div className={styles.column}>
      <div className={styles.buttons}>
        <div className={styles.category}>
          {["전체", "공연", "체험", "스트릿공연", "먹거리", "예배"].map((category, idx) => (
            <div
              key={idx}
              className={
                selectedCategory === category
                  ? styles.activeCategory
                  : styles.inactiveCategory
              }
              onClick={() => setSelectedCategory(category)}
            >
              <span>{category}</span>
            </div>
          ))}
        </div>
        
        {/* 드롭다운 !! */}
        {dropdownOpen && (
          <div
            className={styles.dimmed}
            onClick={() => setDropdownOpen(false)} // 바깥 클릭 시 드롭다운 닫기
          />
        )}
        
        <div className={styles.selectBox2}>

          <button
            className={styles.label}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {dropdownValue}
            <span style={{ marginLeft: "8px" }}>
              {dropdownOpen ? (
                // 열려있을 때 위쪽 화살표
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="9" viewBox="0 0 8 9" fill="none">
                  <path d="M4.35355 0.146447C4.15829 -0.0488155 3.84171 -0.0488156 3.64645 0.146447L0.464466 3.32843C0.269204 3.52369 0.269204 3.84027 0.464466 4.03553C0.659728 4.2308 0.976311 4.2308 1.17157 4.03553L4 1.20711L6.82843 4.03553C7.02369 4.2308 7.34027 4.2308 7.53553 4.03553C7.7308 3.84027 7.7308 3.52369 7.53553 3.32843L4.35355 0.146447ZM4 0.5L3.5 0.5L3.5 8.5L4 8.5L4.5 8.5L4.5 0.5L4 0.5Z" fill="#FBFBFB"/>
                </svg>
              ) : (
                // 닫혀있을 때 아래쪽 화살표
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="9" viewBox="0 0 8 9" fill="none">
                  <path d="M3.64645 8.85355C3.84171 9.04882 4.15829 9.04882 4.35355 8.85355L7.53553 5.67157C7.7308 5.47631 7.7308 5.15973 7.53553 4.96447C7.34027 4.7692 7.02369 4.7692 6.82843 4.96447L4 7.79289L1.17157 4.96447C0.976311 4.7692 0.659728 4.7692 0.464466 4.96447C0.269204 5.15973 0.269204 5.47631 0.464466 5.67157L3.64645 8.85355ZM4 0.5L3.5 0.5L3.5 8.5L4 8.5L4.5 8.5L4.5 0.5L4 0.5Z" fill="#FBFBFB"/>
                </svg>
              )}
            </span>
          </button>

          <ul
            className={styles.optionList}
            style={{ maxHeight: dropdownOpen ? '500px' : '0px' }}
          >
            {["볼거리 새로 만들기", "공연 새로 만들기", "즐길거리 새로 만들기"].map(
              (option, idx) => (
                <li
                  key={idx}
                  className={styles.optionItem}
                  onClick={() => {
                    setDropdownValue(option);
                    setDropdownOpen(false);
                  }}
                >
                  {option}
                </li>
              )
            )}
          </ul>
        </div>

      </div>

      <div className={styles.showlist}>
        {filteredList.map((item, index) => (
          <ShowCard
            key={`${item.title}-${item.clubID}-${index}`}
            show={item}
            className={styles.showCard}
            onClick={() => {
              const { category, id } = item;
              if (category === "공연") navigate(`/show/${id}`);
              else if (category === "즐길거리") navigate(`/entertain/${id}`);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ShowList;
