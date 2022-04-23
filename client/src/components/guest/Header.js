import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Drawer } from 'antd';
import { useSelector } from 'react-redux';

const navLinks = [
    { name: 'Home', to: '' },
    { name: 'Schedule', to: 'schedule' },
    { name: 'Teams', to: 'teams' },
    { name: 'Standings', to: 'standings' },
    // { name: 'Scoreboard', to: 'scoreboard' },
    { name: 'Stats', to: 'stats' },
    { name: 'More',
        to: 'more',
        subLinks: [
            { name: 'general inquiry', to: 'inquiry' },
            { name: 'league staff', to: 'schedule2' },
            { name: 'player registration', to: 'schedule222' },
        ],
    },
];


const Header = () => {
    const [visible, setVisible] = useState(false);

    const auth = useSelector(state => state.auth);

    return (
        <header className="mb-4 bg-primary">
            <div className="max-w-6xl m-auto py-2 sm:py-1 px-2 ">
                <div className="flex items-center justify-between">
                    <button type="button" className="py-3 sm:hidden" onClick={() => setVisible(true)}>
                        <div className="h-0.5 w-8 bg-white rounded" />
                        <div className="h-0.5 my-1.5 w-8 bg-white rounded" />
                        <div className="h-0.5 w-8 bg-white rounded" />
                        {/* <div className="h-1 w-10 bg-red-400 rounded"></div> */}
                        {/* <div className="h-1 self-end w-6 mt-2 bg-red-400 rounded ml-[40%]"></div> */}
                    </button>

                    <div className="flex">


                        <div className="flex items-center">
                            <img src="/images/logo.png" alt="Logo" className="h-12 sm:h-19 sm:-mb-7" />
                            {/* <h5 className="ml-8">USHL</h5> */}
                        </div>

                        <nav className="pl-4 hidden sm:block">
                            <ul className="flex">
                                {navLinks.map(link => (
                                    <li key={link.to} className="p-3 relative group text-white uppercase ">
                                        {/* <NavLink to={`${link.to}`} exact activeClassName="border-b-2 border-secondary" className="hover:text-secondary" onClick={() => console.log(`to ${link.to}`)}>
                                                {link.name}
                                                {link.subLinks && (<div className="arrow" />)}
                                            </NavLink> */}

                                        <NavLink
                                            to={link.to}
                                            className={({ isActive }) => (isActive ? 'pb-1 text-secondary border-b-2 border-secondary hover:text-secondary' : 'hover:text-secondary')}
                                        >
                                            {link.name}
                                            {link.subLinks && (<div className="arrow" />)}
                                        </NavLink>


                                        {link.subLinks && (
                                            <ul className="absolute hidden group-hover:block bg-white shadow-lg py-3 px-5 top-full">
                                                {link.subLinks.map(subLink => (
                                                    <li key={subLink.to} className="whitespace-nowrap py-2 text-black">
                                                        {/* <NavLink to={`${subLink.to}`} exact activeClassName="selected" className="hover:text-secondary" onClick={() => console.log(`to ${link.to}`)}>
                                                                {subLink.name}
                                                            </NavLink> */}

                                                        <NavLink
                                                            to={subLink.to}
                                                            className={({ isActive }) => (isActive ? 'pb-1 border-b-2 border-secondary hover:text-secondary' : 'hover:text-secondary')}
                                                            onClick={() => console.log(`linking to: ${link.to}`)}
                                                        >
                                                            {subLink.name}
                                                        </NavLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    <div className="p-3 relative group text-white uppercase ">
                        <NavLink
                            to="login"
                            // to={auth.isAuthenticated ? '/dashboard' : '/login'}
                            className={({ isActive }) => (isActive ? 'pb-1 text-secondary border-b-2 border-secondary hover:text-secondary' : 'hover:text-secondary')}
                        >
                            {/* Login */}
                            {auth.isAuthenticated ? 'Dashboard' : 'Login'}
                        </NavLink>
                    </div>

                </div>

                <Drawer
                    // title="Basic Drawer"
                    width="80%"
                    placement="left"
                    closable={false}
                    onClose={() => setVisible(false)}
                    visible={visible}
                >
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Drawer>


                {/*
                    <nav className="bg-pink-100 p-5 border-b border-black">
                        <Link to="/">Home</Link> |{" "}
                        <Link to="/invoices">Invoices</Link> |{" "}
                        <Link to="/expenses">Expenses</Link> |{" "}
                        <Link to="/expense">Expense</Link> |{" "}
                        <Link to="/dashboard">Private</Link>
                    </nav> */}
            </div>


        </header>
    );
};

export default Header;

// //
// <div>
// <Input placeholder="Basic usage" />
// </div>
// <nav>

// <ul>
//     {navLinks.map(link => (
//         <li key={link.to}>
//             {/* <NavLink to={`${match.url}${link.to}`} exact activeClassName="selected" onClick={() => console.log(`to ${link.to}`)}> */}
//             <NavLink to={`${link.to}`} exact activeClassName="selected" onClick={() => console.log(`to ${link.to}`)}>

//                 {link.name}
//                 {link.subLinks && (<div className="arrow" />)}
//             </NavLink>

//             {link.subLinks && (

//                 <ul className="sub-links box-shadow">
//                     {link.subLinks.map(subLink => (
//                         <li key={subLink.to}>
//                             {/* <NavLink to={`${match.url}${subLink.to}`} exact activeClassName="selected" onClick={() => console.log(`to ${link.to}`)}> */}
//                             <NavLink to={`${subLink.to}`} exact activeClassName="selected" onClick={() => console.log(`to ${link.to}`)}>
//                                 {subLink.name}
//                             </NavLink>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </li>
//     ))}
// </ul>
// </nav>
