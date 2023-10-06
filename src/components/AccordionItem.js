import { createRef, useEffect, useState } from "react";
import { Collapse } from 'bootstrap';

export default function AccordionItem({ children, title }) {
  const item = createRef();
  const [collapse, setCollapse] = useState(null);

  useEffect(() => {
    if (item.current == null || collapse != null) return;
    setCollapse(new Collapse(item.current));
  }, [item, collapse])
  
  return (
    <>
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button className="accordion-button collapsed" onClick={() => collapse.toggle()}>
            { title }
          </button>
        </h2>
        <div className="accordion-collapse" ref={item}>
          <div className="accordion-body">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}

