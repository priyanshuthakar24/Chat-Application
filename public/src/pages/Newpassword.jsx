import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { newPassword } from "../utils/APIRoutes";
import { useParams } from "react-router-dom";
import { forgetPassword } from "../utils/APIRoutes"

export default function Newpassword() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const userValid = async () => {
    const res = await fetch(`${forgetPassword}/${token}/${id}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await res.json()
    console.log(data);
    if (data.status == 201) {
      console.log("user valid");
    } else {
      navigate('/login');
    }
  }

  useEffect(() => {
    userValid()
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { password } = values;
    if (password === "") {
      toast.error("Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  //  my function 
  const { token, id } = useParams();




  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { password } = values;
      const { data } = await axios.post(`${newPassword}/${token}/${id}`, {
        password,
      });
      if (data.status === 401) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === 201) {
          navigate("/login");
        }
    }
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>snappy</h1>
          </div>
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Submit</button>
          <span>
            Don't have an account ? <Link to="/register">Create One.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
