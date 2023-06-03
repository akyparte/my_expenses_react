import "../App.css";
import "../expenses-list.css";
import "rsuite/dist/rsuite.min.css";
import DataTable from "react-data-table-component";
import { useState } from "react";
import { Navbar } from "./navbar";
import { useEffect } from "react";
import moment from "moment/moment";
import axios from "axios";
import { CustomProvider, DatePicker } from "rsuite";
import { useNavigate } from "react-router-dom";
export default function ExpensesList() {
  let navigate = useNavigate();
  const [data, setData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("desc");
  const [errors, setErrors] = useState({});
  let [userid, setUserid] = useState("");
  let [typeList, setTypeList] = useState([]);
  let [initialValues, setInitialValues] = useState({
    type_id: "",
    subType: "",
    amount: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  let [filters, setFilters] = useState({});

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
        // wordWrap:'wrap
        fontSize: "16px",
      },
    },
  };
  const columns = [
    {
      name: "Type",
      selector: (row, index) => {
        return row.type;
      },
    },
    {
      name: "SubType",
      selector: (row) => row.subtype,
      // width: "36%",
    },
    {
      name: "Amt",
      selector: (row) => row.amount,
      // width: "15%",
    },
    {
      name: "Date",
      selector: (row) => moment(row.created_at).format("yyyy-MM-DD"),
      // width: "15%",
    },
    {
      name: "Description",
      selector: (row) => row.description,
      // width:"30%"
    },
  ];

  const getData = async (page, perPage) => {
    setLoading(true);
    let userData = localStorage["auth"];

    axios({
      method: "post",
      url:
        process.env.REACT_APP_API_BASE_URL +
        "/expenses-list/get-list?page_number=" +
        page +
        "&page_size=" +
        perPage +
        "&sort_by=" +
        sortBy +
        "&sort_order=" +
        sortOrder,
      data: { filters: JSON.stringify(filters) },
      headers: { "Content-Type": "application/json", auth: userData },
    })
      .then((response) => {
        setData(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setInitialValues({ ...initialValues, [name]: value });
  };

  const handlePageChange = (page) => {
    getData(page, perPage);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    getData(page, newPerPage);
  };

  const handleSort = async (column, sortDirection) => {
    setSortBy(column.sortField);
    setSortOrder(sortDirection);
  };

  useEffect(() => {
    let auth = localStorage["auth"];
    if (typeof auth !== "undefined") {
      getTypeList(auth);
      getData(1, perPage);
    } else {
      navigate("/");
    }
  }, [filters, sortOrder]);
  const validate = (values) => {
    let result = true;
    let errors = {};
    if (values.endDate && !values.startDate) {
      errors.startDate = "start date required";
      result = false;
    } else if (
      values.startDate &&
      values.endDate &&
      values.startDate > values.endDate
    ) {
      errors.startDate = "startdate must be lessthan enddate";
      result = false;
    }

    if (values.amount && !Number(values.amount) > 0) {
      errors.amount = "must be a valid number";
    }

    setErrors(errors);
    return result;
  };

  const filter = () => {
    let result = validate(initialValues);
    if (result) {
      let selectedFilters = {};

      for (const key in initialValues) {
        if (initialValues[key] != "") {
          selectedFilters[key] = initialValues[key];
        }
      }

      if (selectedFilters.startDate) {
        selectedFilters.startDate = moment(selectedFilters.startDate).format(
          "yyyy-MM-DD"
        );
        selectedFilters.endDate = selectedFilters.endDate
          ? moment(selectedFilters.endDate).format("yyyy-MM-DD")
          : moment().format("yyyy-MM-DD");
      }
      setFilters(selectedFilters);
    }
  };

  const DateComp = (props) => {
    let field = props.type == "start" ? "startDate" : "endDate";
    let defaultValue = initialValues[field] == "" ? null : initialValues[field];
    return (
      <CustomProvider theme="dark">
        <DatePicker
          format="yyyy-MM-dd"
          placeholder={props.type}
          defaultValue={defaultValue}
          onChange={(e) => {
            if (e) {
              initialValues[field] = e;
              setInitialValues(initialValues);
            } else {
              initialValues[field] = "";
              setInitialValues(initialValues);
            }
          }}
        />
      </CustomProvider>
    );
  };
  const DatePickerCompStart = () => {
    return <DateComp type="start"></DateComp>;
  };

  const DatePickerCompEnd = () => {
    return <DateComp type="end"></DateComp>;
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

  const DescriptionComp = (props) => {
    let dec = props.data.description;
    let subType = props.data.subtype;
    return (
      <div className="list-des-expand-box">
        <p> SubType: {subType}</p>
        <p> Description: {dec}</p>
      </div>
    );
  };

  const selectChange = (e) => {
    setInitialValues({ ...initialValues, type_id: e.target.value });
  };
  return (
    <div className="list-ex-frame">
      <Navbar userid={userid} />
      <div className="list-ex-container">
        <div className="list-ex-form">
          <h1>Filters</h1>
          <div className="list-ex-field">
            <select onChange={selectChange}>
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
            </select>
          </div>

          <div className="list-ex-field">
            <input
              placeholder="subType"
              onChange={handleChange}
              name="subType"
              value={initialValues.subType}
            />
          </div>

          <div className="list-ex-field">
            <input
              placeholder="Amount"
              name="amount"
              onChange={handleChange}
              value={initialValues.amount}
            />
            {errors.amount ? <span> {errors.amount}</span> : ""}
          </div>
          <div className="list-ex-field">
            <input
              placeholder="Description"
              name="description"
              onChange={handleChange}
              value={initialValues.description}
            />
          </div>

          <div className="list-ex-date-box">
            <DatePickerCompStart></DatePickerCompStart>
            <DatePickerCompEnd></DatePickerCompEnd>
            {errors.startDate ? <span> {errors.startDate}</span> : ""}
          </div>

          <button onClick={filter}>Filter</button>
        </div>

        <div className="list-ex-data-table">
          <DataTable
            customStyles={customStyles}
            columns={columns}
            data={data}
            expandableRows
            expandableRowsComponent={DescriptionComp}
            progressPending={loading}
            pagination
            paginationServer
            onSort={handleSort}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handlePerRowsChange}
            paginationTotalRows={totalRows}
          />
        </div>
      </div>
    </div>
  );
}
