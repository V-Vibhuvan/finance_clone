import React from "react";
import axios from 'axios';
import {useNavigate} from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData ] = useState({
        name: "",
        email: "",
        password: ""
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
                "http://localhost:5173/signup",
                formData
            );

            localStorage.setItem("token", res.data.token);
            window.location.href("http://localhost:5174/signup");
            //navigate("/dashbord");

        }catch(err){
            alert(err.response.data.message);
        }
    };

    return(
         <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="card shadow p-4" style={{width:"400px"}}>
                <h3 className="text-center mb-4">
                    Create Account
                </h3>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Enter name"
                            onChange={handleChange}
                            required
                        />
                    </div>

                     <div className="mb-3">

                        <label className="form-label">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">

                        <label className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Enter password"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                    ></button>
                </form>

                <p className="text-center mt-3">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>
            </div>


         </div>
    )


};