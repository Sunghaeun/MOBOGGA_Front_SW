import React, { useState, useEffect } from "react";
import ShowCard from "./ShowCard";
import styles from "./styles/ShowList.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import image1 from "../assets/mainTest/1.png";

function ShowList() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("전체");

  // 1) show 데이터 가져오기
  const [show, setShow] = useState([]);
  // const getShow = async () => {
  //   try {
  //     const res = await axios.get(`http://jinjigui.info:8080/attraction/list`);
  //     console.log("show 데이터 가져오기 성공");
  //     console.log(res.data.entireList);
  //     setShow(res.data);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const getShow = async () => {
    try {
      const res = await axios.get(
        `http://jinjigui.info:8080/attraction/list`
      );
      console.log("showlist 데이터 가져오기 성공");
      console.log(res.data.entireList);

      const converted = res.data.entireList.map((item) => {
        const [startDate, endDate] = item.period.split(" - ");

        return {
          id: item.id,
          name: item.title,
          clubID: item.club,
          startDate: startDate,
          endDate: endDate,
          tag: item.tag,
          category: item.category || "기타",
          photo: item.img?.trim() || image1, // 이미지 없을 경우 기본값 대체
        };
      });

      setShow(converted);
    } catch (err) {
      console.log("showlist 데이터 가져오기 실패");
      console.error(err);
    }
  };
  // 2) 페이지 로드되면 show값 불러옴

  useEffect(() => {
    getShow();
  }, []);

  //3) 가져온 데이터별 카테고리 별로 필터링
  // const filteredList =
  // selectedCategory === "전체"
  //   ? showList
  //   : showList.filter((item) => item.category === selectedCategory);
  const filteredList =
    selectedCategory === "전체"
      ? show
      : show.filter((item) => item.category === selectedCategory);

  return (
    <div className={styles.column}>
      <div className={styles.category}>
        {["전체", "공연", "즐길거리"].map((category, idx) => (
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

      <div className={styles.showlist}>
        {filteredList.map((item, index) => (
          <ShowCard
            key={`${item.title}-${item.clubID}-${index}`}
            show={item}
            className={styles.showCard}
            onClick={() => {
              const category = item.category;
              const id = item.id;

              if (category === "공연") {
                navigate(`/show/${id}`);
              } else if (category === "즐길거리") {
                navigate(`/entertain/${id}`);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default ShowList;
