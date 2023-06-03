import { Formik, Field, Form, ErrorMessage } from "formik";
import "../App.css";
import '../login-page.css'
import { useState } from "react";
import Axios from "axios";

export default function Register(props) {
  let [showPassword, setShowPassword] = useState(false);
  let [registrationInProcess, setregistrationInProcess] = useState(false);

  let validate = (values) => {
    let errors = {};
    let emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (values.user_id == '') {
      errors.user_id = "required";
    }else if (values.user_id && values.user_id.length < 8) {
      errors.user_id = "must be greater than 8";
    }

    if (values.email == '') {
      errors.email = "required";
    } else if (values.email && !emailRegex.test(values.email)) {
      errors.email = "Invalid Email";
    }

    if (values.password == '') {
      errors.password = "required";
    } else if (values.password && !passwordRegex.test(values.password)) {
      errors.password = "min 8 chars,1 special,1 letter,1number required";
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

  const toggleToLoggin = () => {
    let lbtn = document.getElementById("l-btn");
    let rbtn = document.getElementById("r-btn");

    lbtn.classList.toggle("active-comp");
    lbtn.classList.toggle("inactive-comp");
    rbtn.classList.toggle("inactive-comp");
    rbtn.classList.toggle("active-comp");
    props.setLoginOrRegister('Login');
  };

  let registerUser = async (values) => {
    let response = await Axios.post(
      process.env.REACT_APP_API_BASE_URL + "/users/register-user",
      values,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log(response)
    if (response.data.response == "USERCREATED") {
      alert("user created successfully");
      toggleToLoggin();
    } else if (response.data.response == "USERALREADYEXISTS") {
      alert("userid already exists");
      setregistrationInProcess(false);
    }
  };
  return (
    <div className="login-box">
      <Formik
        initialValues={{
          user_id: "",
          email: "",
          password: "",
        }}
        validate={validate}
        validateOnBlur={true}
        validateOnChange={true}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          setregistrationInProcess(true);
          registerUser(values);
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
            <ErrorMessage name="user_id" className = "error-message" component={"span"} />
          </div>

          <div className="single-field-box">
            <Field
              name="email"
              type="email"
              className="form-inputs"
              placeholder="email"
            />
            <ErrorMessage name="email" className = "error-message" component={"span"} />
          </div>

          <div className="single-field-box">
            <Field
              name="password"
              type="password"
              className="form-inputs"
              placeholder="password"
              id="pass-field"
            />
            <ErrorMessage name="password" className = "error-message" component={"span"} />
          </div>

          <div className="extra-ops">
            <div className="extra-ops-ckb">
              <label htmlFor="">showPassword</label>
              <Field type="checkbox" name="check" onClick={showPass} />
            </div>

            <div>
              <a> Forgot password</a>
            </div>
          </div>

          <button type="submit" className="form-sub-btn">
            {registrationInProcess ? (
              <>
                <i class="fa fa-spinner fa-spin"></i>
                <span>Register</span>
              </>
            ) : (
              "Register"
            )}
          </button>
        </Form>
      </Formik>
    </div>
  );
}
