import React, { useEffect, useState, useCallback } from "react";
import subjectAPI from "../api/subjectAPI";
import userAPI from "../api/userAPI";
import Class from "../components/Class";
import Subject from "../components/Subject";
import { useDispatch, useSelector } from "react-redux";

const DashBoard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [subject, setSubject] = useState([]);
  const [classItem, setClassItem] = useState({id: '', name: ''});
  const token = localStorage.getItem("token");
  const [title, setTitle] = useState('');
  const allSubject = useSelector(state => state.subject.arrSubject);
  const dispatch = useDispatch();

  const handleClick = (elm) => {
    setClassItem({id: elm._id, name: elm.name});
  };

  useCallback(() => {
    console.log('log in fail')
    const getUser = async () => {
      if (currentUser) {
        const result = await userAPI.getUser(currentUser.token);
        if (!result.hasOwnProperty('role')) {
          userAPI.logout(dispatch);
        }
      }
    }
    getUser();
  }, [])

  return (
    <div className="container">
      <Class handleClick={handleClick} />
      {classItem.id && <Subject classItem={classItem} />}
    </div>
  );
};

export default DashBoard;
