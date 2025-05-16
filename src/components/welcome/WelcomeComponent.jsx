import React from 'react';
import LOGO from "../../assets/logo.png";

const WelcomeComponent = () => {
    return (
    <>
        <img
          style={{ width: "35%", height: "35%" }}
          src={LOGO}
          alt="Logo principal app"
        />
    </>
  );
}

export default WelcomeComponent;
