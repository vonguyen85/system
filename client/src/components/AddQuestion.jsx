import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import questionAPI from "../api/questionAPI";
import upload from "../api/uploadAPI";
import questionFile from '../templateFile/questiontemplate.docx';

const AddQuestion = () => {

  const token = useSelector((state) => state.user.currentUser.token);
  //Set Open Dialog
  const [open, setOpen] = useState(false);
  const [openDisplayQuestion, setOpenDisplayQuestion] = useState(false);

  //Set Question
  const [questions, setQuestion] = useState([]);
  const [fileUpload, setFileUpload] = useState("");
  const [fileName, setFileName] = useState('');
  //Get Filter Class, Subject
  const arrClass = useSelector((state) => state.class.arrClass);
  const arrSubject = useSelector((state) => state.subject.arrSubject);
  const [subjectFilter, setSubjectFilter] = useState([]);
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');

  const setDefaultValue = ()=>{
    setQuestion([]);
    setFileUpload('');
    setClassId('');
    setSubjectId('');
    setFileName('');
  }
  const handleClassChange = (e) => {
    setClassId(e.target.value);
    setSubjectFilter(
      arrSubject.filter((subject) => subject.classId === e.target.value)
    );
  };

  const handleSubjectChange = e =>{
    setSubjectId(e.target.value);
}


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDefaultValue();
  };

  //Parse file and show questions
  const handleParser = async (e) => {
    e.preventDefault();
    if(!classId){
      alert('Bạn chưa chọn lớp')
    }
    else if(!subjectId){
      alert('Bạn chưa chọn môn học')
    }
    else if(!fileUpload){
      alert('Hãy chọn tập tin')
    }else{
      const result = await upload.parse_docx(token, fileUpload);
      setQuestion(result);
      setOpen(false);
      handleClickOpenDisplayQuestion();
    }
  };

  const handleUpload = async (e) => {
    
    const file = e.target.files[0];
    if (
      file.type !==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      alert("Hãy chọn tập tin .docx");
      setFileUpload(null);
      setFileName('');
    } else {
      let formData = new FormData();
      formData.append("file", file);
      const result = await upload.docx(token, formData);
      setFileUpload(result);
      setFileName(file.name)
    }
  };

  const handleClickOpenDisplayQuestion = () => {
    setOpenDisplayQuestion(true);
  };

  const handleCloseDisplayQuestion = () => {
    setOpenDisplayQuestion(false);
    setDefaultValue();
  };

  //add question into dataBase
  const handleAdd = async (e) => {
    e.preventDefault();
    if(window.confirm('Hệ thống sẽ tự động loại bỏ những câu không có đáp án. Bạn muốn tiếp tục?')){
      const data={
        questions,
        classId,
        subjectId
      }
      const result = await questionAPI.createMulti(token, data);
      alert(result.msg);
      setOpenDisplayQuestion(false);
      setDefaultValue();
    }
      upload.destroy(token, fileUpload);
      };

      const loadQuestionTemplateFile = () =>{
        upload.loadFile(questionFile, 'cauhoi.docx');
      }
  return (
    <>
      <div className="button">
        <button onClick={handleClickOpen}>Thêm câu hỏi từ tập tin</button>
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
              <select name="subjectName" onChange={handleSubjectChange}>
                <option>Chọn Môn học</option>
                {subjectFilter.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              <label htmlFor="file-upload">{fileName ? fileName : 'Chọn tập tin'}</label>
              <input
                type="file"
                name="file"
                id="file-upload"
                hidden
                onChange={handleUpload}
                accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
        <DialogTitle>Danh sách câu hỏi</DialogTitle>
        <form>
          <DialogContent>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nội dung câu hỏi</th>
                <th scope="col">Các đáp án</th>
                <th scope="col">Đáp án đúng</th>
              </tr>
            </thead>
            <tbody>
            {questions &&
              questions.map((question, index) => (
                  <tr key={index} className={!question.question ? "error" : ''}>
                    <th scope="row">{index + 1}</th>
                    <td>{question.question}</td>
                    <td>
                    {question.answer.map((answer, index) => (
                      <p key={index}>
                        {String.fromCharCode(65 + index)}. {answer}
                      </p>
                    ))}
                      </td>
                    <td>
                    {question.answer.findIndex(
                      (answer) => answer === question.exactly
                    ) > -1 ? (
                      String.fromCharCode(
                        question.answer.findIndex(
                          (answer) => answer === question.exactly
                        ) + 65
                      )
                    ) : (
                      <span className="error">Không có đáp án</span>
                    )}
                      </td>
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

export default AddQuestion;
