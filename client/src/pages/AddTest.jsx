import React, { useState, useEffect } from "react";
import Filter from "../components/Filter";
import DateTimePicker from "react-datetime-picker";
import questionAPI from "../api/questionAPI";
import testAPI from "../api/testAPI";
import { useSelector } from "react-redux";
import {useHistory} from 'react-router-dom';

const AddTest = () => {
  const token = useSelector((state) => state.user.currentUser.token);
  const history = useHistory();

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [numQuestion, setNumQuestion] = useState(0);
  const [timeTest, setTimeTest] = useState(0);
  const [timeStart, setTimeStart] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState(0);
  const [option, setOption] = useState(0);

  const [check, setCheck] = useState([]);
  const [checkAll, setCheckAll] = useState(false);

  const onSubjectChange = (id) => {
    setSubject(id);
  };


  const handleCheck = (e) => {
    const name = e.target.name;
    const checked = e.target.checked;
    setCheck([ ...check, name]);
    if (!checked) {
        setCheck(check.filter(item => item !== name));
      }
  };

  const handleCheckAll = e => {
    setCheckAll(!checkAll);
    setCheck(questions.map(li => li._id));
    if (checkAll) {
      setCheck([]);
    }
  };


  const handleGetQuestion = async (e) => {
    e.preventDefault();
    let result = null;
    if (!name.trim()) {
      alert("Hãy đặt tên cho bài kiểm tra");
    } else if (!subject) {
      alert("Hãy chọn môn học");
    } else if (numQuestion < 1) {
      alert("Số lượng câu hỏi phải lớn hơn 0");
    } else if (timeTest < 1) {
      alert("Hãy đặt thời gian làm bài");
    } else if(timeStart?.getTime() < new Date().getTime()){
      alert("Lịch thi không phù hợp");
    } 
    else {
      if (option === '1') {
        //Handle get question
        result = await questionAPI.getBySubjectId(token, subject);
        setQuestions(result);
      } else if(option === '0'){
        //Get random question
        result = await questionAPI.getRandom(token, subject, numQuestion);
        setQuestions(result);
      }else{
        alert('Hãy chọn cách lấy câu hỏi');
      }
    }
  };

  const handleCreateTest = async() =>{
      if(check.length < numQuestion){
        alert('Hãy chọn thêm câu hỏi');
      }else if(check.length > numQuestion){
        alert(`Số câu hỏi không vượt quá ${numQuestion}`);
      }
      else{
        const data = {name, subjectId: subject, timeTest: Number(timeTest), timeStart, status, questions: check};
        const result = await testAPI.create(token, data);
      
        if(result){
          alert("Thêm thành công")
          history.push('/test');
        } 
      }
  }
  return (
    <div className="container_add">
      <div className="first_child">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tên bài kiểm tra"
      />
      <Filter onSubjectChange={onSubjectChange}/>
      </div>
      <div>
      <span>Số câu hỏi </span><input
        type="number"
        placeholder="Số câu hỏi"
        min="1"
        value={numQuestion}
        onChange={(e) => setNumQuestion(e.target.value)}
      />
      <span>Thời gian làm bài </span><input
        type="number"
        placeholder="Thời gian làm bài (phút)"
        min="1"
        value={timeTest}
        onChange={(e) => setTimeTest(e.target.value)}
      />
      </div>
      <div>
      <span>Thời gian bắt đầu thi </span><DateTimePicker  onChange={setTimeStart} value={timeStart} />
      <span>  Trạng thái  </span><select
        name="status"
        className="status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value={0}>Chờ</option>
        <option value={1}>Duyệt</option>
      </select>
      </div>
      <div className="select_question">
        <div><input
          type="radio"
          name="option"
          id="option0"
          value={0}
          onChange={(e) => setOption(e.target.value)}
        /><label htmlFor="option0">Lấy câu hỏi ngẫu nhiên từ ngân hàng câu hỏi</label></div>
        <div>
          <input
          type="radio"
          name="option"
          id="option1"
          value={1}
          onChange={(e) => setOption(e.target.value)}
        />
        <label htmlFor="option1">Lấy câu hỏi bằng tay</label></div>
      </div>
      <div className="button">
        <button onClick={handleGetQuestion} >Lấy câu hỏi</button>
        {questions?.length > 0 && <button onClick={handleCreateTest}>Lưu</button>}
      </div>

      <div className="content">
      {questions?.length > 0 && (
      <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nội dung câu hỏi</th>
                <th scope="col">Các đáp án</th>
                <th scope="col"><input type="checkbox" value={checkAll} onChange={handleCheckAll} /></th>
              </tr>
            </thead>
            <tbody>
            {questions &&
          questions.map((question, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{question.content}</td>
                    <td>
                    {question.answer.map((answer, index) => (
                  <p
                    key={index}
                    className={question.exact === answer._id ? "blue" : ""}
                  >
                    {String.fromCharCode(65 + index)}. {answer.name}
                  </p>
                ))}
                      </td>
                    <td>
                    <input
                  type="checkbox"
                  name={question._id}
                  value={question._id}
                  onChange={handleCheck}
                  checked={check.includes(question._id)}
                />
                      </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
};

export default AddTest;
