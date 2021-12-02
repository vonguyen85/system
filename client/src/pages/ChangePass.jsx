import React,{useState} from 'react';
import { useSelector } from 'react-redux';
import userAPI from '../api/userAPI';

const ChangePass = () => {
  const token = useSelector((state) => state.user.currentUser.token);
  const [newPass, setNewPass] = useState('');
  const [renewPass, setRenewPass] = useState('');

  const handleChangePass = async e =>{
    e.preventDefault();
    if(newPass !== renewPass){
      alert('Mật khẩu không khớp');
    }else if(newPass.trim().length < 6){
      alert('Mật khẩu phải ít nhất 6 ký tự');
    }else{
      const result = await userAPI.changePass(token,{newPass})
      if(result) alert('Thay đổi thành công');
    }
  }
  return (
        <div className="changepass">
          <form>
            <input
              type="password"
              name="password"
              value={newPass}
              onChange={e=>setNewPass(e.target.value)}
              placeholder="Mật khẩu mới"
              required
            />
            <input
              type="password"
              name="password_confirm"
              placeholder="Nhập lại mật khẩu mới"
              value={renewPass}
              onChange={e=>setRenewPass(e.target.value)}
            />
            <button onClick={handleChangePass}>Lưu</button>
          </form>
        </div>
    )
}

export default ChangePass
