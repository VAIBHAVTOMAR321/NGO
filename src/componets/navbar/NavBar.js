import React, { useState, useEffect } from 'react';
import "../../assets/css/mainstyle.css"
import { Link } from 'react-router-dom';
import EventLogo from '../../assets/images/br-event-logo.png'
import { Button, Container } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaWhatsapp, FaInstagram } from 'react-icons/fa';
   
function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  
  // Initialize language from localStorage directly
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || 'english';
  });

  // Language translations
  const translations = {
    english: {
      home: 'Home',
      about: 'About',
      aboutUs: 'About Us',
      donations: 'Donations',
      events: 'Events',
      activity: 'Activity',
      registration: 'Registration',
      memberRegistration: 'Member Registration',
      associatedWings: 'Associated Wings',
      contact: 'Contact',
      // feedback: 'FeedBack',
      login: 'Login',
      admin: 'admin@ngo.in',
      phone: '+91-9876543210'
    },
    hindi: {
      home: 'होम',
      about: 'परिचय',
      aboutUs: 'हमारे बारे में',
      donations: 'दान',
      events: 'आयोजन',
      activity: 'गतिविधि',
      registration: 'पंजीकरण',
      memberRegistration: 'सदस्य पंजीकरण',
      associatedWings: 'संबद्ध विंग',
      contact: 'संपर्क',
      // feedback: 'प्रतिक्रिया',
      login: 'लॉगिन',
      admin: 'admin@ngo.in',
      phone: '+91-9876543210'
    }
  };

  // Get current language translations with fallback
  const currentLang = translations[language] || translations['english'];

  // --- CHANGE 1: Improved toggleMenu function ---
  const toggleMenu = () => {
    // If the menu is currently open, reset the dropdowns when closing it.
    if (isMenuOpen) {
      setOpenDropdowns({});
    }
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (key) => {
    setOpenDropdowns(prevState => ({
      ...prevState,
      [key]: !prevState[key]
    }));
  };

  return (
    <>
      <div className='top-nav d-flex align-items-center'>
        <Container className='container-fluid container-xl d-flex justify-content-center justify-content-md-between'>
          <div className='d-flex align-items-center'>
            <i className="bi bi-envelope-fill d-flex align-items-center ms-4 mx-3"><span className='mx-1'> {currentLang.admin}</span></i>
            <i className="bi bi-phone d-flex align-items-center"><span className='mx-1'>{currentLang.phone}</span></i>
          </div> 
          <div className='social-links d-none d-md-flex align-items-center'>
            <ul className="event-social-link">
              <li>
                <Link to="#" data-discover="true">
                  <FaFacebook className="social-icon facebook-icon" />
                </Link>
              </li>
              <li>
                <Link to="#" data-discover="true">
                  <FaTwitter className="social-icon twitter-icon" />
                </Link>
              </li>
              <li>
                <Link to="#" data-discover="true">
                  <FaWhatsapp className="social-icon whatsapp-icon" />
                </Link>
              </li>
              <li>
                <Link to="#" className="text-light" data-discover="true">
                  <FaInstagram className="social-icon instagram-icon" />
                </Link>
              </li>
            </ul>
            <ul className='d-flex align-items-center gap-3 nav-space' type='none'>
              {/* Language Toggle */}
              <li className='d-flex align-items-center gap-2 mb-0' style={{ marginTop: '0px' }}>
                <Button 
                  onClick={() => {
                    setLanguage('english');
                    localStorage.setItem('appLanguage', 'english');
                    // Dispatch custom event for other components
                    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: 'english' } }));
                  }}
                  className="lang-btn"
                  style={{ 
                    backgroundColor: 'white', 
                    color: 'blue',
                    border: language === 'english' ? '2px solid blue' : '1px solid #ccc',
                    fontSize: '14px',
                    padding: '0px 6px 0px 6px',
                  }}
                >
                  EN
                </Button>
                <Button 
                  onClick={() => {
                    setLanguage('hindi');
                    localStorage.setItem('appLanguage', 'hindi');
                    // Dispatch custom event for other components
                    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: 'hindi' } }));
                  }}
                  className="lang-btn"
                  style={{ 
                    backgroundColor: 'white', 
                    color: 'blue',
                    border: language === 'hindi' ? '2px solid blue' : '1px solid #ccc',
                    fontSize: '14px',
                    padding: '0px 6px 0px 6px',
                  }}
                >
                  HI
                </Button>
              </li>
              <li><Button as={Link} to="/Login" variant="primary" className="login-btn">{currentLang.login}</Button></li>
            </ul>
          </div>
        </Container>
      </div>
      
      <div className='sticky-top'>
        <header id="header" className={`header d-flex align-items-center sticky-top ${isMenuOpen ? 'mobile-nav-active' : ''}`}>
          <div className="header-container container-fluid container-xl position-relative d-flex align-items-center justify-content-end">
            <Link to="/" className="logo d-flex align-items-center me-auto">
              {/* <img src={EventLogo} alt="logo" className="logo-wecd" /> */}
              <h1 className="sitename">Demo NGO</h1>
            </Link>
            <nav id="navmenu" className={`navmenu ${isMenuOpen ? 'navmenu-active' : ''}`}>
              <ul>
                {/* --- CHANGE 2: Added onClick to close menu on link click --- */}
                <li><Link to="/" onClick={() => setIsMenuOpen(false)} className="active">{currentLang.home}</Link></li>
                
                <li className={`dropdown ${openDropdowns['about'] ? 'dropdown-active' : ''}`}>
                  <Link to="#about" onClick={(e) => { e.preventDefault(); toggleDropdown('about'); }}>
                    <span>{currentLang.about}</span> <i className={`bi bi-chevron-down toggle-dropdown ${openDropdowns['about'] ? 'rotate-icon' : ''}`}></i>
                  </Link>
                  <ul style={{ display: openDropdowns['about'] ? 'block' : 'none' }}>
                    <li><Link to="/AboutUs" onClick={() => setIsMenuOpen(false)}>{currentLang.aboutUs}</Link></li>
                  </ul>
                </li>

                <li><Link to="/DonationSociety" onClick={() => setIsMenuOpen(false)}>{currentLang.donations}</Link></li>
                
                <li className={`dropdown ${openDropdowns['events'] ? 'dropdown-active' : ''}`}>
                  <Link to="#events" onClick={(e) => { e.preventDefault(); toggleDropdown('events'); }}>
                    <span>{currentLang.events}</span> <i className={`bi bi-chevron-down toggle-dropdown ${openDropdowns['events'] ? 'rotate-icon' : ''}`}></i>
                  </Link>
                  <ul style={{ display: openDropdowns['events'] ? 'block' : 'none' }}>
                    <li><Link to="/Activity" onClick={() => setIsMenuOpen(false)}>{currentLang.activity}</Link></li>
                  </ul>
                </li>
                
                <li className={`dropdown ${openDropdowns['registration'] ? 'dropdown-active' : ''}`}>
                  <Link to="#registration" onClick={(e) => { e.preventDefault(); toggleDropdown('registration'); }}>
                    <span>{currentLang.registration}</span> <i className={`bi bi-chevron-down toggle-dropdown ${openDropdowns['registration'] ? 'rotate-icon' : ''}`}></i>
                  </Link>
                  <ul style={{ display: openDropdowns['registration'] ? 'block' : 'none' }}>
                    <li><Link to="/Registration" onClick={() => setIsMenuOpen(false)}>{currentLang.memberRegistration}</Link></li>
                    {/* <li><Link to="/MembersList" onClick={() => setIsMenuOpen(false)}>Members List</Link></li> */}
                  </ul>
                </li>

                <li><Link to="/AssociatedWings" onClick={() => setIsMenuOpen(false)}>{currentLang.associatedWings}</Link></li>
                <li><Link to="/ContactUs" onClick={() => setIsMenuOpen(false)}>{currentLang.contact}</Link></li>
                {/* <li><Link to="/FeedbackPage" onClick={() => setIsMenuOpen(false)}>{currentLang.feedback}</Link></li> */}
              </ul>
              <i
                className={`mobile-nav-toggle d-xl-none bi ${isMenuOpen ? 'bi-x' : 'bi-list'}`}
                onClick={toggleMenu}
              ></i>
            </nav>
          </div>
        </header>
      </div>
    </>
  )
}

export default NavBar;