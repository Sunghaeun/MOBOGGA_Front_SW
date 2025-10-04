/* eslint-disable */
import styles from "./SeatModal.module.css";
import React, { useState } from "react";

import closeButton from "../../assets/modal/x.svg";
import Seat from "./Seat";

const ROWS = 12;
const COLS = 12;
const AISLE_AFTER = 6; // 6열 뒤에 통로

const makeSeats = () => {
  let id = 1;
  const arr = [];
  for (let r = 1; r <= ROWS; r++) {
    for (let c = 1; c <= COLS; c++) {
      const gridCol = c > AISLE_AFTER ? c + 1 : c; // 통로 고려한 컬럼
      arr.push({
        id: id++,
        row: r,
        col: c,
        gridCol,       
        reservation: 0,
        selected: 0
      });
    }
  }
  return arr;
};


const SeatModal = (props) => {
  const { open, close } = props;
  const [seats, setSeats] = useState(() => makeSeats());
  const [selectedSeats, setSelectedSeats] = useState([]);

  const SEAT_PX = 36;      // 좌석 한 칸
  const AISLE_WIDTH = 40;  // 통로 폭

  const handleSeatClick = (id) => {
    setSeats(prev =>
      prev.map(seat =>
        seat.id === id
          ? { ...seat, selected: seat.selected === 1 ? 0 : 1 }
          : seat
      )
    );
  };

  const handleConfirm = () => {
    const selectedSeats = seats
      .filter((s) => s.selected === 1)
      .map((s) => s.id);

    setSelectedSeats(selectedSeats);
    // 부모에도 넘기고 싶다면 props로 콜백 받아서 전달
    // props.onConfirm && props.onConfirm(selectedIds);
    //콘솔 확인
    console.log(selectedSeats);
    close();
  };

  return (
    <>
    <div 
      className={open ? `${styles.openModal} ${styles.modal}` : styles.modal} 
      onClick={close} // 모달 바깥 클릭 시 닫힘
    >
      {open && props !== null ? (
        <section onClick={(e) => e.stopPropagation()}>
          <main>
            <img className={styles.closeB} src={closeButton} alt="Close" onClick={close}/>
            <div className={styles.topContainer}>
              <span>예매 불가 좌석 설정</span>
              <p>지정석, 시야제한석 등 예매가 불가능한 좌석을 선택해주세요.</p>
            </div>

            <div className={styles.seatGrid}>
              <span>STAGE</span>
              <div
                className={styles.grid}
                style={{
                  gridTemplateColumns:
                    `repeat(${AISLE_AFTER}, ${SEAT_PX}px) ${AISLE_WIDTH}px repeat(${COLS - AISLE_AFTER}, ${SEAT_PX}px)`,
                  gridAutoRows: `${SEAT_PX}px`,
                  gap: 8
                }}
              >
                {seats.map(seat => (
                  <div
                    key={seat.id}
                    style={{ gridRowStart: seat.row, gridColumnStart: seat.gridCol }} 
                  >
                    <Seat {...seat} onClick={() => handleSeatClick(seat.id)} />
                  </div>
                ))}
              </div>
            </div>


            <div className={styles.bottomContainer}>
              <div className={styles.button} onClick={handleConfirm}>
                <span>선택완료</span>
              </div>
            </div>
          </main>
        </section>
      ) : null}
    </div>

        </>
  );
};

export default SeatModal;
