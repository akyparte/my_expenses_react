import "../App.css";
import "../add-expenses.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
import DataTable from "react-data-table-component";
import { useState } from "react";
import { Navbar } from "./navbar";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function AddExpensesPage(props) {
  let [confirmLoading, setConfirmLoading] = useState(false);
  let [typeList, setTypeList] = useState([]);
  let [userid, setUserid] = useState("");
  let navigate = useNavigate();
  let [formInitialValues, setFormInitialValues] = useState({
    type_id: "",
    subType: "",
    amt: "",
    description: "",
  });
  let [tableData, setTableData] = useState([]);

  const columns = [
    {
      name: "Type",
      selector: (row, index) =>{
         return typeList.find((obj) => obj.id == row.type_id).name;
        },
      width: "15%",
    },
    {
      name: "SubType",
      selector: (row) => row.subType,
      // width: "10%",
    },
    // ProjectName
    {
      name: "Amt",
      selector: (row) => row.amt,
      width: "15%",
    },
    // DeveloperName
    {
      name: "Description",
      selector: (row) => row.description,
      // selector: (row) => row.developer_id,
    },
    {
      name: "Action",
      selector: (row, index) => (
        <i
          class="fa fa-trash-o my-trash"
          aria-hidden="true"
          onClick={() => deleteTableEntry(index)}
        ></i>
      ),
      width: "15%",
    },
  ];

  const deleteTableEntry = (index) => {
    tableData = tableData.filter((data, i) => i != index);
    setTableData(tableData);
  };

  const saveEntryData = async () => {
    if (tableData.length) {
      setConfirmLoading(true);
      let auth = localStorage.getItem("auth");
      let response = await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/expenses/add-expenses",
        tableData,
        {
          headers: {
            auth: auth,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.response == "DATASAVED") {
        alert("entry added");
      } else {
        alert("server error");
      }
      setTableData([]);
      setConfirmLoading(false);
    } else {
      alert("add entry first");
    }
  };
 
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#252525",
        color: "white",
        fontWeight: "bold",
        fontSize: "16px",
      },
    },
    cells: {
      style: {
        backgroundColor: "#3b3c36",
        color: "#C5C6D0",
        color: "white",
        fontSize: "16px",
      },
    },
  };

  const addEntryToTable = (values) => {
    alert(JSON.stringify(values))
    setTableData([...tableData, values]);
  };

  const getTypeList = async (auth) => {
    try {
      let typeList = await axios.get(
        process.env.REACT_APP_API_BASE_URL + "/expenses/get-type-list",
        {
          headers: {
            auth: auth,
          },
        }
      );
      typeList.data.records.unshift({ id: "", name: "Type" });
      setTypeList(typeList.data.records);
      setUserid(typeList.data.userid);
    } catch (error) {
      console.log(error);
    }
  };

  const validate = (values) => {
    let errors = {};
    if (values.type_id.trim() == "") {
      errors.type_id = "Required";
    }

    if (values.subType.trim() == "") {
      errors.subType = "Required";
    }

    if (values.amt != "" && !Number(values.amt)) {
      errors.amt = "Not a valid number";
    }
    return errors;
  };

  useEffect(() => {
    let userData = localStorage.getItem("auth");
    if (!userData) {
      navigate("/");
    }
    getTypeList(userData);
  }, []);

  return (
    <div className="ex-frame">
      <Navbar userid={userid} />
      <div className="ex-container">
        <div className="ex-form-box">
          <Formik
            initialValues={formInitialValues}
            validateOnChange={false}
            validateOnBlur={false}
            validate={validate}
            onSubmit={(values, { resetForm, setSubmitting }) => {
              setSubmitting(false);
              addEntryToTable(values);
              resetForm();
            }}
          >
            <Form className="ex-form">
              <h1> Add entry</h1>
              <div className="ex-form-field-box">
                <Field name="type_id" as="select">
                  {typeList.length ? (
                    typeList.map((obj, i) => {
                      return (
                        <option value={obj.id} key={i}>
                          {obj.name}
                        </option>
                      );
                    })
                  ) : (
                    <option></option>
                  )}
                </Field>
                <ErrorMessage
                  name="type_id"
                  className="error-message"
                  component={"span"}
                />
              </div>

              <div className="ex-form-field-box">
                <Field name="subType" type="text" placeholder="subType" />
                <ErrorMessage
                  name="subType"
                  className="error-message"
                  component={"span"}
                />
              </div>

              <div className="ex-form-field-box">
                <Field name="amt" type="text" placeholder="amount" />
                <ErrorMessage
                  name="amt"
                  className="error-message"
                  component={"span"}
                />
              </div>

              <div className="ex-form-field-box">
                <Field
                  name="description"
                  type="text"
                  placeholder="description"
                />
                <ErrorMessage name="description" />
              </div>

              <button type="submit">submit entry</button>
            </Form>
          </Formik>
        </div>

        <div className="ex-data-table">
          <DataTable
            customStyles={customStyles}
            columns={columns}
            data={tableData}
          />
        </div>

        <button id="add-ex-entry-btn" onClick={saveEntryData}>
          {confirmLoading ? (
            <>
              <i class="fa fa-spinner fa-spin"></i>
              <span>Saving</span>
            </>
          ) : (
            "Confirm"
          )}
        </button>
      </div>
    </div>
  );
}
