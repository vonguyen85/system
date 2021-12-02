import React, { useState } from "react";
import { useSelector } from "react-redux";

const Filter = ({ onSubjectChange, onClassChange}) => {
  const arrClass = useSelector((state) => state.class.arrClass);
  const arrSubject = useSelector((state) => state.subject.arrSubject);
  const [subjectFilter, setSubjectFilter] = useState([]);

  const handleClassChange = (e) => {
    if(typeof onClassChange === 'function'){
      onClassChange(e.target.value);
    }
    setSubjectFilter(
      arrSubject.filter((subject) => subject.classId === e.target.value)
    );
  };
  const handleSubjectChange = (e) => {
    onSubjectChange(e.target.value);
  };

  return (
    <div className="filter">
      <select name="className" onChange={handleClassChange}>
        <option>Chọn lớp</option>
        {arrClass.map((item) => (
          <option key={item._id} value={item._id}>
            {item.name}
          </option>
        ))}
      </select>
      <select name="subjectName" onChange={handleSubjectChange}>
        <option>Chọn Môn học</option>
        {subjectFilter.map((subject) => (
          <option key={subject._id} value={subject._id}>
            {subject.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
