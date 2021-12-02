import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import upload from "../api/uploadAPI";
import userAPI from "../api/userAPI";
import listStudentFile from "../templateFile/danhsach.xlsx";

const AddStudent = () => {
  const token = useSelector((state) => state.user.currentUser.token);
  //Set Open Dialog
  const [open, setOpen] = useState(false);
  const [openDisplayQuestion, setOpenDisplayQuestion] = useState(false);

  //Set Question
  const [fileUpload, setFileUpload] = useState("");
  const [fileName, setFileName] = useState("");

  //Get Filter Class, Subject
  const arrClass = useSelector((state) => state.class.arrClass);
  const [classId, setClassId] = useState("");

  const [students, setStudents] = useState([]);
  const setDefaultValue = () => {
    setFileUpload("");
    setClassId("");
    setFileName("");
  };
  const handleClassChange = async (e) => {
    setClassId(e.target.value);
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDefaultValue();
  };

  //Parse file and show student account
  const handleParser = async (e) => {
    e.preventDefault();
    if (!classId) {
      alert("Bạn chưa chọn lớp");
    } else if (!fileUpload) {
      alert("Hãy chọn tập tin");
    } else {
      const result = await upload.parse_excel(token, fileUpload, classId);
      setStudents(result);
      setOpen(false);
      handleClickOpenDisplayQuestion();
    }
  };

  //Upload file when select file change
  const handleUpload = async (e) => {
    if (fileUpload) {
      await upload.destroy(token, fileUpload);
    }
    const file = e.target.files[0];
    if (
      file.type !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      alert("Hãy chọn tập tin .xlsx");
      setFileUpload(null);
      setFileName("");
    } else {
      let formData = new FormData();
      formData.append("file", file);
      const result = await upload.xlsx(token, formData);
      setFileUpload(result);
      setFileName(file.name);
    }
  };

  const handleClickOpenDisplayQuestion = () => {
    setOpenDisplayQuestion(true);
  };

  const handleCloseDisplayQuestion = () => {
    setOpenDisplayQuestion(false);
    setDefaultValue();
  };

  //add student into dataBase
  const handleAdd = async (e) => {
    e.preventDefault();
    if (
      window.confirm(
        "Hệ thống sẽ tự động thêm vào các ký tự ngẫu nhiên đối với các học sinh trùng tên hoặc tài khoản đã tồn tại. Bạn muốn tiếp tục?"
      )
    ) {
      const data = {
        students,
        classId,
      };
      const result = await userAPI.addMultiStudent(token, data);
      if (result) {
        alert(result.msg);
      }
      handleCloseDisplayQuestion();
    }
  };

  //download list student template file
  const loadQuestionTemplateFile = () => {
    upload.loadFile(listStudentFile, "danhsach.xlsx");
  };

  return (
    <>
      <div className="button">
        <button onClick={handleClickOpen}>Thêm học sinh từ tập tin</button>
        <button onClick={loadQuestionTemplateFile}>Tải tập tin mẫu</button>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <form>
          <DialogContent>
            <div className="upload">
              <select
                name="className"
                defaultValue=""
                onChange={handleClassChange}
              >
                <option value="" disabled>
                  Chọn lớp
                </option>
                {arrClass.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <label htmlFor="file-upload">
                {fileName ? fileName : "Chọn tập tin"}
              </label>
              <input
                type="file"
                name="file"
                id="file-upload"
                hidden
                onChange={handleUpload}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button onClick={handleParser}>Lưu</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog fullScreen open={openDisplayQuestion} onClose={handleClose}>
        {/* <DialogTitle>Subscribe</DialogTitle> */}
        <form>
          <DialogContent>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">STT</th>
                    <th scope="col">Họ tên</th>
                    <th scope="col">Tài khoản</th>
                    <th scope="col">Mật khẩu</th>
                  </tr>
                </thead>
                <tbody>
                  {students &&
                    students?.map((student, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{student.name}</td>
                        <td>{student.username}</td>
                        <td>{student.password}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDisplayQuestion}>Hủy</Button>
            <Button onClick={handleAdd}>Lưu</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default AddStudent;
