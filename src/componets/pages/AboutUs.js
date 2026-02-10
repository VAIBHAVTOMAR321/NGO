import React, { useState, useEffect } from 'react';
import EducationImage from "../../assets/images/education/campus-5.webp";
import "../../assets/css/ImageTransition.css";

function AboutUs() {
  const [aboutData, setAboutData] = useState(null);
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
          `https://mahadevaaya.com/ngoproject/ngoproject_backend/api/aboutus-item/?lang=${langParam}&id=1`
        );
        const result = await response.json();
        
        console.log(`About Us ${language.toUpperCase()} API Response:`, result);

        if (result.success && result.data) {
          setAboutData(result.data);
          setError(null);
        } else {
          setError('Failed to fetch data');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
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

  if (!aboutData) {
    return <div className="text-center py-5">No data available</div>;
  }

  // Function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return EducationImage;
    // If the path already starts with http, return as is
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise, prepend the base URL
    return `https://mahadevaaya.com/ngoproject/ngoproject_backend${imagePath}`;
  };

  return (
    <div>
      {/* About Us Section (id=1) */}
      <section id="about" className="about section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="about-content" data-aos="fade-up" data-aos-delay="200">
               
                <h2>
                  {language === 'hindi' 
                    ? (aboutData?.title_hi || "हमारे बारे में") 
                    : (aboutData?.title || "About Us")}
                </h2>
                <p>
                  {language === 'hindi' 
                    ? (aboutData?.description_hi || "हमारा विवरण") 
                    : (aboutData?.description || "Our Description")}
                </p>

                <div className="timeline">
                  {(language === 'hindi' ? aboutData?.module_hi : aboutData?.module)?.map((item, index) => (
                    <div className="timeline-item" key={index}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <h4>{item[0] || (language === 'hindi' ? `वर्ष ${index}` : `Year ${index}`)}</h4>
                        <p>{item[1] || (language === 'hindi' ? "विवरण" : "Description")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="about-image image-transition-container" data-aos="zoom-in" data-aos-delay="300">
                <img src={getImageUrl(aboutData?.image)} className="img-fluid image-transition" alt="About Us Image" />
              </div>
            </div>
          </div>
        </div>
      </section>

    
    </div>
  );
}

export default AboutUs;