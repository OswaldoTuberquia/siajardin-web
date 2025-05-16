import { useState } from "react";
import { Flex, Layout, Avatar, Card, Space, Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext.jsx";
import { convertSha512 } from "../../common/Helper.js";
import CONSTANTS from "../../common/Constants.js";
import { UserOutlined, LockOutlined, SendOutlined } from "@ant-design/icons";
import { ProgressBar } from "primereact/progressbar";
const { Content } = Layout;
const contentStyle = {
  textAlign: "center",
  marginTop: "10%",
};
import LOGO from "../../assets/logo.png";

const LoginComponent = () => {
  const { setSessionData } = useAppContext();
  const navigate = useNavigate();
  //object para manejar username y password
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });
  const [hiddenBar, setHiddenBar] = useState(true);

  //evento de inicio de sesion
  const handleSubmit = async () => {
    try {
      setHiddenBar(false);
      let bodyData = {
        username: formValues.username,
        password: convertSha512(formValues.password, CONSTANTS.VALUE),
      };

      const url = CONSTANTS.BASE_API_URL + CONSTANTS.LOGIN_API_URL;
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify(bodyData),
      };

      const response = await fetch(url, options);
      const data = await response.json();
      if (data.success) {
        setHiddenBar(true);
        setSessionData(data);
        navigate("/views/home");
      } else {
        setHiddenBar(true);
        alert(data.message);
      }
    } catch (error) {
      setHiddenBar(true);
      if (error.message.includes("401")) {
        alert("email y/o contraseña invalidos");
      } else {
        alert(error);
      }
    }
  };

  const Icono = <img src={LOGO} alt="Logo" style={{ width: "100%" }} />;
  return (
    <>
      <Flex
        gap="middle"
        justify="center"
        align="middle"
        style={{ height: "100vh" }}
      >
        <Layout>
          <Content style={contentStyle}>
            <Space direction="vertical" size={16}>
              <Card
                type="inner"
                title="Inicio de Sistema de Información Académico"
                style={{ width: 500 }}
              >
                <Form
                  name="login"
                  style={{
                    maxWidth: 500,
                  }}
                  onFinish={handleSubmit}
                >
                  <Form.Item>
                    <Flex justify="center" align="center">
                      <img
                        src={LOGO}
                        alt="Logo"
                        style={{ width: 160, height: 120 }}
                      />
                    </Flex>
                  </Form.Item>
                  <Form.Item
                    name="usuario"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese su usuario!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="Usuario"
                      value={formValues.username}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          username: e.target.value,
                        })
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    name="clave"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese contraseña!",
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Contraseña"
                      value={formValues.password}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          password: e.target.value,
                        })
                      }
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      block
                      type="primary"
                      htmlType="submit"
                      icon={<SendOutlined />}
                    >
                      Enviar
                    </Button>
                  </Form.Item>

                  <Form.Item hidden={hiddenBar}>
                    <ProgressBar
                      mode="indeterminate"
                      style={{ height: "6px" }}
                    ></ProgressBar>
                  </Form.Item>
                </Form>
              </Card>
            </Space>
          </Content>
        </Layout>
      </Flex>
    </>
  );
};

export default LoginComponent;
