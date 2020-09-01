import React from 'react';
import style from "./style.module.css";
import New from './new';
import Guest from './guest';

function HomePage() {
    return (
        <section style={{
            backgroundColor: "var(--bg-theme)",
            flex: 1
        }} className="is-center">
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