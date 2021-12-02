import React, { useState, useEffect } from "react";
import Filter from "../components/Filter";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import testAPI from "../api/testAPI";
import TestList from "../components/TestList";

const Test = () => {
  const token = useSelector((state) => state.user.currentUser.token);
  const [subjectId, setSubjectId] = useState("");
  const [classId, setClassId] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const getTest = () => {
      testAPI.getTest(dispatch, token);
    };
    getTest();
  }, []);

  const onSubjectChange = (id) => {
    setSubjectId(id);
  };

  const onClassChange = (id) => {
    setClassId(id);
    setSubjectId("");
  };

  return (
    <div className="test_container">
      <div className="add">
        <Link to="/test/add">Thêm đề thi mới</Link>
      </div>
      <div className="action">
        <Filter
          onSubjectChange={onSubjectChange}
          onClassChange={onClassChange}
        />
      </div>
      <TestList subjectId={subjectId} classId={classId} />
    </div>
  );
};

export default Test;
