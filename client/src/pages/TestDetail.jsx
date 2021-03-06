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
      alert("H??y ?????t t??n cho b??i ki???m tra");
    } else if (
      timeStart &&
      new Date(timeStart).getTime() <= new Date().getTime()
    ) {
      alert("L???ch thi kh??ng ph?? h???p");
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
        alert("C???p nh???t th??nh c??ng");
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
        <span>S??? c??u h???i </span>
        <input type="text" value={numQuestion.toString()} readOnly />
        <span>Th???i gian l??m b??i </span>
        <input
          type="number"
          placeholder="Th???i gian l??m b??i (ph??t)"
          min="1"
          value={timeTest}
          onChange={(e) => setTimeTest(e.target.value)}
          readOnly={checkTested}
        />
      </div>
      {!checkTested && (
        <div>
          <span>Th???i gian b???t ?????u thi </span>
          <DateTimePicker
            onChange={setTimeStart}
            value={timeStart && new Date(timeStart)}
          />
          <span> Tr???ng th??i </span>
          <select
            name="status"
            className="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={checkTested}
          >
            <option value={0}>Ch???</option>
            <option value={1}>Duy???t</option>
          </select>
        </div>
      )}
      <div className="button">
        <button onClick={handleGetQuestion}>C??u h???i</button>
        {checkTested && (
          <button onClick={handleShowResultTest}>K???t qu??? ki???m tra</button>
        )}
        {!checkTested && <button onClick={handleUpdateTest}>L??u</button>}
      </div>

      <div className="content">
        {/* Show Question list */}
        {questions?.length > 0 && (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">N???i dung c??u h???i</th>
                  <th scope="col">C??c ????p ??n</th>
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
                Xu???t k???t qu??? thi ra Excel
              </button>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">H??? t??n</th>
                  <th scope="col">Th???i gian b???t ?????u</th>
                  <th scope="col">Th???i gian l??m b??i</th>
                  <th scope="col">K???t qu???</th>
                  <th scope="col">Chi ti???t</th>
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
                      <td>{element.mark} ??i???m</td>
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
