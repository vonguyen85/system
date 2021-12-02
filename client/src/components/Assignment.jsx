import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import testingAPI from "../api/testingAPI";
import { useHistory } from "react-router-dom";

const Assignment = () => {
  const token = useSelector((state) => state.user.currentUser.token);
  const testing = useSelector((state) => state.testing.testing);
  const [answer, setAnswer] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();

  const intervalRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  const getTimeRemaining = (endtime) => {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  const startTimer = (deadline) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(deadline);
    if (total >= 0) {
      setTimeLeft(
        (hours > 9 ? hours : "0" + hours) +
          ":" +
          (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    } else {
      handleFinish();
      clearInterval(intervalRef.current);
    }
  };

  const clearTimer = (endtime) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const id = setInterval(() => {
      startTimer(endtime);
    }, 1000);
    intervalRef.current = id;
  };

  const getDeadLineTime = (timestart, time) => {
    let deadline = new Date(timestart);
    deadline.setSeconds(deadline.getSeconds() + time * 60);
    return deadline;
  };

  useEffect(() => {
    if (testing?.answer) {
      setAnswer(testing.answer);
    }
  }, [testing]);

  useEffect(() => {
    //Check test finshed
    if (testing?.mark === -1) {
      clearTimer(getDeadLineTime(testing?.timeStart, testing?.time));
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [testing]);

  //Choose answer
  const handleChange = (e) => {
    if (testing?.mark === -1) {
      const { name, value } = e.target;
      const newAnswer = { ...answer };
      setAnswer({ ...answer, [name]: value });
      testingAPI.updateAnswer(dispatch, token, testing.id, {
        ...newAnswer,
        [name]: value,
      });
    }
  };
  //Finish test
  const handleFinish = (e) => {
    if (typeof e !== "object") {
      finish();
    } else {
      if (window.confirm("Ban muon nop bai?")) {
        finish();
      }
    }
  };

  const finish = async () => {
    const result = await testingAPI.finish(dispatch, token, {
      testingId: testing.id,
    });
    if (result) {
      alert(`Ket qua: ${result.true}/${result.questions}`);
      setAnswer(null);
      if (intervalRef.current) clearInterval(intervalRef.current);
      history.push("/student");
    }
  };

  const handleBack = () => {
    history.push("/student");
  };
  //Show test
  const showContent = () => {
    return testing?.questions.map((element, indexQuestion) => (
      <div className="content" key={indexQuestion}>
        <div>
          <p>
            Cau {indexQuestion + 1}. {element.content}
          </p>
          {element.answer.map((item, index) => (
            <div
              className={
                //Tested and show exact answer
                //Chang color when answer true
                testing.mark !== -1 &&
                testing.exact &&
                testing.exact[indexQuestion] === item._id.toString()
                  ? "answer exact"
                  : "answer"
              }
              key={index}
            >
              <input
                type="radio"
                className="fail"
                name={element.id}
                value={item._id}
                id={item._id}
                onChange={handleChange}
                checked={
                  answer &&
                  Object.values(answer).findIndex((a) => a === item._id) !== -1
                    ? true
                    : false
                }
              />
              <label
                htmlFor={item._id}
                className={
                  testing.mark !== -1 &&
                  testing.exact &&
                  testing.exact[indexQuestion] === element.answer[indexQuestion]
                    ? "answer fail"
                    : "answer"
                }
              >
                {item.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div className="container_testing">
      {showContent()}
      {testing?.mark === -1 ? (
        <div className="timecount">
          <h5>Thời gian còn lại</h5>
          <div className="timeleft">{timeLeft}</div>
          <div className="action">
            <button onClick={handleFinish}>Nộp bài</button>
          </div>
        </div>
      ) : (
          <div className="back">
            <button onClick={handleBack}>Trở về</button>
          </div>
      )}
    </div>
  );
};

export default Assignment;
