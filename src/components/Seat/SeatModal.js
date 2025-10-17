/* eslint-disable */
import styles from "./NotReservationSeatModal.module.css";
import React, { useState, useEffect } from "react";

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
        selected: 0,
      });
    }
  }
  return arr;
};

const SeatModal = ({ open, close, onConfirm, reservedSeats = [] }) => {
  const [seats, setSeats] = useState(() => makeSeats());

  const SEAT_PX = 36; // 좌석 한 칸
  const AISLE_WIDTH = 40; // 통로 폭

  useEffect(() => {
    let ignore = false;
    (async () => {
      // reservedSeats가 있으면 사용, 없으면 API 호출
      const ids =
        reservedSeats && reservedSeats.length > 0
          ? reservedSeats
          : null;

      const idSet = new Set(ids);
      if (ignore) return;
      setSeats((prev) =>
        prev.map((s) => ({ ...s, selected: idSet.has(s.id) ? 1 : 0 }))
      );
    })();
    return () => {
      ignore = true;
    };
  }, [reservedSeats]);

  return (
    <>
      <div
        className={open ? `${styles.openModal} ${styles.modal}` : styles.modal}
        onClick={close} // 모달 바깥 클릭 시 닫힘
      >
        {open && (
          <section onClick={(e) => e.stopPropagation()}>
            <main>
              <img
                className={styles.closeB}
                src={closeButton}
                alt="Close"
                onClick={close}
              />
              <div className={styles.topContainer}>
                <span>예약 좌석 위치</span>
                <p />
                <p />
              </div>

              <div className={styles.seatGrid}>
                <span>STAGE</span>
                <div
                  className={styles.grid}
                  style={{
                    gridTemplateColumns: `repeat(${AISLE_AFTER}, ${SEAT_PX}px) ${AISLE_WIDTH}px repeat(${
                      COLS - AISLE_AFTER
                    }, ${SEAT_PX}px)`,
                    gridAutoRows: `${SEAT_PX}px`,
                    gap: 8,
                  }}
                >
                  {seats.map((seat) => (
                    <div
                      key={seat.id}
                      style={{
                        gridRowStart: seat.row,
                        gridColumnStart: seat.gridCol,
                      }}
                    >
                      <Seat {...seat} />
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.bottomContainer}>
                <div className={styles.button} onClick={close}>
                  <span>확인</span>
                </div>
              </div>
            </main>
          </section>
        )}
      </div>
    </>
  );
};

export default SeatModal;
