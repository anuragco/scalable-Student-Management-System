'use client';
import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  Calendar,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  BarChart3
} from 'lucide-react';
import '../Css/Dashboard.css';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState({
        totalstudent: 0,
        totalbooks: 0,
        attendance: {
            total: 0,
            present: 0,
            absent: 0,
            presentRatio: '0%',
            absentRatio: '0%'
        }
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('authToken'); 
        const response = await fetch('http://localhost:5000/v2/api/details', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
            if (!response.ok) {
                throw new Error('Failed to fetch dashboard data');
            }
            const data = await response.json();
            setDashboardData(data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            
        }
    };

    if(!dashboardData){
        return <div>Loading...</div>
    }

    return (
        <div className="dashboard">
            <nav className="navbar">
                <div className="navbar-content">
                    <h1 className="title">Student Management System</h1>
                    <div className="profile-section">
                        <div className="notification-badge">
                            <Bell size={20} />
                            <span className="badge">3</span>
                        </div>
                        <span>Admin</span>
                    </div>
                </div>
            </nav>

            <div className="main-container">
                {/* Sidebar */}
                <aside className="sidebar">
                    <a href="#" className="menu-item active">
                        <BarChart3 size={20} />
                        <span>Dashboard</span>
                    </a>
                    <a href="#" className="menu-item" onClick={()=>{navigate('/student')}}>
                        <Users size={20} />
                        <span>Students</span>
                    </a>
                    <a href="#" className="menu-item" onClick={()=>{navigate('/Lib')}}>
                        <BookOpen size={20} />
                        <span>Library</span>
                    </a>
                    <a href="#" className="menu-item" onClick={()=>{navigate('/attendence')}}>
                        <Calendar size={20} />
                        <span>Attendance</span>
                    </a>
                    <a href="#" className="menu-item" onClick={()=>{navigate('/fee')}}>
                        <CreditCard size={20} />
                        <span>Fees</span>
                    </a>
                    <a href="#" className="menu-item">
                        <Settings size={20} />
                        <span>Settings</span>
                    </a>
                    <a href="#" className="menu-item" onClick={()=>{localStorage.clear(); navigate('/')}}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </a>
                </aside>

                
                <main className="content">
                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="icon-container students-icon">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <p className="stat-title">Total Students</p>
                                    <h3 className="stat-value">{dashboardData.totalstudent}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="icon-container books-icon">
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <p className="stat-title">Books Issued</p>
                                    <h3 className="stat-value">{dashboardData.totalbooks}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="icon-container attendance-icon">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="stat-title">Attendance Rate</p>
                                    <h3 className="stat-value">{dashboardData.attendance.presentRatio}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="icon-container fees-icon">
                                    <CreditCard size={20} />
                                </div>
                                <div>
                                    <p className="stat-title">Fee Collection</p>
                                    <h3 className="stat-value">{dashboardData?.paymentCollected?.total?.[0]?.Total_payment == undefined ? "Loading" : dashboardData.paymentCollected.total[0].Total_payment}</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    
                    <div className="recent-activity">
                        <h2 className="activity-header">Recent Activity</h2>
                        <div className="activity-item">
                            <div className="activity-dot dot-green"></div>
                            <p className="activity-text">New student registration completed - John Doe</p>
                            <span className="activity-time">2 min ago</span>
                        </div>
                        <div className="activity-item">
                            <div className="activity-dot dot-blue"></div>
                            <p className="activity-text">Library book returned - "Introduction to Physics"</p>
                            <span className="activity-time">1 hour ago</span>
                        </div>
                        <div className="activity-item">
                            <div className="activity-dot dot-yellow"></div>
                            <p className="activity-text">Fee payment received - Sarah Smith</p>
                            <span className="activity-time">3 hours ago</span>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}