import React, { useEffect, useState } from "react";
import CreateIcon from "@mui/icons-material/Create";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import GridViewIcon from "@mui/icons-material/GridView";
import { Link } from "react-router-dom";
import testAPI from '../api/testAPI';
import { useSelector, useDispatch } from 'react-redux';

const TestList = ({ subjectId, classId }) => {
  const token = useSelector((state) => state.user.currentUser.token);
  const tests = useSelector(state => state.test.arrTest);
  const [filterTest, setFilterTest] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (classId) {
      if (subjectId) {
        setFilterTest(
          tests.filter((element) => element.test.subjectId === subjectId)
        );
      } else {
        setFilterTest(tests.filter((element) => element.test.classId === classId));
      }
    }
  }, [subjectId, tests, classId]);

  const handleDelete = async elm =>{
    if(window.confirm(`Bạn muốn xóa ${elm.name}?`)){
        const result = await testAPI.delete(dispatch, token, elm._id);
        setFilterTest(filterTest.filter(test => test.test._id !== result._id));
    }
  }
  return (
    <div className="content">
      {filterTest?.length > 0 && (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nội dung</th>
                <th scope="col">Số câu hỏi</th>
                <th scope="col">Trạng thái</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {filterTest.map((element, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{element.test.name}</td>
                  <td>{element.test.questions.length}</td>
                  <td>{element.test.status === 1 ? "Đã duyệt" : "Chờ"}</td>
                  <td>
                    <Link to={`/teacher/testDetail/${element.test._id}`}>
                      <GridViewIcon className="view" />
                    </Link>

                    {!element.tested && <DeleteOutlineIcon
                      className="delete"
                      onClick={() => handleDelete(element.test)}
                    />}
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

export default TestList;
