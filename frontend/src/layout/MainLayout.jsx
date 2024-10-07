import { useState } from "react";
import { CiLogout } from "react-icons/ci";
import { IoClose, IoMenu } from "react-icons/io5";
import { Link, NavLink, Outlet } from "react-router-dom";
import { RiFileAddFill } from "react-icons/ri";
import { IoPieChartSharp } from "react-icons/io5";
import { FaFilePrescription } from "react-icons/fa";

function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  //   toogle bar for mobile view
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div className="relative min-h-screen flex">
        {/* Sidebar */}
        <aside
          className={`flex flex-col w-96 h-screen px-5 py-8 overflow-y-auto bg-blue-500 border-r rtl:border-r-0 rtl:border-l fixed top-0 left-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300 ease-in-out z-20`}
        >
          {/* Close button for mobile */}
          <button className="lg:hidden self-end p-2" onClick={toggleSidebar}>
            <IoClose size={24} color="#fff" />
          </button>

          <Link to={"/"}>
            <p className="text-center text-4xl font-bold text-white">CuraRx</p>
          </Link>

          <div className="flex flex-col gap-4 flex-1 mt-6">
            {/* content routes are here */}
            <NavLink
              to={"/"}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center px-3 py-2 text-white transition-colors duration-300 transform rounded-lg bg-black"
                  : "flex items-center px-3 py-2 text-black transition-colors duration-300 transform rounded-lg bg-blue-400"
              }
            >
              <IoPieChartSharp size={25} />
              <span className="mx-2 font-medium">Overview</span>
            </NavLink>

            <NavLink
              to={"/prescription"}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center px-3 py-2 text-white transition-colors duration-300 transform rounded-lg bg-black"
                  : "flex items-center px-3 py-2 text-black transition-colors duration-300 transform rounded-lg bg-blue-400"
              }
            >
              <FaFilePrescription size={25} />
              <span className="mx-2 font-medium">Prescriptions</span>
            </NavLink>

            <NavLink
              to={"/create-prescription"}
              className={({ isActive }) =>
                isActive
                  ? "flex items-center px-3 py-2 text-white transition-colors duration-300 transform rounded-lg bg-black"
                  : "flex items-center px-3 py-2 text-black transition-colors duration-300 transform rounded-lg bg-blue-400"
              }
            >
              <RiFileAddFill size={25} />
              <span className="mx-2 font-medium">Create Prescription</span>
            </NavLink>
          </div>

          {/* Footer logout btn */}
          <div className="pb-10">
            <button
              //   onClick={logout}
              className="flex w-full items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-300 bg-rose-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
            >
              <CiLogout size={20} color="#fff" />
              <span className="mx-2 text-sm font-medium text-white">
                Logout
              </span>
            </button>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 lg:hidden z-10 transition-opacity ${
            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={toggleSidebar}
        ></div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto lg:ml-96">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-4 focus:outline-none focus:bg-gray-200"
            onClick={toggleSidebar}
          >
            <IoMenu size={24} />
          </button>
          <div className="p-5">
            {/* <p className="text-center font-bold text-5xl">Welcome to CuraRx</p> */}
            <Outlet />
          </div>
        </div>
      </div>
      );
    </>
  );
}

export default MainLayout;
