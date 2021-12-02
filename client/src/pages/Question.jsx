import React, { useState, useEffect } from "react";
import AddQuestion from "../components/AddQuestion";
import Filter from "../components/Filter";
import QuestionList from "../components/QuestionList";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import questionAPI from "../api/questionAPI";
import { useSelector, useDispatch } from "react-redux";

const Question = () => {
  const token = useSelector((state) => state.user.currentUser.token);
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState({});
  let [answers, setAnswers] = useState([]);
  const [subject, setSubject] = useState("");
  const [callback, setCallback] = useState(false);
  //Show Question when change subjectId
  const onSubjectChange = (id) => {
    setSubject(id);
  };

  const onClassChange = (id) => {};

  const handleClickOpen = (question = null, type = "") => {
    setQuestion(question);
    setAnswers(question.answer);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setQuestion({ ...question, [name]: value });
  };

  const handleChangeExact = (e) => {
    const { value } = e.target;
    setQuestion({ ...question, exact: value });
  };
  const handleChangeAnswer = (e) => {
    const { name, value } = e.target;
    const filter = answers.map(elm =>{
      if(elm._id === name){
        return {_id: elm._id, name: value}
      }
      return elm;
    });
    setAnswers(filter)
  };

  //Update question
  const handleSave = async (e) => {
    e.preventDefault();
    question.answer = answers;
    const result = await questionAPI.update(token, {question:question});
    if(result){
      setQuestion(result);
      handleClose();
      setCallback(!callback);
    }
  }; 

  return (
    <div className="question_container">
      <AddQuestion />
      <Filter onSubjectChange={onSubjectChange} onClassChange={onClassChange} />
      <QuestionList subject={subject} openDialog={handleClickOpen} callback={callback}/>
      <Dialog open={open} onClose={handleClose} fullScreen>
        <DialogContent>
          <form>
            <div className="form-group">
              <label htmlFor="exampleFormControlTextarea1">
                Nội dung câu hỏi
              </label>
              <textarea
                className="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
                name="content"
                value={question.content}
                onChange={handleOnChange}
              ></textarea>
            </div>

            {answers?.map((answer, index) => (
              <div className="form-check flex" key={answer._id}>
                <input
                  className="form-check-input"
                  type="radio"
                  name="exampleRadios"
                  value={answer._id}
                  checked={answer._id === question.exact}
                  onChange={handleChangeExact}
                />
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="name@example.com"
                  name={answer._id}
                  value={answer.name}
                  onChange={handleChangeAnswer}
                />
              </div>
            ))}
</form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSave}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Question;
