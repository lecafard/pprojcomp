import React from "react";
import style from "./style.module.css";
import New from "./new";
import Guest from "./guest";

function HomePage() {
  return (
    <section
      style={{
        flex: 1,
      }}
    >
      <div className={`container ${style.home}`}>
        <div className="row">
          <div className={`col ${style.col}`}>
            <New />
          </div>
          <div className={`col ${style.col}`}>
            <Guest />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
