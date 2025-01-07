import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";

export default function Header() {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const handleLogout = () => {
        
    }
    return (
        <header className="shadow sticky z-50 top-0">
            <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    <Link to="/" className="flex items-center">
                        <img
                            src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png"
                            className="mr-3 h-12"
                            alt="Logo"
                        />
                    </Link>
                    <div className="flex items-center lg:order-2">
                    {isAuthenticated ? (
                        <>
                           <div className='flex flex-col mr-4'>
                            <span className=" text-gray-800">
                                Welcome, {user.fullName}
                            </span>
                            <span>({user.role === "admin" ? "Admin" : "User"})</span> 
                           </div>
                            <button
                            onClick={handleLogout}
                            className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 focus:outline-none"
                            >
                            Logout
                            </button>
                        </>
                        ):(<Link
                            to="#"
                            className="text-white bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none"
                        >
                            Login/Signup
                        </Link>)}
                    </div>
                    <div
                        className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                        id="mobile-menu-2"
                    >
                        <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                            <li>
                                <NavLink
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 ${!isActive? "text-gray-700" : "text-orange-700"} hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                    to="/"
                                >
                                    Listings
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 ${!isActive? "text-gray-700" : "text-orange-700"} hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                    to="/admin"
                                >
                                    Dashboard (Admin)
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    className={({isActive}) =>
                                        `block py-2 pr-4 pl-3 duration-200 border-b border-gray-100 ${!isActive? "text-gray-700" : "text-orange-700"} hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-orange-700 lg:p-0`
                                    }
                                    to="/user"
                                >
                                    Dashboard (User)
                                </NavLink>
                            </li>
                            
                            
                            
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}

