import React from "react";
import "../styles/mini-modal.css";

const MiniModal = ({
  className,
  miniModalContent,
  miniModalOpen,
  closeMiniModal,
}) => {
  return (
    <>
      {miniModalOpen && (
        <div className={className}>
          <div className="mini-modal-body">{miniModalContent}</div>
        </div>
      )}
    </>
  );
};

export default MiniModal;
