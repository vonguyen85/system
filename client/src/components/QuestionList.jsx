import React, { useState, useEffect } from "react";
import questionAPI from "../api/questionAPI";
import { useSelector } from "react-redux";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const QuestionList = ({ subject, openDialog, callback }) => {
  const token = useSelector((state) => state.user.currentUser.token);
  const [questions, setQuestions] = useState([]);
  // const [check, setCheck] = useState({});

  useEffect(() => {
    const getQuestion = async () => {
      const result = await questionAPI.getBySubjectId(token, subject);
      setQuestions(result);
    };
    getQuestion();
  }, [subject, callback]);
  
  //   const handleChange = e =>{
  //       const name = e.target.name;
  //       const value = e.target.checked;
  //       setCheck({...check, [name]: value})
  //   }

  const handleDelete = async (question) => {
    if (window.confirm("Bạn muốn xóa câu hỏi")) {
      const result = await questionAPI.delete(token, {questionId: question._id});
      if(result){
        const questionFilter = questions.filter(elm => elm !== question);
        setQuestions(questionFilter);
      }
    }
  };

  const handleEdit = (question, type) => {
    openDialog(question, type);
  };
  return (
    <div className="content">
      {questions?.length > 0 && (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nội dung câu hỏi</th>
                <th scope="col">Các đáp án</th>
                <th scope="col"></th>
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
                          className={
                            question.exact === answer._id ? "blue" : ""
                          }
                        >
                          {String.fromCharCode(65 + index)}. {answer.name}
                        </p>
                      ))}
                    </td>
                    <td>
                      <CreateIcon
                        className="edit"
                        onClick={() => handleEdit(question, "edit")}
                      />
                      {!question.used && (
                        <DeleteOutlineIcon
                          className="delete"
                          onClick={() => handleDelete(question)}
                        />
                      )}
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

export default QuestionList;
