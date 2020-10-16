import React, { useEffect, useCallback, useRef, memo } from "react";
import PropTypes from "prop-types";

import printTemplate from "./template";

function PrintContent({ open, children, oncChangeStatus }) {
  const windowRef = useRef(window);
  const inputEl = useRef(null);

  const closeWindow = useCallback(() => {
    if (windowRef.current) {
      windowRef.current.close();
      windowRef.current = null;

      oncChangeStatus({
        eventType: "PrintWindow",
        eventAction: "PrintClosed",
        status: true,
      });
    }
  }, [oncChangeStatus, windowRef]);

  const openWindow = useCallback(() => {
    windowRef.current = window.open("", "", "width=0,height=0");
    windowRef.current.document.write(printTemplate);
    windowRef.current.document.body.appendChild(
      inputEl.current.cloneNode(true)
    );
    windowRef.current.print();
    windowRef.current.addEventListener("afterprint", closeWindow());
  }, [closeWindow, windowRef]);

  useEffect(() => (open ? openWindow() : closeWindow()), [
    open,
    openWindow,
    closeWindow,
  ]);

  return <div ref={inputEl}>{children}</div>;
}

PrintContent.propTypes = {
  oncChangeStatus: PropTypes.func,
  children: PropTypes.element.isRequired,
  open: PropTypes.bool,
};

PrintContent.defaultProps = {
  oncChangeStatus: () => {},
  open: false,
};

export default memo(PrintContent);
