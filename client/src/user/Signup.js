import React, { useState } from 'react'
import Base from '../core/Base'
import { Link } from 'react-router-dom'
import { signup } from '../auth/helper/index';

const Signup = () => {

    const [values, setValues] = useState({
        firstName: "",
        email: "",
        password: "",
        error: "",
        success: false
    });

    const { firstName, email, password, error, success } = values;

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value })
    }

    const onSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: false })
        signup({ firstName, email, password })
            .then(data => {
                if (data && data.error) {
                    setValues({ ...values, error: data.error, success: false })
                } else {
                    setValues({
                        ...values,
                        firstName: "",
                        email: "",
                        password: "",
                        success: true
                    })
                }
            })
            .catch(console.log("Error in Signup"))
    }

    const signUpForm = () => {
        return (
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form>
                        <div className="form-group mb-3">
                            <label htmlFor="Name" className="text-light">Name</label>
                            <input className="form-control" type="text" value={firstName} onChange={handleChange("firstName")} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="Email" className="text-light">Email</label>
                            <input className="form-control" type="email" value={email} onChange={handleChange("email")} />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="Password" className="text-light">Password</label>
                            <input className="form-control" type="password" value={password} onChange={handleChange("password")} />
                        </div>
                        <button onClick={onSubmit} className="btn btn-success w-100">Submit</button>
                    </form>
                </div>
            </div>
        )
    }

    const successMessage = () => {
        return (
            <div className="row">
            <div className="col-md-6 offset-sm-3 text-left">
            <div className="alert alert-success"
                style={{ display: success ? "" : "none" }}
            >
                New account was created successfully. Please <Link to="/signin">Login here.</Link>
            </div>
            </div>
            </div>
        )
    }

    const errorMessage = () => {
        return (
            <div className="row">
            <div className="col-md-6 offset-sm-3 text-left">
            <div className="alert alert-danger"
                style={{ display: error ? "" : "none" }}
            >
                {error}
            </div>
            </div>
            </div>
        )
    }

    return (
        <Base title="Sign up Page" description="A Page for user to Sign up!">
            {successMessage()}
            {errorMessage()}
            {signUpForm()}
            <p className="text-white text-center"> {JSON.stringify(values)} </p>
        </Base>
    )
};

export default Signup