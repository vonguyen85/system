import React, { useState, useEffect } from "react";
import logo from "../img/logo.jpg";
import Avatar from "@mui/material/Avatar";
import { Link, useHistory, useLocation } from "react-router-dom";
import userAPI from "../api/userAPI";
import { useSelector, useDispatch } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";
import Popover from "@mui/material/Popover";
import { deepOrange, deepPurple } from '@mui/material/colors';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

const Navbar = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [info, setInfo] = useState(null);
  const user = useSelector((state) => state.user.currentUser);
  const location = useLocation();
  //popover
  const [anchorEl, setAnchorEl] = React.useState(null);

  const showPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  
  //Logout
  const onLogout = (e) => {
    e.preventDefault();
    userAPI.logout(dispatch);
    history.push("/");
  };

  const handleLogoClick = () =>{
    if(user.role === 1){
      history.push("/dashBoard");
    }else{
      history.push("/student");
    }
  }
  const handleChoose = (choose) => {
    if (choose === 1) {
      history.push("/info");
    } else if(choose === 2){
      history.push("/dashboard");
    } else if(choose === 3){
      history.push("/student");
    }
    handleClose();
  };

  if (user) {
    if (
      location.pathname === "/" ||
      location.pathname === "/student/assignment" ||
      location.pathname === "/login" ||
      location.pathname === "/register"
    )
      return null;
    return (
      <>
        <div className="navbar">
          <input type="checkbox" id="click" className="check" />
          <label htmlFor="click" className="menu-btn">
            <MenuIcon />
          </label>
          <label htmlFor="click" className="over_lay"></label>
          <div className="logo" onClick={handleLogoClick}>
            <span>TEST ONLINE</span>
          </div>
          {user.role === 1 && (
            <nav>
              <ul>
                <li>
                  <Link to="/dashboard">Lớp - Môn học</Link>
                </li>
                <li>
                  <Link to="/question">Câu hỏi</Link>
                </li>
                <li>
                  <Link to="/test">Đề thi</Link>
                </li>
                <li>
                  <Link to="/teacher/studentmanager">Học sinh</Link>
                </li>
              </ul>
            </nav>
          )}
          <div className="icons">
            <div className="user" onClick={showPopover}>
            <PersonOutlineOutlinedIcon/> {user.name}
            </div>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
                <div onClick={() => handleChoose(1)} className="icons__action">
                  Thay đổi mật khẩu
                </div>
              {user.role === 1 ? (
                <div onClick={() => handleChoose(2)} className="icons__action">
                  Trang quản trị
                </div>
              ) : (
                <div onClick={() => handleChoose(3)} className="icons__action">
                  Trang chủ
                </div>
              )}
              <div onClick={onLogout} className="icons__action">
                Đăng xuất
              </div>
            </Popover>
          </div>
        </div>
      </>
    );
  } else return null;
};

export default Navbar;
