import React,{useState} from "react";
import styles from "./styles/SeatTest.module.css";

import Seats from "../components/Seat/Seats";
import SeatModal from "../components/Seat/SeatModal";

function SeatTest() {
  const [seatModalOpen, setSeatModalOpen] = useState(false);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);

  const openSeatModal = () => setSeatModalOpen(true);
  const closeSeatModal = () => {
    setSeatModalOpen(false);
    document.body.style.removeProperty("overflow");
  };

  const handleConfirmFromModal = (ids) => {
    setSelectedSeatIds(ids);
    // 필요하면 여기서 closeSeatModal() 호출해도 됨 (모달 내부에서도 close 호출 중)
  };

  return (
    <>
      <div className={styles.main}>
        <button onClick={openSeatModal}>test</button>
        <h2>선택된 좌석은 바로바로 ~~</h2>
        <h3>{selectedSeatIds.join(", ")}</h3>
        <Seats />
      </div>
      <SeatModal open={seatModalOpen} close={closeSeatModal} onConfirm={handleConfirmFromModal}/>
    </>
  );
}

export default SeatTest;