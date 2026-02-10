import React, { useState, useEffect } from 'react';
import "../../assets/css/mainstyle.css";
import { Link } from 'react-router-dom';
import EventLogo from '../../assets/images/br-event-logo.png';
import { Container } from 'react-bootstrap';

// Footer translations
const translations = {
    english: {
      sitename: 'NGO',
      address1: 'A108 Adam Street',
      address2: 'New York, NY 535022',
      email: 'admin@ngo.in',
      usefulLinks: 'Useful Links',
      home: 'Home',
      aboutUs: 'About Us',
      donations: 'Donations',
      activity: 'Activity',
      associatedWings: 'Associated Wings',
      registration: 'Registration',
      memberRegistration: 'Member Registration',
      membersList: 'Members List',
      login: 'Login',
      terms: 'Terms of service',
      privacy: 'Privacy policy',
      events: 'Events',
      upcomingEvents: 'Upcoming Events',
      pastEvents: 'Past Events',
      eventCalendar: 'Event Calendar',
      eventGallery: 'Event Gallery',
      eventReports: 'Event Reports',
      contact: 'Contact',
      getInTouch: 'Get in Touch',
      support: 'Support',
      faq: 'FAQ',
      volunteer: 'Volunteer',
      partnerships: 'Partnerships',
      copyright: '© Copyright',
      allRights: 'All Rights Reserved',
      designedBy: 'Designed by',
      designer: 'Brainrock',
      ngoEvents: 'NGO Events',
      organizationDescription: 'Organization Description',
      eventDescription: 'Event Description',
      ongoingEvents: 'Ongoing Events',
      contactUs: 'Contact Us',
      feedback: 'Feedback',
    },
    hindi: {
      sitename: 'एनजीओ',
      address1: 'ए108 एडम स्ट्रीट',
      address2: 'न्यूयॉर्क, एनवाई 535022',
      email: 'admin@ngo.in',
      usefulLinks: 'उपयोगी लिंक',
      home: 'होम',
      aboutUs: 'हमारे बारे में',
      donations: 'दान',
      activity: 'गतिविधि',
      associatedWings: 'संबद्ध विंग्स',
      registration: 'पंजीकरण',
      memberRegistration: 'सदस्य पंजीकरण',
      membersList: 'सदस्य सूची',
      login: 'लॉगिन',
      terms: 'सेवा की शर्तें',
      privacy: 'गोपनीयता नीति',
      events: 'आयोजन',
      upcomingEvents: 'आगामी आयोजन',
      pastEvents: 'पिछले आयोजन',
      eventCalendar: 'आयोजन कैलेंडर',
      eventGallery: 'आयोजन गैलरी',
      eventReports: 'आयोजन रिपोर्ट',
      contact: 'संपर्क',
      getInTouch: 'संपर्क करें',
      support: 'सहायता',
      faq: 'सामान्य प्रश्न',
      volunteer: 'स्वयंसेवक',
      partnerships: 'साझेदारी',
      copyright: '© कॉपीराइट',
      allRights: 'सर्वाधिकार सुरक्षित',
      designedBy: 'डिज़ाइनर',
      designer: 'ब्रेनरॉक',
      ngoEvents: 'एनजीओ इवेंट्स',
      organizationDescription: 'संगठन विवरण',
      eventDescription: 'कार्यक्रम विवरण',
      ongoingEvents: 'चालू कार्यक्रम',
      contactUs: 'संपर्क करें',
      feedback: 'प्रतिक्रिया',
    }
  };

function Footer() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || 'english';
  });
  const currentLang = translations[language] || translations['english'];

  useEffect(() => {
    const handleLanguageChange = (e) => {
      setLanguage(e.detail.language);
    };
    window.addEventListener('languageChange', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  const toggleDropdown = (key) => {
    setOpenDropdowns(prevState => ({
      ...prevState,
      [key]: !prevState[key]
    }));
  };

  return (
    <footer id="footer" className="footer position-relative" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
      <div className="container footer-top">
        <div className="row gy-4">
          <div className="col-lg-4 col-md-6 footer-about">
            <Link to="/" className="logo d-flex align-items-center">
              {/* <img src={EventLogo} alt="logo" className="logo-wecd" /> */}
              <span className="sitename" style={{ color: '#ffffff' }}>{currentLang.sitename}</span>
            </Link>
            <div className="footer-contact pt-3">
              <p style={{ color: '#ffffff' }}>{currentLang.address1}</p>
              <p style={{ color: '#ffffff' }}>{currentLang.address2}</p>
              <p style={{ color: '#ffffff' }}><strong>Email:</strong> <span>{currentLang.email}</span></p>
            </div>
            <div className="social-links d-flex mt-4">
              <a href="#" style={{ color: '#ffffff' }}><i className="bi bi-twitter-x"></i></a>
              <a href="#" style={{ color: '#ffffff' }}><i className="bi bi-facebook"></i></a>
              <a href="#" style={{ color: '#ffffff' }}><i className="bi bi-instagram"></i></a>
              <a href="#" style={{ color: '#ffffff' }}><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

           <div className="col-lg-2 col-md-3 footer-links">
            <h4 style={{ color: '#ffffff' }}>{currentLang.usefulLinks}</h4>
            <ul>
              <li><Link to="/" style={{ color: '#ffffff' }}>{currentLang.home}</Link></li>
              <li><Link to="/#about" style={{ color: '#ffffff' }}>{currentLang.aboutUs}</Link></li>
              <li><Link to="/#organisation" style={{ color: '#ffffff' }}>{currentLang.organizationDescription}</Link></li>
              <li><Link to="/#events" style={{ color: '#ffffff' }}>{currentLang.eventDescription}</Link></li>
              <li><Link to="/DonationSociety" style={{ color: '#ffffff' }}>{currentLang.donations}</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 footer-links">
            <h4 style={{ color: '#ffffff' }}>{currentLang.registration}</h4>
            <ul>
              <li><Link to="/AssociatedWings" style={{ color: '#ffffff' }}>{currentLang.associatedWings}</Link></li>
              <li><Link to="/Registration" style={{ color: '#ffffff' }}>{currentLang.memberRegistration}</Link></li>
              <li><Link to="/Login" style={{ color: '#ffffff' }}>{currentLang.login}</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 footer-links">
            <h4 style={{ color: '#ffffff' }}>{currentLang.events}</h4>
            <ul>
              <li><Link to="/Activity?tab=upcoming" style={{ color: '#ffffff' }}>{currentLang.upcomingEvents}</Link></li>
              <li><Link to="/Activity?tab=ongoing" style={{ color: '#ffffff' }}>{currentLang.ongoingEvents}</Link></li>
              <li><Link to="/Activity?tab=past" style={{ color: '#ffffff' }}>{currentLang.pastEvents}</Link></li>
              <li><Link to="/Activity?tab=gallery" style={{ color: '#ffffff' }}>{currentLang.eventGallery}</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 footer-links">
            <h4 style={{ color: '#ffffff' }}>{currentLang.contact}</h4>
            <ul>
              <li><Link to="/ContactUs" style={{ color: '#ffffff' }}>{currentLang.contactUs}</Link></li>
              <li><Link to="/Feedback" style={{ color: '#ffffff' }}>{currentLang.feedback}</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container copyright text-center mt-4">
        <p style={{ color: '#ffffff' }}>{currentLang.copyright} <strong className="px-1 sitename">{currentLang.ngoEvents}</strong> <span>{currentLang.allRights}</span></p>
        <div className="credits">
          {currentLang.designedBy} <a href="https://bootstrapmade.com/" style={{ color: '#ffffff' }}>{currentLang.designer}</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;