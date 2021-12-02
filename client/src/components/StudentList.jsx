import React, { useState, useEffect } from "react";
import userAPI from "../api/userAPI";
import { useSelector } from "react-redux";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
const StudentList = () => {
  const token = useSelector((state) => state.user.currentUser.token);
  const students = useSelector((state) => state.student.arrStudent);

  const handleDelete = async(student) => {
    if(window.confirm(`Bạn muốn xóa ${student.name} khỏi lớp học?`)){
      const checkTested = await userAPI.checkedTested(token, student._id);
      if(checkTested){
        //Student tested
        if(window.confirm(`${student.name} đã tham gia thi. Bạn vẫn muốn xóa?`)){
          deleteStudent(student._id);
        }
      }else{
        deleteStudent(student._id);
      }
    }
  };

  const deleteStudent = async (id) =>{
    const result = await userAPI.deleteStudent(token, id);
    alert(result.name);
  }

  return (
    <div className="content">
      {students?.length > 0 && (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Họ tên</th>
                <th scope="col">Tài khoản</th>
                <th scope="col">Mật khẩu</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {students?.length > 0 &&
                students?.map((student, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{student.name}</td>
                    <td>{student.username}</td>
                    <td>{student.restore}</td>
                    <td>
                      <DeleteOutlineIcon
                        className="delete"
                        onClick={() => handleDelete(student)}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList;
