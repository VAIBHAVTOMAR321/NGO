// src/components/HeroCarousel.js
import React, { useState, useEffect } from 'react';
import { Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "../../assets/css/mainstyle.css";
import "../../assets/css/AnimatedCarousel.css";

function EventCarousel() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showNewsCard, setShowNewsCard] = useState(true);
  const [latestNews, setLatestNews] = useState(null);
  
  // Initialize language from localStorage directly
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || 'english';
  });

  // Listen for language changes from navbar
  useEffect(() => {
    const handleLanguageChange = (event) => {
      const newLanguage = event.detail?.language || 'english';
      setLanguage(newLanguage);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  // Fetch carousel data from API
  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        setIsLoading(true);
        const langParam = language === 'hindi' ? 'hi' : 'en';
        const response = await fetch(`https://mahadevaaya.com/ngoproject/ngoproject_backend/api/carousel1-item/?lang=${langParam}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        console.log(`Carousel ${language.toUpperCase()} API Response:`, data);
        
        if (data.success && data.data) {
          // For Hindi, we need to fall back to English if Hindi data is missing
          // Fetch both English and Hindi data to merge
          if (language === 'hindi') {
            // Fetch English data as fallback
            const enResponse = await fetch('https://mahadevaaya.com/ngoproject/ngoproject_backend/api/carousel1-item/?lang=en');
            const enData = await enResponse.json();
            
            // Create a map of English data by ID
            const enMap = {};
            if (enData.success && enData.data) {
              enData.data.forEach(item => {
                enMap[item.id] = item;
              });
            }
            
            // Transform and merge data
            const transformedSlides = data.data.map(item => ({
              id: item.id,
              title: item.title_hi || enMap[item.id]?.title || '',
              subtitle: item.sub_title_hi || enMap[item.id]?.sub_title || '',
              description: item.description_hi || enMap[item.id]?.description || '',
              image: `https://mahadevaaya.com/ngoproject/ngoproject_backend${item.image}`
            }));
            
            setCarouselSlides(transformedSlides);
          } else {
            // English data
            const transformedSlides = data.data.map(item => ({
              id: item.id,
              title: item.title || '',
              subtitle: item.sub_title || '',
              description: item.description || '',
              image: `https://mahadevaaya.com/ngoproject/ngoproject_backend${item.image}`
            }));
            
            setCarouselSlides(transformedSlides);
          }
          
          setError(null);
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (err) {
        console.error("Error fetching carousel data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch latest updates
    const fetchLatestUpdates = async () => {
      try {
        const langParam = language === 'hindi' ? 'hi' : 'en';
        const response = await fetch(`https://mahadevaaya.com/ngoproject/ngoproject_backend/api/latest-update-items/?lang=${langParam}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data && data.data.length > 0) {
          // If Hindi, fetch English as fallback for items without Hindi title
          if (language === 'hindi') {
            const enResponse = await fetch('https://mahadevaaya.com/ngoproject/ngoproject_backend/api/latest-update-items/?lang=en');
            const enData = await enResponse.json();
            
            // Create a map of English data by ID
            const enMap = {};
            if (enData.success && enData.data) {
              enData.data.forEach(item => {
                enMap[item.id] = item;
              });
            }
            
            // Merge data with fallback to English
            const mergedData = data.data.map(item => ({
              id: item.id,
              title: item.title_hi || enMap[item.id]?.title || '',
              link: item.link,
              created_at: item.created_at,
              updated_at: item.updated_at
            }));
            
            setLatestNews(mergedData);
          } else {
            // English data
            const transformedData = data.data.map(item => ({
              id: item.id,
              title: item.title || '',
              link: item.link,
              created_at: item.created_at,
              updated_at: item.updated_at
            }));
            
            setLatestNews(transformedData);
          }
        }
      } catch (err) {
        console.error("Error fetching latest updates:", err);
      }
    };

    // Check localStorage for news card dismissal
    const newsCardDismissed = localStorage.getItem('newsCardDismissed');
    if (!newsCardDismissed) {
      setShowNewsCard(true);
    }

    fetchCarouselData();
    fetchLatestUpdates();
  }, [language]);

  // Seamless transition logic
  const [prevSlideIndex, setPrevSlideIndex] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (carouselSlides.length === 0) return;

    const interval = setInterval(() => {
      setPrevSlideIndex(activeSlideIndex);
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveSlideIndex(prevIndex => (prevIndex + 1) % carouselSlides.length);
        setIsTransitioning(false);
      }, 1200); // 1.2s overlap for fade
    }, 20000); // 20s per image

    return () => clearInterval(interval);
  }, [carouselSlides.length, activeSlideIndex]);

  // Show loading spinner while fetching data
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // Show error message if API call fails
  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error Loading Content</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  // Show message if no slides are available
  if (carouselSlides.length === 0) {
    return (
      <Alert variant="info">
        <Alert.Heading>No Content Available</Alert.Heading>
        <p>No carousel slides are currently available.</p>
      </Alert>
    );
  }

  // Handler for previous slide
  const handlePrevSlide = () => {
    setActiveSlideIndex(prevIndex => (prevIndex - 1 + carouselSlides.length) % carouselSlides.length);
  };

  // Handler for next slide
  const handleNextSlide = () => {
    setActiveSlideIndex(prevIndex => (prevIndex + 1) % carouselSlides.length);
  };

  // Translations for action buttons
  const translations = {
    english: {
      registration: 'Registration',
      donation: 'Donation',
      helpdesk: 'Help desk'
    },
    hindi: {
      registration: 'पंजीकरण',
      donation: 'दान',
      helpdesk: 'सहायता डेस्क'
    }
  };

  const buttonLabels = language === 'hindi' ? translations.hindi : translations.english;

  return (
    <div className="hero-carousel-container hero">
      {/* Animated Background Slides */}
      <div className="carousel-background">
        
        {/* Current slide */}
        {carouselSlides[activeSlideIndex] && (
          <div
            key={carouselSlides[activeSlideIndex].id}
            className={`carousel-background-slide active${isTransitioning ? ' fade-out' : ''}`}
            style={{ backgroundImage: `url('${carouselSlides[activeSlideIndex].image}')` }}
            role="img"
            aria-label={carouselSlides[activeSlideIndex].title}
          />
        )}
        {/* Next slide (fade in) */}
        {isTransitioning && carouselSlides[(activeSlideIndex + 1) % carouselSlides.length] && (
          <div
            key={carouselSlides[(activeSlideIndex + 1) % carouselSlides.length].id + '-next'}
            className="carousel-background-slide fade-in"
            style={{ backgroundImage: `url('${carouselSlides[(activeSlideIndex + 1) % carouselSlides.length].image}')` }}
            role="img"
            aria-label={carouselSlides[(activeSlideIndex + 1) % carouselSlides.length].title}
          />
        )}
      </div>

      {/* Semi-transparent overlay for text readability */}
      <div className="carousel-overlay"></div>

      {/* Previous Button */}
      <button
        className="carousel-nav-btn carousel-nav-prev"
        onClick={handlePrevSlide}
        aria-label="Previous slide"
      >
        ❮
      </button>

      {/* Next Button */}
      <button
        className="carousel-nav-btn carousel-nav-next"
        onClick={handleNextSlide}
        aria-label="Next slide"
      >
        ❯
      </button>

      {/* News Card Overlay */}
      {showNewsCard && (
        <div className="news-card-overlay">
          
          <div className="news-card">
            <button 
              className="news-card-close"
              onClick={() => {
                setShowNewsCard(false);
                localStorage.setItem('newsCardDismissed', 'true');
              }}
              aria-label="Close news card"
            >
              ✕
            </button>
            <div className="news-card-icon">📢 <h3 className="news-card-title">Latest Updates</h3></div>
            {latestNews && latestNews.length > 0 ? (
              <div className={`news-card-content-wrapper ${latestNews.length > 1 ? 'scrollable' : ''}`}>
                {latestNews.map((update, index) => (
                  <div key={update.id} className="news-item">
                    <div className="news-item-header">
                      <span className="news-item-number">{index + 1}.</span>
                      <p className="news-item-title">{update.title}</p>
                    </div>
                    <a 
                      href={update.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="news-item-link"
                    >
                      View More →
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="news-card-content">
                Stay tuned for our upcoming programs and initiatives. Join us in making a positive impact on our communities through education, health, and sustainable development.
              </p>
            )}
{/*             
            <div className="news-card-footer">
              <span className="news-badge">New</span>
            </div> */}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="carousel-action-buttons">
        <button 
          className="carousel-btn carousel-btn-registration"
          onClick={() => navigate('/registration')}
        >
          <span className="btn-icon">📝</span>
          {buttonLabels.registration}
        </button>
        <button 
          className="carousel-btn carousel-btn-donation"
          onClick={() => navigate('/DonationSociety')}
        >
          <span className="btn-icon">❤️</span>
          {buttonLabels.donation}
        </button>
         <button 
          className="carousel-btn  carousel-btn-success " 
          onClick={() => navigate('/Problem')}
        >
            <span className="btn-icon">📝</span>
          {buttonLabels.helpdesk}
        </button>
      </div>
      

      {/* Content Wrapper */}
      <div className="hero-wrapper">
        <div className="container">
          <div className="row align-items-center">
            
            {/* Text Content - Only show current slide content */}
            <div className="col-lg-6 hero-content" data-aos="fade-right">
              <h1>{carouselSlides[activeSlideIndex]?.title}</h1>
              <p>{carouselSlides[activeSlideIndex]?.subtitle}</p>
            </div>

            {/* Empty space or additional content on larger screens */}
            <div className="col-lg-6 hero-media" data-aos="zoom-in">
              {/* Optional: Add decorative elements or statistics here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCarousel;