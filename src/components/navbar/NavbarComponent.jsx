import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useAppContext } from "../../context/AppContext.jsx";
import CONSTANTS from "../../common/Constants.js";
import { useIdle } from "@uidotdev/usehooks";

const NavbarComponent = () => {
  const idle = useIdle(CONSTANTS.INACTIVITY_TIME);
  const navigate = useNavigate();
  const { logout, getSessionData } = useAppContext();
  const [rolUser, setRolUser] = useState(null);

  useEffect(() => {
    if (idle) {
      logout();
      navigate("/login");
    }

    let userinfo = getSessionData();
    if (userinfo != null) {
      setRolUser(userinfo.rol);
    }
  }, [idle, navigate, logout, getSessionData]);

  const logoutAction = async () => {
    if (confirm("¿Está seguro que desea salir del sistema?")) {
      logout();
      navigate("/login");
    }
  };

  const linkViewCalendario = () => {
    navigate('/views/calendario');
  };

  return (
    <>
      <Navbar
        expand="lg"
        className="fixed-top w-full bg-blue-500 text-center p-4"
      >
        <Container fluid>
          <Navbar.Brand href={"/views/home"} className=" text-white">
            <i className="bi bi-clipboard-data"></i>
            <span style={{ marginLeft: "0.5rem" }}>SIA Jardín</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto  text-white">
              {/**Calendario */}
              {rolUser != null && rolUser === "Administrador" ? (
                <Nav.Link className=" text-white" onClick={linkViewCalendario}>
                  <i className="bi bi-calendar-date"></i>
                  <span> Calendario</span>
                </Nav.Link>
              ) : (
                ""
              )}

              {/**Enlace de cerrar sesion */}
              <Nav.Link className=" text-white" onClick={logoutAction}>
                <i className="bi bi-box-arrow-right"></i>
                <span>Salir</span>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarComponent;
