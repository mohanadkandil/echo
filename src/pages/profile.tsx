import { Container, Navigation } from "../components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

export const Profile = () => {
  const [checkedAuthentication, setCheckedAuthentication] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  // GET user data
  //   const getData = () => {
  //     fetch(apiUrl + "/userInfo", {
  //         headers: {'x-access-token': localStorage.getItem('token')},,
  //     })
  //     .then((res) => res.json())
  //     .then((data) => setEmail(data.email))
  //   }

  //   useEffect(() => {
  //     getData()
  //   }, [])

  // Update profile
  const updateProfile = (e) => {
    e.preventDefault();

    const form = e.target;
    const user = {
      email: form[0].value,
      password: form[1].value,
    };

    fetch(apiUrl + "/updateUserInfo", {
      method: "POST",
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage(err));
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Delete profile
  const deleteProfile = () => {
    fetch(apiUrl + "/deleteUser", {
      method: "DELETE",
      headers: {
        "x-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) =>
        data.message === "Deleted" ? logout() : setMessage(data.message)
      )
      .catch((err) => setMessage(err));
  };

  // useEffect(() => {
  //     fetch(apiUrl + "/isUserAuth", {
  //         headers: {'x-access-token': localStorage.getItem('token')},
  //     })
  //     .then((res) => res.json())
  //     .then((data) => {
  //         setCheckedAuthentication(true);
  //         if(!data.isLoggedIn) navigate("/login")
  //     })
  // }, [])

  // TODO: check if not authenticated

  return (
    <>
      <Container>
        <Navigation />
        <form
          className="flex flex-col justify-center items-center mt-7 w-full h-full"
          onSubmit={(e) => {
            updateProfile(e);
          }}
        >
          <label htmlFor="email" className="flex items-center mb-12">
            <p className="w-48">Email:</p>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              disabled
              required
              className="p-3 ml-4 w-full rounded"
            />
          </label>
          <label htmlFor="password" className="flex items-center mb-6">
            <p className="w-48">New password:</p>
            <input
              type="password"
              name="password"
              placeholder="Enter a new password"
              required
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              className="p-3 ml-4 rounded placeholder-[#808080] w-full shadow-inner"
            />
          </label>
          <div className="flex gap-14 justify-end mt-12">
            <button
              className=" px-4 py-2  text-lg   text-[#999999] bg-[#F2F2F2] border-2 border-transparent hover:border-[#AC4B51] hover:text-[#AC4B51]  hover:cursor-pointer rounded "
              onClick={() => {
                const confirmBox = window.confirm(
                  "Are you sure you want to delete your account?"
                );
                if (confirmBox === true) {
                  // deleteUser();
                  logout();
                }
              }}
            >
              Delete account
            </button>
            <input
              type="submit"
              value="Save"
              className="px-6 font-medium text-lg shadow bg-[#FCD095] hover:bg-[#f7c481] hover:cursor-pointer rounded "
            />
          </div>
        </form>
        {message === "Your profile has been updated." ? (
          <p className="text-sm text-[#0e2724] mb-6">{message + ""}</p>
        ) : (
          <p className="text-sm text-red-800">{message + ""}</p>
        )}
      </Container>
    </>
  );
};
