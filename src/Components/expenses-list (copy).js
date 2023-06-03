import "../App.css";
import "../expenses-list.css";
import "rsuite/dist/rsuite.min.css";
import { Formik, Field, Form, ErrorMessage } from "formik";
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
  const [data,setData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');

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
    let userData = localStorage['auth'];

    axios({
      method: "post",
      url: process.env.REACT_APP_API_BASE_URL + '/expenses-list/get-list?page_number=' + page + '&page_size=' + perPage + '&sort_by=' + sortBy + '&sort_order=' + sortOrder,
      data: { "filters": JSON.stringify(filters) },
      headers: { "Content-Type": "application/json", "auth": userData },
    })
      .then((response) => {
        console.log("tableData->", response.data);
        setData(response.data.data);
        setTotalRows(response.data.total);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });

      setLoading(false);
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
    let auth = localStorage['auth'];
    if (typeof auth !== 'undefined') {
      // let userData = JSON.parse(localStorage['auth']);
      getTypeList(auth)
      getData(1, perPage); // fetch page 1 of users
    } else {
      navigate('/');
    }
  }, [filters, sortOrder]);
  const validate = (values) => {
    let errors = {};
    if (values.endDate && !values.startDate) {
      errors.startDate = "start date required";
    } else if (
      values.startDate &&
      values.endDate &&
      values.startDate > values.endDate
    ) {
      errors.startDate = "startdate must be lessthan enddate";
    }

    if (values.amount && !Number(values.amount) > 0) {
      errors.amount = "must be a valid number";
    }

    return errors;
  };

  const getList = (values) => {
    let selectedFilters = {};

    for (const key in values) {
      if (values[key] != "") {
        selectedFilters[key] = values[key];
      }
    }

    if(values.startDate){
       values.endDate = moment().format("yyyy-MM-DD");
    }
    setFilters(selectedFilters);
  };

  const DateComp = (props) => {
    let name = props.fname;
    let values = props.fvalues;

    let [date,setDate] = useState(null);
    return (
      <CustomProvider theme="dark">
        <DatePicker
          format="yyyy-MM-dd"
          placeholder={props.type}
          // value={props.type == 'end' ?values.endDate:values.startDate}
          value={date}
          isClearable={false}
          //cleanable={false}
          // onChang
          cleanable={false}
          editable={false}
          onChange={(e) => {
            alert(e)
            if (e) {
              values[name] = moment(e).format("yyyy-MM-DD");
              // alert(values[name])
              setDate(e);
            }
            else {
              values[name] = "";
              // setDate(null);
            }
          }}

        />
      </CustomProvider>
    );
  };
  const DatePickerCompStart = (props) => {
    return (
      <DateComp
        type="start"
        fname={props.field.name}
        fvalues={props.form.values}
      ></DateComp>
    );
  };

  const DatePickerCompEnd = (props) => {
    return (
      <DateComp
        type="end"
        fname={props.field.name}
        fvalues={props.form.values}
      ></DateComp>
    );
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

  // useEffect(() => {
	// 	// fetchUsers(1); // fetch page 1 of users
	// 	setData([{type:'dcd',subtype:'dcc',amount:"ddcd",created_at:'ddc',description:'ddcd'}])
	// }, []);
  return (
    <div className="list-ex-frame">
      <Navbar userid={userid} />
      <div className="list-ex-container">
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            getList(values);
            // setTimeout(() => {
            //   alert(values.startDate)
            // }, 3000);

            setSubmitting(false);

          }}
        >
          <Form className="list-ex-form">
            <h1>Filters</h1>
            <div className="list-ex-field">
              <Field as="select" name="type_id">
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
              <ErrorMessage name="type_id" />
            </div>

            <div className="list-ex-field">
              <Field placeholder="subType" name="subType" />
              <ErrorMessage name="subType" />
            </div>

            <div className="list-ex-field">
              <Field placeholder="Amount" name="amount" />
              <ErrorMessage name="amount" />
            </div>
            <div className="list-ex-field">
              <Field placeholder="Description" name="description" />
              <ErrorMessage name="description" />
            </div>

            <div className="list-ex-date-box">
              <Field component={DatePickerCompStart} name="startDate" />
              <Field component={DatePickerCompEnd} name="endDate" />
              <ErrorMessage name="startDate" />
            </div>

            <button>Filter</button>
          </Form>
        </Formik>

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
