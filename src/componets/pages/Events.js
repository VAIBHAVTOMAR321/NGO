import React, { useState, useEffect } from 'react';
import "../../assets/css/ImageTransition.css";

const Events = () => {
  const [eventsData, setEventsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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

  // Fetch data based on language
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const langParam = language === 'hindi' ? 'hi' : 'en';
        const response = await fetch(
          `https://mahadevaaya.com/ngoproject/ngoproject_backend/api/aboutus-item/?lang=${langParam}&id=3`
        );
        const result = await response.json();
        
        console.log(`Events ${language.toUpperCase()} API Response:`, result);

        if (result.success && result.data) {
          setEventsData(result.data);
          setError(null);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        console.error('Error fetching Events data:', err);
        setError('Error fetching data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-5 text-danger">{error}</div>;
  }

  if (!eventsData) {
    return <div className="text-center py-5">No data available</div>;
  }

  // Function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // If the path already starts with http, return as is
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise, prepend the base URL
    return `https://mahadevaaya.com/ngoproject/ngoproject_backend${imagePath}`;
  };

  return (
    <div>
      {/* Events Section (id=3) */}
      <section id="events" className="about section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="about-content" data-aos="fade-up" data-aos-delay="200">
            
                <h2>
                  {language === 'hindi' 
                    ? (eventsData?.title_hi || "इवेंट विवरण") 
                    : (eventsData?.title || "Events")}
                </h2>
                <p>
                  {language === 'hindi' 
                    ? (eventsData?.description_hi || "Event description...") 
                    : (eventsData?.description || "Event description...")}
                </p>

                <div className="timeline">
                  {(language === 'hindi' ? eventsData?.module_hi : eventsData?.module)?.map((item, index) => (
                    <div className="timeline-item" key={index}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <h4>{item[0] || (language === 'hindi' ? `कार्यक्रम ${index + 1}` : `Event ${index + 1}`)}</h4>
                        <p>{item[1] || (language === 'hindi' ? "कार्यक्रम विवरण" : "Event description")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="about-image image-transition-container" data-aos="zoom-in" data-aos-delay="300">
                {eventsData?.image ? (
                  <img src={getImageUrl(eventsData.image)} className="img-fluid image-transition" alt="Events Image" />
                ) : (
                  <div className="no-image-placeholder text-center p-5 bg-light rounded">
                    <i className="bi bi-calendar-event display-1 text-muted"></i>
                    <p className="mt-3 text-muted">No Image Available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;