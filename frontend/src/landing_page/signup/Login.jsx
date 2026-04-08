import React, { useState } from "react";
import axios from "axios";

export default function Login(){

  const [formData,setFormData] = useState({
    email:"",
    password:""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try{

      const res = await axios.post(
        "http://localhost:5173/login",
        formData
      );

      // store token
      localStorage.setItem("token",res.data.token);

      // redirect to dashboard
      window.location.replace("http://localhost:5173/login");

    }
    catch(err){
      alert(err.response.data.message);
    }

  };

  return(

    <div className="container vh-100 d-flex justify-content-center align-items-center">

      <div className="card p-4 shadow" style={{width:"400px"}}>

        <h3 className="text-center mb-4">Login</h3>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn btn-primary w-100">
            Login
          </button>

        </form>

      </div>

    </div>
  );
}