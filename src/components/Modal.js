import React from "react";
import "../styles/modal.css";
import { FaTimes } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "-30vh",
    opacity: 1,
    transition: { delay: 0.5 },
  },
};

const Modal = ({ modalContent, isOpen, onClose }) => {
  const handlePropagation = (e) => {
    const target = e.target;
    if (!target.classList.contains("modal-container")) {
      e.stopPropagation();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            variants={backdrop}
            initial="hidden"
            animate="visible"
            className="modal-container"
            exit="hidden"
            onClick={onClose}
          >
            <motion.div
              exit="hidden"
              className="modal_body"
              variants={modal}
              initial="hidden"
              animate="visible"
              onClick={handlePropagation}
            >
              <div className="dismiss_btn" onClick={onClose}>
                <FaTimes />
              </div>
              {modalContent}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
