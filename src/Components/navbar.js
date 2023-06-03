import React from "react";
import { useNavigate } from "react-router-dom";
import { Axios } from "axios";

export function Navbar(props) {
  let navigate = useNavigate();
  const options = (e) => {
    let action = e.target.value;
    if(action == 'list'){
      navigate("/expenses-list");

    }else if(action == 'logout'){
      localStorage.removeItem("auth");
      navigate("/");
    }
    else if(action == 'add'){
      navigate("/add-expenses");
    }
  }

  return (
    <div className="navbar">
      <span>{props.userid}</span>
      <select onChange={options}>
      <option value="">options</option>
      <option value="add">add</option>
        <option value="list">list</option>
        <option value="logout">logout</option>
      </select>
      {/* <button onClick={logout}> Logout</button> */}
    </div>
  );
}
