import React, { useState, useEffect } from "react";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useSelector, useDispatch } from "react-redux";

import subjectAPI from "../api/subjectAPI";

const Subject = ({ classItem }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");

  const [dialogTitle, setDialogTitle] = useState("");
  const listClass = useSelector((state) => state.class.arrClass);
  const listSubject = useSelector((state) => state.subject.arrSubject);
  const [subjectFilter, setSubjectFilter] = useState([]);

  //Subject
  const [subjectId, setSubjectId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [classID, setClassID] = useState("");

  const { token } = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const [callback, setCallback] = useState(false);

  //filter subject by classID
  useEffect(() => {
    setSubjectFilter(
      listSubject.filter((item) => item.classId === classItem.id)
    );
  }, [classItem]);

  //Set null subject
  const setDefaultSubject = () => {
    setSubjectName("");
  };

  //Edit or Create Subject
  const handleEditOrCreate = async () => {
    if (typeof subjectId === "object") {
      if (!subjectName.trim()) {
        alert("Hãy nhập tên môn học");
      } else {
        const result = await subjectAPI.createSubject(dispatch, token, {
          name: subjectName,
          classId: classItem.id,
        });
        if (result) {
          setSubjectFilter([result, ...subjectFilter]);
          setDefaultSubject();
          setOpen(false);
        }
      }
    } else {
      const result = await subjectAPI.updateSubject(
        dispatch,
        token,
        subjectId,
        subjectName,
        classItem.id
      );
      if (result) {
        const index = subjectFilter.findIndex((i) => i._id === result._id);
        const newSubject = [...subjectFilter];
        newSubject[index] = result;
        setSubjectFilter(newSubject);
        setDefaultSubject();
        setOpen(false);
      }
    }
  };
  //Delete Class
  const handleDelete = async (elm) => {
    if (window.confirm(`Bạn muốn xóa ${elm.name}?`)) {
      const result = await subjectAPI.deleteSubject(dispatch, token, elm._id);
      if (result) {
        const newSubject = subjectFilter.filter((subject) => subject !== elm);
        setSubjectFilter(newSubject);
      }
    }
  };

  //show Dialog
  const handleClickOpen = (id = "", name = "", type = "") => {
    if (type === "edit") {
      setDialogTitle("Đổi tên môn học");
      setType("edit");
    } else {
      setType("add");
      setDialogTitle("Thêm môn học mới");
    }
    setSubjectId(id);
    setSubjectName(name);
    setOpen(true);
  };

  const handleClose = () => {
    setDefaultSubject();
    setOpen(false);
  };

  return (
    <>
      <div className="item">
        {listClass.length > 0 && (
          <div className="button">
            <button onClick={handleClickOpen}>Thêm môn học</button>
          </div>
        )}
        {subjectFilter.length > 0 ? (
          <>
            <div className="header">
              Danh sách môn học trong {classItem.name}
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Tên Môn</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {subjectFilter.map((elm, index) => (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{elm.name}</td>
                      <td>
                        <CreateIcon
                          className="edit"
                          onClick={() =>
                            handleClickOpen(elm._id, elm.name, "edit")
                          }
                        />
                        {!elm.used && (
                          <DeleteOutlineIcon
                            className="delete"
                            onClick={() => handleDelete(elm)}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="header">Chưa có môn học trong {classItem.name}</div>
        )}
      </div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <input
              autoFocus
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
            />
            <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleEditOrCreate}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Subject;
