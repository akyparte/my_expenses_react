import { Formik, Field, Form, ErrorMessage } from "formik";
import { useState } from "react";
import axios from "axios";
import "../App.css";
import "../login-page.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  let navigate = useNavigate();
  let [initialValues, setInitialValues] = useState({
    user_id: "",
    password: "",
  });
  let [showPassword, setShowPassword] = useState(false);
  let [loginInProcess, setLoginInProcess] = useState(false);

  let validate = (values) => {
    let errors = {};
    if (!values.user_id) {
      errors.user_id = "required";
    }
    if (!values.password) {
      errors.password = "required";
    }
    return errors;
  };

  let showPass = () => {
    var x = document.getElementById("pass-field");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
    if (showPassword) setShowPassword(false);
    else setShowPassword(true);
  };

  let loginUser = async (values) => {
    try {
      let response = await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/users/login",
        values,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.data.response == "LOGGEDIN") {
        // now do navigate
        alert('dcdcdc')
        localStorage.setItem("auth", response.data.auth);
        navigate("/add-expenses");
      } else if (response.data.response == "USERNOTEXIST") {
        alert("Invalid id password");
        setLoginInProcess(false);
      }
    } catch (error) {
       console.log(error)
    }
  };

  useEffect(() => {
    let auth = localStorage.getItem("auth");
    if (auth) {
      navigate("/add-expenses");
    }
  }, []);
  return (
    <div className="login-box">
      <Formik
        initialValues={initialValues}
        // validateOnChange={false}
        validateOnBlur={true}
        validate={validate}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          setLoginInProcess(true);
          loginUser(values);
        }}
      >
        <Form className="login-box-form">
          <div className="single-field-box">
            <Field
              name="user_id"
              type="text"
              className="form-inputs"
              placeholder="userid"
            />
            <ErrorMessage
              name="user_id"
              className="error-message"
              component={"span"}
            />
          </div>

          <div className="single-field-box">
            <Field
              name="password"
              type="password"
              className="form-inputs"
              placeholder="password"
              id="pass-field"
            />
            <ErrorMessage
              name="password"
              className="error-message"
              component={"span"}
            />
          </div>

          <div className="extra-ops">
            <div className="extra-ops-ckb">
              <label htmlFor="">showPassword</label>
              <Field type="checkbox" name="check" onClick={showPass} />
            </div>
          </div>

          <button type="submit" className="form-sub-btn">
            {loginInProcess ? (
              <>
                <i class="fa fa-spinner fa-spin"></i>
                <span>Login</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </Form>
      </Formik>
    </div>
  );
}
