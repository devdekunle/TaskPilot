import React, { useState } from "react";
import "../styles/accordion.css";
import { BsCaretDownSquare } from "react-icons/bs";

const Accordion = ({ title, total, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToogle = () => setIsOpen(!isOpen);
  return (
    <div className={`accordion `}>
      <div className="accordion-header">
        <div className="accordion-toogle" onClick={handleToogle}>
          <BsCaretDownSquare className={`${isOpen && "angle"}`} />
        </div>
        <div className="accordion-title">
          <p>{title}</p> <span>({total})</span>
        </div>

        <div
          className={`accordion-body ${
            isOpen ? "accordion-open" : "accordion-close"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
