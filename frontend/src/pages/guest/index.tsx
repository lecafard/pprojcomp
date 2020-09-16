import React from 'react';

import Schedule from '../../components/schedule';

import style from "./style.module.css";

function GuestPage() {
  return (
    <div className="is-center" style={{marginTop: "20px"}}>
      <Schedule/>
    </div>
  );
}

export default GuestPage;