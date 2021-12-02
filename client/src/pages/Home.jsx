import React from "react";
import {Link} from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">
      <div className="content">
        <h1>Hệ Thống Trắc Nghiệm Online</h1>
        <p></p>
        <Link to="/login">Truy cập</Link>
      </div>
    </div>
  );
};

export default Home;
