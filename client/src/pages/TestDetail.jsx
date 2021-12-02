import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import moment from "moment";
import React, { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import questionAPI from "../api/questionAPI";
import testAPI from "../api/testAPI";
import testingAPI from "../api/testingAPI";
import uploadAPI from "../api/uploadAPI";


const TestDetail = () => {
  const token = useSelector((state) => state.user.currentUser.token);
  const tests = useSelector((state) => state.test.arrTest);
  const arrClass = useSelector((state) => state.class.arrClass);
  const arrSubject = useSelector((state) => state.subject.arrSubject);

  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();

  const test = tests.find((elm) => elm.test._id === params.id).test;

  const [name, setName] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [numQuestion, setNumQuestion] = useState(0);
  const [timeTest, setTimeTest] = useState(0);
  const [timeStart, setTimeStart] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState(0);
  const [testing, setTesting] = useState([]);
  //Checked Test is tested
  const [checkTested, setCheckTested] = useState(false);
  const [showStudent, setShowStudent] = useState(false);

  useEffect(() => {
    initValue();
    const getTesting = async () => {
      const result = await testingAPI.getTesting(token, { testId: params.id });
      console.log(result);
      if (result.length > 0) {
        setCheckTested(true);
      }
      setTesting(result);
    };
    getTesting();
  }, [params.id]);

  const getName = (arr, id) => {
    const item = arr.find((item) => item._id === id);
    return item?.name;
  };

  const initValue = () => {
    setName(test.name);
    setNumQuestion(test.questions.length);
    setTimeTest(test.time);
    setStatus(test.status);
    setTimeStart(test.time_start);
    setSubject(getName(arrSubject, test.subjectId));
    setClassName(getName(arrClass, test.classId));
  };
  //Get questions from API and Show
  const handleGetQuestion = async (e) => {
    const result = await questionAPI.getByarrQuestionId(token, test.questions);
    setQuestions(result);
    //Hide all student tested
    setShowStudent(false);
  };

  //export excel
  const exportExcel = (data) => {
    const student = data.map((item, index) => {
      return {
        stt: index + 1,
        name: item.name,
        time: item.time
          ? showTestTime(item.time)
          : showTestTime(test.time * 60),
        mark: item.mark,
      };
    });
    uploadAPI.exportExcel(student);
  };
  const handleShowResultTest = async () => {
    setShowStudent(true);
    // Hide all Questions
    setQuestions([]);
  };

  //show student's test time
  const showTestTime = (time) => {
    const second = time % 60;
    const minute = Math.floor((time / 60) % 60);
    const hour = Math.floor((time / 3600) % 24);
    // return `${hour} > 9 ? ${hour} : 0${hour}:${minute}:${second}`;
    return (
      (hour > 9 ? hour : "0" + hour) +
      ":" +
      (minute > 9 ? minute : "0" + minute) +
      ":" +
      (second > 9 ? second : "0" + second)
    );
  };

  //Update test
  const handleUpdateTest = async () => {
    if (!name.trim()) {
      alert("Hãy đặt tên cho bài kiểm tra");
    } else if (
      timeStart &&
      new Date(timeStart).getTime() <= new Date().getTime()
    ) {
      alert("Lịch thi không phù hợp");
    } else {
      const data = {
        id: params.id,
        name,
        timeTest: Number(timeTest),
        timeStart: timeStart,
        status,
      };
      const result = await testAPI.update(token, data);
      if (result) {
        alert("Cập nhật thành công");
      }
    }
  };

  const handleDetailStudentTest = (id) => {
    const [studentId, testId] = id.split("&");
    testingAPI.create(dispatch, token, { studentId, testId });
    history.push(`/student/assignment`);
  };
  return (
    <div className="container_add">
      <div className="first_child">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          readOnly={checkTested}
        />
        <input type="text" defaultValue={className} readOnly />
        <input type="text" defaultValue={subject} readOnly />
      </div>
      <div>
        <span>Số câu hỏi </span>
        <input type="text" value={numQuestion.toString()} readOnly />
        <span>Thời gian làm bài </span>
        <input
          type="number"
          placeholder="Thời gian làm bài (phút)"
          min="1"
          value={timeTest}
          onChange={(e) => setTimeTest(e.target.value)}
          readOnly={checkTested}
        />
      </div>
      {!checkTested && (
        <div>
          <span>Thời gian bắt đầu thi </span>
          <DateTimePicker
            onChange={setTimeStart}
            value={timeStart && new Date(timeStart)}
          />
          <span> Trạng thái </span>
          <select
            name="status"
            className="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={checkTested}
          >
            <option value={0}>Chờ</option>
            <option value={1}>Duyệt</option>
          </select>
        </div>
      )}
      <div className="button">
        <button onClick={handleGetQuestion}>Câu hỏi</button>
        {checkTested && (
          <button onClick={handleShowResultTest}>Kết quả kiểm tra</button>
        )}
        {!checkTested && <button onClick={handleUpdateTest}>Lưu</button>}
      </div>

      <div className="content">
        {/* Show Question list */}
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
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Show Student tested */}
        {showStudent && testing?.length > 0 && (
          <div className="table-responsive">
            <div className="button end">
              <button onClick={() => exportExcel(testing)}>
                Xuất kết quả thi ra Excel
              </button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Họ tên</th>
                  <th scope="col">Thời gian bắt đầu</th>
                  <th scope="col">Thời gian làm bài</th>
                  <th scope="col">Kết quả</th>
                  <th scope="col">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {testing &&
                  testing.map((element, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{element.name}</td>
                      <td>
                        {moment(element.timeStart).format(
                          "h:mm:ss a DD/MM/YYYY"
                        )}
                      </td>
                      <td>
                        {element.time
                          ? showTestTime(element.time)
                          : showTestTime(test.time * 60)}
                      </td>
                      <td>{element.mark} điểm</td>
                      <td>
                        <VisibilityOutlinedIcon
                          className="view"
                          onClick={() => handleDetailStudentTest(element.id)}
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

export default TestDetail;
