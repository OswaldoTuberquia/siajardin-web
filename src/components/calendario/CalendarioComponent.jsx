/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Flex, notification, DatePicker, Select } from "antd";
import CONSTANTS from "../../common/Constants.js";
import { FilterMatchMode } from "primereact/api";
import { useNavigate } from "react-router-dom";
import { Column } from "primereact/column";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Button } from "primereact/button";
import { useAppContext } from "../../context/AppContext.jsx";
import NavbarComponent from "../navbar/NavbarComponent.jsx";
import FooterComponent from "../footer/FooterComponent.jsx";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Form, Input, Card } from "antd";
import { convertSha512 } from "../../common/Helper.js";

const CalendarioComponent = () => {
  //variables para componente de busqueda
  const [formValues, setFormValues] = useState({
    secuencia: 0,
    descripcion: "",
    fechainicial: "",
    fechafinal: "",
    estado: "Activo",
  });

  const [dialogVisible, setDialogVisible] = useState(false);
  const [calendarios, setCalendarios] = useState([]);
  const { retrySessionData } = useAppContext();
  const [selectedCalendario, setSelectedCalendario] = useState(null);
  const [rowClick, setRowClick] = useState(true);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    secuencia: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombre: { value: null, matchMode: FilterMatchMode.CONTAINS },
    enlace: { value: null, matchMode: FilterMatchMode.CONTAINS },
    usuario: { value: null, matchMode: FilterMatchMode.CONTAINS },
    comentario: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const { getSessionData } = useAppContext();
  const columnsName = [
    { header: "Secuencia", field: "secuencia" },
    { header: "Descripcion", field: "descripcion" },
    { header: "Fecha_Inicial", field: "fechainicial" },
    { header: "Fecha_Final", field: "fechafinal" },
    { header: "Estado", field: "estado" },
  ];
  const [formData] = Form.useForm();
  const optionSelect = [
    { value: "Activo", label: "Activo" },
    { value: "Inactivo", label: "Inactivo" },
  ];

  //useEffect del component
  useEffect(() => {
    loadCalendario();
  }, []);

  //llamado al API para recuperar datos del backend
  const loadCalendario = async () => {
    let userinfo = getSessionData();
    if (userinfo !== null) {
      //sigue proceso
      try {
        const url = CONSTANTS.BASE_API_URL + CONSTANTS.CALENDARIO_API_URL;
        const options = {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + userinfo.token,
          },
        };
        // Fetch API to logout
        const response = await fetch(url, options);
        const data = await response.json();
        setCalendarios(data);
      } catch (err) {
        openNotificationWithIcon("error", "Error!", err);
      }
    } else {
      //genera alerta
      openNotificationWithIcon(
        "warning",
        "Alerta!",
        "No se pudo hallar datos de calendarios"
      );
    }
  };

  const openNotificationWithIcon = (tipo, titulo, mensaje) => {
    api[tipo]({
      message: titulo,
      description: mensaje,
    });
  };
  //caja opciones
  const dt = useRef(null);

  //variables
  const exportColumns = columnsName.map((col) => ({
    title: col.header,
    dataKey: col.field,
  }));
  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV({ selectionOnly });
  };
  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(calendarios);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveAsExcelFile(excelBuffer, "calendarios");
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };
  // evento botones
  const handleAddButton = () => {
    formData.resetFields();
    setDialogVisible(true);
  };

  //funciones de la tabla
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const header = (
    <div className="flex align-items-center justify-content-end gap-2">
      <input
        type="text"
        className="form-control"
        value={globalFilterValue}
        onChange={onGlobalFilterChange}
        placeholder="Search"
      />

      <Button
        type="button"
        icon="pi pi-file"
        rounded
        onClick={() => exportCSV(false)}
        tooltip="Exportar tabla CSV"
        tooltipOptions={{ position: "top" }}
      />
      <Button
        type="button"
        icon="pi pi-file-excel"
        severity="success"
        rounded
        onClick={exportExcel}
        tooltip="Exportar tabla XLS"
        tooltipOptions={{ position: "top" }}
      />
    </div>
  );
  const responsiveOptions = {
    breakpoint: "1024px",
    numVisible: 2,
    scrollHeight: "400px",
  };
  //enviar al API la nueva credencial
  const handleSubmitCalendario = async () => {
    try {
      let userinfo = getSessionData();
      if (userinfo == null) {
        navigate("/login");
      } else {
        const url = CONSTANTS.BASE_API_URL + CONSTANTS.CALENDARIO_API_URL;
        const options = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: "Bearer " + userinfo.token,
          },
          body: JSON.stringify(formValues),
        };
        console.log(JSON.stringify(formValues));
        // Fetch API to logout
        const response = await fetch(url, options);
        const data = await response.json();
        console.log(data);
        if (data.estado) {
          openNotificationWithIcon("success", "Confirmación!", data.mensaje);
          loadCalendario();
          setDialogVisible(false);
        } else {
          openNotificationWithIcon("warming", "Alerta!", data.mensaje);
        }
      }
    } catch (err) {
      openNotificationWithIcon(
        "error",
        "Error al Invocar API Credenciales",
        err
      );
    }
  };

  const onChangePickerInicial = (date, dateString) => {
    setFormValues({
      ...formValues,
      fechainicial: dateString,
    });
  };

  return (
    <>
      <header>
        <NavbarComponent />
      </header>
      <section
        className="container-fluid d-flex flex-column align-middle"
        style={{ marginTop: "4rem", marginBottom: "4rem" }}
      ></section>
      {contextHolder}
      <div className="card">
        <div className="card-header">
          <strong>
            <h4 className="text-color-custom">LISTADO DE CALENDARIOS</h4>
          </strong>
        </div>
        <div className="card-body">
          <div
            className="container-fluid"
            style={{ marginTop: "1rem", marginBottom: "1rem" }}
          >
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button
                className="btn btn-success"
                style={{
                  "--bs-btn-bg": "#00bfff",
                  "--bs-btn-border-color": "#00bfff",
                }}
                onClick={handleAddButton}
              >
                <i className="bi bi-plus-circle-fill"></i>
                Agregar
              </button>
            </div>
          </div>
          <div className="container-fluid justify-content-center align-items-center"></div>
          <DataTable
            stripedRows
            value={calendarios}
            header={header}
            ref={dt}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 25, 50]}
            filters={filters}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
            currentPageReportTemplate="{first} to {last} of {totalRecords}"
            filterDisplay="row"
            emptyMessage="No Calendarios found."
            responsive={responsiveOptions}
            globalFilterFields={[
              "secuencia",
              "descripcion",
              "fechainicial",
              "fechafinal",
              "estado",
            ]}
            tableStyle={{ minWidth: "50rem" }}
            selectionMode={rowClick ? null : "checkbox"}
            selection={selectedCalendario}
            onSelectionChange={(e) => setSelectedCalendario(e.value)}
            dataKey="secuencia"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: "3rem" }}
            ></Column>

            {columnsName.map((col, index) => (
              <Column
                sortable
                key={index}
                field={col.field}
                header={col.header}
              />
            ))}
          </DataTable>
        </div>
      </div>
      <section />
      <footer>
        <FooterComponent />
      </footer>

      {/**Dialogo de credencial */}
      <Dialog
        header=""
        visible={dialogVisible}
        onHide={() => {
          if (!dialogVisible) return;
          setDialogVisible(false);
        }}
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        <Card type="inner" title="Agregar/Editar Calendario">
          <Form
            form={formData}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            onFinish={handleSubmitCalendario}
          >
            <Form.Item
              label="Descripción"
              name="descripcion"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese descripción",
                },
              ]}
            >
              <input
                type="text"
                className="form-control"
                value={formValues.descripcion}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    descripcion: e.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item
              label="Fecha Inicial"
              name="fechainicial"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese fecha inicial",
                },
              ]}
            >
              <input
                type="date"
                className="form-control"
                value={formValues.fechainicial}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    fechainicial: e.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item
              label="Fecha Final"
              name="fechafinal"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese fecha final",
                },
              ]}
            >
              <input
                type="date"
                className="form-control"
                value={formValues.fechafinal}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    fechafinal: e.target.value,
                  })
                }
              />
            </Form.Item>
            <Form.Item
              name="estado"
              label="Estado"
              rules={[
                {
                  required: true,
                  message: "Por favor seleccione estado",
                },
              ]}
            >
              <select
                className="form-select"
                value={formValues.estado}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    estado: e.target.value,
                  })
                }
              >
                <option value="">Seleccione</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </Form.Item>
            <Form.Item>
              <Flex justify="center" align="center">
                <Button
                  label="Enviar"
                  icon="pi pi-check"
                  iconPos="right"
                  rounded
                />
              </Flex>
            </Form.Item>
          </Form>
        </Card>
      </Dialog>
    </>
  );
};

export default CalendarioComponent;
