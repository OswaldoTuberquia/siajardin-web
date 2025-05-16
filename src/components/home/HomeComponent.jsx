import React from "react";
import NavbarComponent from "../navbar/NavbarComponent";
import WelcomeComponent from "../welcome/WelcomeComponent";
import FooterComponent from "../footer/FooterComponent";

const HomeComponent = () => {
  return (
      <>
      <header>
        <NavbarComponent/>
      </header>
      <section
        className="container-fluid d-flex flex-column align-middle"
        style={{ marginTop: "6rem", marginBottom: "4rem" }}>
        <WelcomeComponent/>
      </section>
      <footer>
       <FooterComponent/>
      </footer>
    </>
  );
};

export default HomeComponent;
