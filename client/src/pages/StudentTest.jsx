import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import testAPI from "../api/testAPI";
import testingAPI from "../api/testingAPI";
import { useHistory } from "react-router-dom";
import moment from "moment";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const StudentTest = () => {
  const token = useSelector((state) => state.user.currentUser.token);
  const dispatch = useDispatch();
  const [tests, setTests] = useState([]);
  const history = useHistory();
  const [testing, setTesting] = useState(null);

  //Dialog
  const [open, setOpen] = useState(false);
  const [contentDialog, setContentDialog] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getTest = async () => {
      const result = await testAPI.getTestStudent(dispatch, token);
      setTests(result);
    };
    getTest();
  }, []);

  useEffect(() => {
    //checked test which student doing
    const getTesting = async () => {
      if (token) {
        const result = await testingAPI.getTestingNotFinish(token);
        if (result) {
          setOpen(true);
          setTesting(result);
        }
      }
    };
    getTesting();
  }, []);

  const showTimeStartTest = (timeStart, status) => {
    if (status === 0) {
      if (timeStart && new Date(timeStart) > new Date()) {
        let time = moment(timeStart).format("HH:mm:ss DD/MM/YYYY");
        return (
          <div>
            Lịch thi: <span className="time_start">{time}</span>
          </div>
        );
      }
    }
  };
  const handleClick = (testId, timeStart) => {
    if (testing && testing.testId !== testId) {
      setContentDialog("Hãy hoàn thành trước khi làm bài mới");
      setOpen(true);
    } else {
      if (timeStart && new Date(timeStart) > new Date()) {
        alert("Chưa đến thời gian thi. Vui lòng quay lại sau");
      } else {
        testingAPI.create(dispatch, token, { testId: testId });
        history.push(`/student/assignment`);
      }
    }
  };

  return (
    <div className="container_student">
      {tests?.map((element, index) => (
        <div key={index} className="card">
          <div className="header">
            <span>{element.test.name}</span>
            <span>{element.subject}</span>
          </div>
          <div className="content">
            {showTimeStartTest(element.test.time_start, element.statusTest)}
            {element.statusTest === 2 && (
              <div>
                Kết quả thi: <span className="result">{element.mark} điểm</span>
              </div>
            )}
            <button
              onClick={() => {
                handleClick(element.test._id, element.test.time_start);
              }}
              className={element.statusTest === 1 ? "alert" : ""}
            >
              {element.statusTest === 2 && "Xem lại bài làm"}
              {element.statusTest === 1 && "Tiếp tục làm bài"}
              {element.statusTest === 0 && "Vào thi"}
            </button>
          </div>
        </div>
      ))}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {/* <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có một bài kiểm tra chưa hoàn thành. {contentDialog}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Thoát</Button>
          <Button
            onClick={() => {
              handleClick(testing?.testId);
            }}
            autoFocus
          >
            Tiếp tục làm bài
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StudentTest;
