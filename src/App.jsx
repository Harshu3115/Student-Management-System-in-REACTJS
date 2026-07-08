import React, { useState } from 'react'
import { api } from './service'
import ShowAllUsers from './components/ShowAllUsers'
import ShowAllStd from './components/ShowAllStd'
import UserRegistrationForm from './components/UserRegistrationForm'
import StdRegistrationForm from './components/StdRegistrationForm'
import Login from './components/Login'
import { toast } from "react-toastify";

const App = () => {

  const [user, setUser] = useState([])
  const [std, setStd] = useState([])
  const [editStd, setEditStd] = useState(null)
  const [editUser, setEditUser] = useState(null)
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [showUserTable, setShowUserTable] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showStudentTable, setShowStudentTable] = useState(false);



  const handleGetUser = () => {
    api.get('/users').then((res) => {
      setUser(res.data)
    })
  }

  const showUserList = () => {
    api.get("/users")
      .then((res) => {
        setUser(res.data);
        setShowUserTable(true);
      })
      .catch((err) => console.log(err));
  };

  const handleGetStd = () => {
    api.get('/students').then((res) => {
      setStd(res.data)
      setShowStudentTable(true);
    })
  }

  const showStudentList = () => {
    api.get("/students")
      .then((res) => {
        setStd(res.data);
        setShowStudentTable(true);
      })
      .catch((err) => console.log(err));
  };

  const acceptData = (formData) => {
    api.post('/users', formData).then((res) => {
      setUser((prev) => [...prev, res.data])
      setShowRegister(false)
      toast.success("User added Successful");
    })
  }

  const acceptStudentFormData = (stdFormData) => {
    api.post("/students", stdFormData).then((stdRes) => {
      setStd((prev) => [...prev, stdRes.data]);
      setShowStudentTable(true); // Show table
      toast.success("Student added successfully");
    });
  };

  const handleEditUser = (user) => {
    api.put(`/users/${user.id}`, user)
      .then((editUserResponse) => {
        setUser((prev) =>
          prev.map((item) =>
            item.id === user.id ? editUserResponse.data : item
          )
        )
        setEditUser(null)
        toast.success("User Update Successful");
      })
      .catch((error) => console.log(error))
  }

  const handleEditStd = (std) => {
    api.put(`/students/${std.id}`, std)
      .then((editStdResponse) => {
        setStd((prev) =>
          prev.map((item) =>
            item.id === std.id ? editStdResponse.data : item
          )
        )
        setEditStd(null)
        toast.success("Student update Successful");
      })
      .catch((stdError) => console.log(stdError))
  }

  if (!loggedInUser) {
    return showRegister ? (
      <UserRegistrationForm acceptData={acceptData}
        goToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login
        setLoggedInUser={setLoggedInUser}
        goToRegister={() => setShowRegister(true)}
      />
    );
  }
  return (
    <div>

      {loggedInUser.role === "admin" && (
        <>
          {!showUserTable ? (
            <UserRegistrationForm
              acceptData={acceptData}
              sendDataToForm={editUser}
              handleEditUser={handleEditUser}
              showUserList={showUserList}
            />
          ) : (
            <ShowAllUsers
              sendUser={user}
              setUser={setUser}
              setEditUser={setEditUser}
              loggedInUser={loggedInUser}
              setShowUserTable={setShowUserTable}
            />
          )}
        </>
      )}

      {loggedInUser.role === "faculty" && (
        <>
          {!showStudentTable ? (
            <StdRegistrationForm
              acceptStudentFormData={acceptStudentFormData}
              sendDataToStdForm={editStd}
              handleEditStd={handleEditStd}
              setShowStudentTable={setShowStudentTable}
              showStudentList={showStudentList}
            />
          ) : (
            <ShowAllStd
              sendStd={std}
              setStd={setStd}
              setEditstd={setEditStd}
              loggedInUser={loggedInUser}
              setShowStudentTable={setShowStudentTable}
            />
          )}
        </>
      )}

    </div>
  )
}

export default App