import React, { useState, useEffect } from "react";


function CardHolder({ isHighlighted }) {
  const [highlighted, sethighlighted] = useState("");
  useEffect(() => {
    if (isHighlighted) {
      sethighlighted(" cardholder__highlight");
    } else {
      sethighlighted("");
    }
  }, [isHighlighted]);
  return <div className={"cardholder" + highlighted}></div>;
}

export default CardHolder;
