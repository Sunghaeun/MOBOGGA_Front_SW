import React from "react";
import styles from "./Seat.module.css";
import clsx from "clsx";

function Seat({ id, reservation, selected, row, col, onClick }) {
  const isBooked = reservation === 1;
  const isSelected = selected === 1;

  const rowLabel = String.fromCharCode(64 + Number(row));

  return (
    <button
      type="button"
      className={clsx(
        styles.seat,
        isBooked && styles.booked,
        !isBooked && isSelected && styles.selected
      )}
      disabled={isBooked}
      aria-label={`Row ${row}, Col ${col}, ${isBooked ? "예약됨" : "선택 가능"}`}
      onClick={onClick}
    >
      {rowLabel}-{col}
    </button>
  );
}

export default Seat;
