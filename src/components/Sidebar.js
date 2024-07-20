import React from 'react';
import { Menu } from 'antd';

import { HomeOutlined, StarOutlined, LoginOutlined, LogoutOutlined, MergeOutlined, QuestionOutlined } from '@ant-design/icons';
import logo from '../images/logo.png';
import '../styles/Sidebar.css';


export default function Sidebar({ toggleSidebar, userData, toggleLogin, logout, scrollToManual }) {
    return (
        <> 
            <div className='sidebar-wrapper' onClick={toggleSidebar}></div>
            <div className='menu-container' data-aos="fade-right">
                <Menu>
                    <div className='sidebar-logo'>
                        <img src={logo} alt='logo'/>
                        <span>ChefBooklet</span>
                    </div>
                    <Menu.Item key="home" icon={<HomeOutlined />} onClick={() => window.location.href = '/'}>
                        Home
                    </Menu.Item>
                    <Menu.Item key="favourites" icon={<StarOutlined />} disabled={userData.first_name ? false : true} onClick={() => window.location.href = '/account/favourites'}>
                        Favourites
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item key="contribute" icon={<MergeOutlined />} onClick={() => window.open('https://github.com/arnoldrudyi/chefbooklet-server')}>
                        Contribute
                    </Menu.Item>
                    <Menu.Item key="howto" icon={<QuestionOutlined />} onClick={() => scrollToManual()}>
                        How to use
                    </Menu.Item>
                    {userData.access ? (
                        <div className='sidebar-account-data'>
                            <span className='sidebar-account-data-avatar'>{userData.first_name.charAt(0)}</span>
                            <span className='sidebar-account-data-name'>{userData.first_name}</span>
                            <LogoutOutlined onClick={() => logout()}/>
                        </div>
                    ) : (
                        <Menu.Item key="login" id="login" icon={<LoginOutlined />} onClick={() => {
                            toggleSidebar();
                            toggleLogin();
                        }}>
                            Log in
                        </Menu.Item>
                    )}
                </Menu>
            </div>
        </>
    );
};