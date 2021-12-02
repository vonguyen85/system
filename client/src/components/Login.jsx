import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import userAPI from "../api/userAPI";

const Login = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const dispatch = useDispatch();
  const location = useHistory();
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const onLogin = async (e) => {
    e.preventDefault();
    const result = await userAPI.login(dispatch, user);
    if(result?.data.role === 1){
      location.push("/dashboard");
    }else{
      location.push("/student");
    }
  };
  return (
    <div className="form">
      <form>
        <h1>Đăng Nhập</h1>
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={handleOnChange}
          placeholder="Username"
          autoFocus
        />
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={handleOnChange}
          placeholder="Password"
        />
        <button onClick={onLogin}>Đăng Nhập</button>
        <div>
          <Link to="/register">Đăng Ký Tài Khoản</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
