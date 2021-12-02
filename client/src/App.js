import React from "react";
import { useSelector } from "react-redux";
import {
  Redirect, Route, Switch
} from "react-router-dom";
import Assignment from "./components/Assignment";
import Class from "./components/Class";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import AddTest from "./pages/AddTest";
import ChangePass from "./pages/ChangePass";
import DashBoard from "./pages/DashBoard";
import Home from "./pages/Home";
import Question from "./pages/Question";
import StudentManager from "./pages/StudentManager";
import StudentTest from "./pages/StudentTest";
import Test from "./pages/Test";
import TestDetail from "./pages/TestDetail";
import './scss/main.scss';

function App() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/login">
          {currentUser?.role === 1 ? <Redirect to="/dashboard" /> : <Login />}
        </Route>

        <Route exact path="/register">
          {currentUser?.role === 1 ? <Redirect to="/dashboard" /> : <Register />}
        </Route>
        <Route exact path="/class">
          {!currentUser ? <Redirect to="/login" /> : <Class />}
        </Route>

        <Route exact path="/dashboard">
          {currentUser?.role !== 1 ? <Redirect to="/login" /> : <DashBoard />}
        </Route>

        <Route exact path="/teacher/testDetail/:id">
          {currentUser?.role !== 1 ? <Redirect to="/login" /> : <TestDetail />}
        </Route>

        <Route exact path="/question">
          {currentUser?.role !== 1 ? <Redirect to="/login" /> : <Question />}
        </Route>
        <Route exact path="/test">
          {currentUser?.role !== 1 ? <Redirect to="/login" /> : <Test />}
        </Route>
        <Route exact path="/test/add">
          {currentUser?.role !== 1 ? <Redirect to="/login" /> : <AddTest />}
        </Route>
        <Route exact path="/teacher/studentmanager">
          {currentUser?.role !== 1 ? <Redirect to="/login" /> : <StudentManager />}
        </Route>


        <Route exact path="/student">
          {!currentUser ? <Redirect to="/login" /> : <StudentTest />}
        </Route>
        <Route exact path="/student/assignment">
          {!currentUser ? <Redirect to="/login" /> : <Assignment />}
        </Route>
        
        <Route exact path="/info">
          {!currentUser ? <Redirect to="/login" /> : <ChangePass />}
        </Route>

      </Switch>
    </>

  );
}

export default App;
