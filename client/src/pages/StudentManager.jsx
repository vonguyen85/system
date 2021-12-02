import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userAPI from "../api/userAPI";
import AddStudent from "../components/AddStudent";
import StudentList from "../components/StudentList";

const StudentManager = () => {
  const arrClass = useSelector((state) => state.class.arrClass);
  const token = useSelector((state) => state.user.currentUser.token);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState({});
  const [students, setStudents] = useState([]);

  const handleClassChange = async (e) => {
    const result = await userAPI.getUser(token, dispatch, { classId: e.target.value });
    setStudents(result);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setQuestion({ ...question, [name]: value });
  };

  const handleChangeAnswer = (e) => {
    const { value } = e.target;
    setQuestion({ ...question, exact: value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
  };
  return (
    <div className="question_container">
      <AddStudent />
      <div className="filter">
        <select name="className" defaultValue="" onChange={handleClassChange}>
          <option value="" disabled>
            Chọn lớp
          </option>
          {arrClass?.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <StudentList />
      {/* <Dialog open={open} onClose={handleClose} fullScreen>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Câu hỏi"
            name="content"
            value={question.content}
            onChange={handleOnChange}
            type="text"
            fullWidth
            variant="standard"
          />
          {question.answer?.map((answer, index) => (
            <div key={answer._id} className="row">
              <input
                type="radio"
                name="exact"
                value={answer._id}
                checked={answer._id === question.exact}
                onChange={handleChangeAnswer}
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                type="text"
                name={answer._id}
                value={answer.name}
                variant="standard"
              />
            </div>
          ))}

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={question.exact}
            label="Age"
            onChange={handleOnChange}
          ></Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd}>Subscribe</Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
};

export default StudentManager;
