// eslint-disable-next-line
import React,{useState, useEffect} from "react";
import RecruitingCard from "./RecruitingCard";
import styles from "./styles/RecruitingList.module.css";
import axios from "axios";
import { useNavigate} from "react-router-dom";



function RecruitingList() {
    const navigate = useNavigate();

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

  
  return (
    <>
      <div className={styles.recruitingList}>
        {recruiting.map((item, index) => (
          <RecruitingCard key={index} show={item} onClick={()=>navigate(`/recruiting/${item.recruitingId}`)}/>
        ))}
      </div>
    </>
  );
}

export default RecruitingList;
