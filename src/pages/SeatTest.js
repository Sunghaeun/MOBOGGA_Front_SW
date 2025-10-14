import React,{useState, useMemo} from "react";
import styles from "./styles/SeatTest.module.css";

import Seats from "../components/Seat/Seats";
import NotReservationSeatModal from "../components/Seat/NotReservationSeatModal";
import SeatModal from "../components/Seat/SeatModal";
import { idToCode} from "../utils/seatUtils";

function SeatTest() {
  const [notReservationSeatModalOpen, setNotReservationSeatModalOpen] = useState(false);
  const [seatModalOpen, setSeatModalOpen] = useState(false);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);

// 1) 예약 불가 좌석 지정 모달
  const openNotReservationSeatModal = () => setNotReservationSeatModalOpen(true);
  const closeNotReservationSeatModal = () => {
    setNotReservationSeatModalOpen(false);
    document.body.style.removeProperty("overflow");
  };

// 2) 예약 좌석 확인 모달
  const openSeatModal = () => setSeatModalOpen(true);
  const closeSeatModal = () => {
    setSeatModalOpen(false);
    document.body.style.removeProperty("overflow");
  };

  const handleConfirmFromModal = (ids) => {
    setSelectedSeatIds(ids);
    // 필요하면 여기서 closeSeatModal() 호출해도 됨 (모달 내부에서도 close 호출 중)
  };

  const selectedSeatCodes = useMemo(
    () => selectedSeatIds.map((id) => idToCode(id)).filter(Boolean),
    [selectedSeatIds]
  );

  return (
    <>
      <div className={styles.main}>
        <button onClick={openNotReservationSeatModal}>예약불가 좌석 설정</button>
        <button onClick={openSeatModal}>예약 좌석 위치</button>
        <h2>선택된 좌석의 인덱스 번호는 ~~</h2>
        <h3>{selectedSeatIds.join(", ")}</h3>
        <h2>변환된 좌석 번호 !!</h2>
        <h1>{selectedSeatCodes.join(", ")}</h1>
        <Seats />
      </div>
      <NotReservationSeatModal open={notReservationSeatModalOpen} close={closeNotReservationSeatModal} onConfirm={handleConfirmFromModal}/>
      <SeatModal open={seatModalOpen} close={closeSeatModal} onConfirm={handleConfirmFromModal}/>
    </>
  );
}

export default SeatTest;