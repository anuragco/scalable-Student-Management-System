import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Book, Calendar, ChartBar, Mail, 
  Shield, Globe, Award, ArrowRight,
  GraduationCap, BookOpen, Library
} from 'lucide-react';
import '../Css/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const stats = [
    { number: "1000+", label: "Students" },
    { number: "50+", label: "Teachers" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support" },
  ];

  const features = [
    {
      icon: <Users size={24} />,
      title: "Student Management",
      description: "Comprehensive student profile management with advanced tracking capabilities"
    },
    {
      icon: <Calendar size={24} />,
      title: "Attendance Tracking",
      description: "Automated attendance system with real-time monitoring and reporting"
    },
    {
      icon: <ChartBar size={24} />,
      title: "Performance Analytics",
      description: "Detailed analytics and insights into student performance metrics"
    },
    {
      icon: <Book size={24} />,
      title: "Course Management",
      description: "Streamlined course organization and curriculum planning tools"
    },
    {
      icon: <Shield size={24} />,
      title: "Secure Platform",
      description: "Enterprise-grade security for protecting sensitive student data"
    },
    {
      icon: <Mail size={24} />,
      title: "Communication Hub",
      description: "Integrated messaging system for students, teachers, and staff"
    }
  ];

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="nav-container">
        <div className="nav-content">
          <div className="nav-logo">
            <GraduationCap size={32} color="#2563eb" />
            <span className="nav-logo-text">Lovely Professional University</span>
          </div>
          <button className="nav-button" onClick={() => navigate('/login')}>
            Login <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Transform Your <span style={{color: '#2563eb'}}>Educational</span> Institution
            </h1>
            <p className="hero-subtitle">
              Streamline administration, enhance learning experiences, and drive student success 
              with our comprehensive management system.
            </p>
            <div className="hero-buttons">
              <button 
                className="primary-button"
                onClick={() => navigate('/login')}
              >
                Get Started
              </button>
              <button className="secondary-button">
                Learn More
              </button>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: '#2563eb',
              borderRadius: '50%',
              opacity: 0.1,
              filter: 'blur(40px)'
            }}></div>
            <img
              src="https://educationtechnologysolutions.com/wp-content/uploads/2018/06/educational-resources.jpg"
              alt="Education Management"
              style={{
                position: 'relative',
                width: '100%',
                borderRadius: '0.5rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2 className="features-title">Powerful Features</h2>
          <p className="features-subtitle">
            Everything you need to manage your educational institution efficiently and effectively.
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-card">
            <h2 className="cta-title">Ready to Transform Your Institution?</h2>
            <p className="cta-description">
              Join thousands of educational institutions that have already revolutionized 
              their management processes.
            </p>
            <button 
              className="cta-button"
              onClick={() => navigate('/login')}
            >
              Get Started Today
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <GraduationCap size={24} />
                <span>Lovely</span>
              </div>
              <p className="footer-description">
                Empowering educational institutions with modern management solutions.
              </p>
            </div>

            <div className="footer-section">
              <h4>Features</h4>
              <ul className="footer-links">
                <li>Student Management</li>
                <li>Attendance Tracking</li>
                <li>Performance Analytics</li>
                <li>Course Management</li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Resources</h4>
              <ul className="footer-links">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Support Center</li>
                <li>Privacy Policy</li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Contact</h4>
              <ul className="footer-links">
                <li>aws.anu.co@gmail.com</li>
                <li>+91 9631584507</li>
                <li>Phagwara Law Gate</li>
                <li>India Bihar 144411</li>
              </ul>
            </div>
          </div>

          <div className="footer-copyright">
            © 2024 Lovely Professional University. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;