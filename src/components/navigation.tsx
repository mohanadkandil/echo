import { useNavigate, Link } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const pathname = window.location.pathname;

  return (
    <ul className="pt-2 px-2 flex justify-between w-full text-[#7A7979] ">
      <div>
        <div className="flex gap-16">
          <li className="hover:font-semibold hover:text-[#2f2f2f] w-24">
            <Link to="/record">New record</Link>
          </li>
          <li
            className={`${
              pathname === "/" ? "text-[#2f2f2f] font-semibold" : null
            } hover:font-semibold hover:text-[#2f2f2f] w-24`}
          >
            {" "}
            <Link to="/">My records</Link>
          </li>
          <li
            className={`${
              pathname === "/profile" ? "text-[#2f2f2f] font-semibold" : null
            } hover:font-semibold hover:text-[#2f2f2f] w-24`}
          >
            <Link to="/profile">Profile</Link>
          </li>
        </div>
      </div>
      <li>
        <button
          onClick={() => {
            const confirmBox = window.confirm(
              "Are you sure you want to leave?"
            );
            if (confirmBox === true) {
              logout();
            }
          }}
          className="hover:cursor-pointer flex items-center hover:text-[#2f2f2f]"
        >
          Logout
        </button>
      </li>
    </ul>
  );
};
