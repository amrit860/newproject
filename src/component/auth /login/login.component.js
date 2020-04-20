import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import notification from "./../../../utils/notification";

export class LoginComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {

      },
      error: {

      },
      issubmitting: false,
      isValiditing: false,
      remember_me: false
    };
  }
  //   

  handleChange = e => {
    let { type, name, value, checked } = e.target;
    if (type === "checkbox") {
      value = checked;
      this.rememberMe(value);
    }
    this.setState((preState) => ({
      data: {
        ...preState.data,
        [name]: value
      }

    }), () => {
      this.validateForm(name);

    })

  };
  rememberMe(val) {
    console.log("value>>", val);
    localStorage.setItem("remember_me", val);

  }
  validateForm(fieldName) {
    let errmsg;
    switch (fieldName) {
      case "username":
        errmsg = this.state[fieldName]
          ? ""
          : "username is required "

break;
      case "password":
        errmsg = this.state[fieldName]
          ? ""
          : "password is required"
        break;
      default:
        break;
    }
    this.setState((prevState) => ({
      error: {
        ...prevState.error,
        [fieldName]: errmsg
      }

    }))
  }

  handleSubmit = e => {
    e.preventDefault();
    this.setState({
      isSubmitting: true
    });
    // setTimeout(() => {
    //   this.setState({
    //     isSubmitting: false
    //   });
    //   this.props.history.push("/dashboard/amrit");
    // }, 2000);
    axios.post(

      "http://localhost:2021/api/auth/login",
      this.state.data, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {},
      responseType: "json"
    }
    )
      .then(response => {
        notification.showSuccess(`welcome ${response.data.username}`)
        console.log("success in axios call>>", response);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        this.props.history.push("/dashboard");
      })
      .catch(err => {
        notification.handleError(err);
        console.log("error in axios call>>", err.response)
      })
      .finally(() => {
        this.setState({
          isSubmitting: false
        })
      })
  };


  render() {
    let btn = this.state.isSubmitting
      ?
      <button disabled={true} className="btn btn-info">
        Logging in
      </button>
      :
      <button className="btn btn-primary" type="submit">
        login
        </button>


    return (
      <div className="container">
        <h2>
          <br></br>
          <b>Login</b>
        </h2>
        <p>
          <u>Please login to contine</u>
        </p>
        <form className="form-group" onSubmit={this.handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            className="form-control"
            type="text"
            placeholder="username"
            name="username"
            onChange={this.handleChange}
          ></input>
          <p className="danger">{this.state.usernameErr}</p>
          <br></br>
          <label htmlFor="password">password:</label> <br></br>
          <input
            className="form-control"
            type="password"
            placeholder="password"
            name="password"
            onChange={this.handleChange}
          ></input>
          <p className="danger">{this.state.passwordErr}</p>

          <br></br>
          <input
            type="checkbox"
            name="remember_me"
            onChange={this.handleChange}
          ></input>
          <label>Remember Me</label>
          <br></br>
          {btn}
        </form>

        <p>
          {" "}
          Don't have an account?
          <Link to="/register">
            {" "}
            register
          </Link>
        </p>

        <Link to="/password.html">forgot password?</Link>
      </div>
    );
  }
}
