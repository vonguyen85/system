import React, {useState} from 'react'
import userAPI from '../api/userAPI';
import { Link, useHistory } from "react-router-dom";

const Register = () => {
    const history = useHistory();
    const [user, setUser] = useState({
        name: "",
        username: "",
        password: "",
        password_confirm: ""
      });

      const handleOnChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
      };
    
      const onRegister = async(e) =>{
        e.preventDefault();
        if(user.name.trim() ===''){
            alert('Bạn chưa nhập họ tên')
        }
        else if(user.username.trim() ===''){
            alert('Bạn chưa nhập tài khoản')
        }
        else if(user.password.length < 6){
            alert('Mật khẩu phải ít nhất 6 ký tự')
        }
        else if(user.password_confirm !== user.password){
            alert('Mật khẩu không khớp')
        }
        else{
            const data = await userAPI.register(user);
            if(localStorage.getItem('isLogin')){
                alert(data);
                history.push('/login')
            }
        }
        // if(!localStorage.getItem('isLogin'))
        // alert('Đăng nhập không thành công!')
      }
    
    
      return (
        <div className="form">
          <form>
              <h1>Tạo tài khoản mới</h1>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleOnChange}
              placeholder="Họ tên"
              autoFocus
            />
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleOnChange}
              placeholder="Tài khoản"
            />
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleOnChange}
              placeholder="Mật khẩu"
              required
            />
            <input
              type="password"
              name="password_confirm"
              value={user.password_confirm}
              onChange={handleOnChange}
              placeholder="Nhập lại mật khẩu"
            />
            <button onClick={onRegister} >Đăng Ký</button>
            <div><Link to="/login">Đăng nhập</Link></div>
          </form>
        </div>
      )
}

export default Register
