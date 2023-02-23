import { useState, useEffect } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

export const Register = () => {
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    const form = e.target;
    const user = {
      email: form[0].value,
      password: form[1].value,
    };

    fetch(apiUrl + "/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage(err));
  }

  useEffect(() => {
    fetch(apiUrl + "/isUserAuth", {
      headers: { "x-access-token": localStorage.getItem("token") },
    })
      .then((res) => res.json())
      .then((data) => (data.isLoggedIn ? navigate("/") : null));
  }, []);

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="flex flex-col items-center p-12 px-24 bg-[#ffffffb9] rounded-md w-[575px]">
        <h1 className="mb-14 text-5xl font-extrabold text-center">Register</h1>
        <form
          className="flex flex-col mb-8"
          onSubmit={(e) => handleRegister(e)}
        >
          <label htmlFor="email" className="flex items-center mb-6">
            <p className="w-24">Email:</p>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              id="email"
              required
              className="p-3 ml-4 rounded placeholder-[#808080] focus:outline-[#613E4C]"
            />
          </label>
          <label htmlFor="password" className="flex items-center mb-6">
            <p className="w-24">Password:</p>
            <input
              type="password"
              name="password"
              placeholder="Enter a password"
              id="password"
              required
              className="p-3 ml-4 rounded placeholder-[#808080] focus:outline-[#613E4C]"
            />
          </label>
          <input
            type="submit"
            value="Submit"
            className="px-4 py-2 mt-8 font-semibold shadow text-white bg-[#613E4C] hover:bg-[#5a3946] hover:cursor-pointer rounded "
          />
          {message === "Success" ? (
            <Navigate to="/login" />
          ) : (
            <p className="mt-2 text-sm text-red-800">{message}</p>
          )}
        </form>
        <div className=" text-[#303030] ">
          <Link to="/login">
            Already have an account ?{" "}
            <span className="ml-2 underline hover:text-[#0e0e0e]">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
