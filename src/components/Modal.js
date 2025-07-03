import styles from "./styles/Modal.module.css";

const Modal = ({ isOpen, onClose, children, className }) => {
  if (!isOpen) return null;

  return (
    <div onClick={onClose} className={styles.modal_overlay}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${styles.modal} ${className ? className : ""}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
