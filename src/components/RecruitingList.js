// eslint-disable-next-line
import React,{useState, useEffect} from "react";
import RecruitingCard from "./RecruitingCard";
import styles from "./styles/RecruitingList.module.css";
import axios from "axios";
import { useNavigate} from "react-router-dom";



function RecruitingList() {
    const navigate = useNavigate();

    const [selectedCategory, setSelectedCategory] = useState("전체");
    

    // 1) recruiting 데이터 가져오기 
    const [recruiting, setRecruiting] = useState([]);
    const getRecruiting = async () => {
      try {
        const res = await axios.get(`http://jinjigui.info:8080/recruiting/list`);
        console.log("recruiting 데이터 가져오기 성공");
        console.log(res.data);
        setRecruiting(res.data.recruitingList);
      } catch (err) {
        console.error(err);
      }
    }; 
    // 2) 페이지 로드되면 recruiting값 불러옴
    
    useEffect(() => {
      getRecruiting();
    }, []);   

    //3) 가져온 데이터별 카테고리 별로 필터링
    const filteredList =
      selectedCategory === "전체"
        ? recruiting
        : recruiting.filter((item) => item.category === selectedCategory);

  
  return (
    <div className={styles.column}>
      <span className={styles.title}>카테고리</span>
      <div className={styles.buttons}>
          <div className={styles.category}>
            {["전체", "정기모집", "추가모집", "상시모집"].map((category, idx) => (
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

          <div className={styles.createButton}>
            <span>리쿠르팅 새로 만들기</span>
          </div>
        </div>

      <div className={styles.recruitingList}>
        {filteredList.map((item, index) => (
          <RecruitingCard key={index} show={item} onClick={()=>navigate(`/recruiting/${item.recruitingId}`)}/>
        ))}
      </div>
    </div>
  );
}

export default RecruitingList;
