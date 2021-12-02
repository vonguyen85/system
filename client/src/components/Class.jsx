import React, { useEffect, useState } from "react";
import classAPI from "../api/classAPI";
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

const Class = ({ handleClick }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [classID, setClassID] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");

  const [arrClass, setArrClass] = useState([]);
  const token = useSelector((state) => state.user.currentUser.token);
  const dispatch = useDispatch();

  //Get all class and Subject by Owner
  useEffect(() => {
    const getClass = async () => {
      const result = await classAPI.getClass(dispatch, token);
      setArrClass(result);
    };
    const getAllSubject = async () => {
      subjectAPI.getAllSubjectByOwnerId(dispatch, token);
    };
    getClass();
    getAllSubject();
  }, []);

  //Show Subject
  const itemClick = (elm) => {
    handleClick(elm);
  };

  //Edit or Create Class
  const handleEditOrCreate = async () => {
    //check create or update
    if (typeof classID === "object") {
      const result = await classAPI.createClass(dispatch, token, {
        name: name,
      });
      if (result) {
        setArrClass([result, ...arrClass]);
        setOpen(false);
      }
    } else {
      const result = await classAPI.updateClass(dispatch, token, classID, {
        name: name,
      });
      if (result) {
        const index = arrClass.findIndex((i) => i._id === result._id);
        const newArrClass = [...arrClass];
        newArrClass[index] = result;
        setArrClass(newArrClass);
        setOpen(false);
      }
    }
  };

  //Delete Class
  const handleDelete = async (elm) => {
    if (window.confirm(`Bạn muốn xóa ${elm.name} ?`)) {
      await classAPI.deleteClass(dispatch, token, elm._id);
      const newClass = arrClass.filter((item) => item !== elm);
      setArrClass(newClass);
    }
  };

  const handleClickOpen = (id = "", name = "", type = "") => {
    if (type === "edit") {
      setDialogTitle("Đổi tên lớp");
    } else {
      setDialogTitle("Thêm lớp mới");
    }
    setClassID(id);
    setName(name);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const showListClass = () => {
    return (
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tên Lớp</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {arrClass.map((elm, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>
                  <div className="hover" onClick={() => itemClick(elm)}>
                    {elm.name}
                  </div>
                </td>
                <td>
                  <CreateIcon
                    className="edit"
                    onClick={() => handleClickOpen(elm._id, elm.name, "edit")}
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
    );
  };

  return (
    <>
      <div className="item">
        <div className="button">
          <button onClick={handleClickOpen}>Thêm Lớp mới</button>
        </div>
        {arrClass?.length > 0 ? (
          showListClass()
        ) : (
          <div className="header">Chưa có lớp học</div>
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
              placeholder="Tên lớp"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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

export default Class;
