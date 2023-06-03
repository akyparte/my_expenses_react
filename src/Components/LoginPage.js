
import '../App.css'
import '../login-page.css'
import Register from './Register-components';
import Login from './login-components';
import { useState } from 'react';

export default function LoginPage(params) {
  let [loginOrRegister , setLoginOrRegister] = useState('Login');
  
  const togglePage = (process) => {
      if(loginOrRegister == 'Login' && process == 'r'){
         tottlePageStyles();
         setLoginOrRegister('Register')
      }else if(loginOrRegister == 'Register' && process == 'l'){
      tottlePageStyles();
         setLoginOrRegister('Login')
      }
  }

  const tottlePageStyles = () => {
    let lbtn = document.getElementById('l-btn');
    let rbtn = document.getElementById('r-btn');
    lbtn.classList.toggle('active-comp');
    lbtn.classList.toggle('inactive-comp');
    rbtn.classList.toggle('inactive-comp');
    rbtn.classList.toggle('active-comp');
  }

    return (
      <div className="login-frame">
        <div className="login-container">
          <div className="login-register-btn-container">
            <button id = "l-btn" onClick={() => togglePage('l')} className="active-comp"> LOGIN </button>
            <button id = "r-btn" onClick={() => togglePage('r')} className="inactive-comp"> REGISTER </button>
          </div>
          {
           loginOrRegister == 'Login' ?
           <Login setLoginOrRegister={setLoginOrRegister}></Login>
           :
           <Register setLoginOrRegister={setLoginOrRegister}></Register>
          }
        </div>
      </div>
    );

}