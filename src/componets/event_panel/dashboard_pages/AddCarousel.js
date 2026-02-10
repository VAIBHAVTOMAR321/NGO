import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Spinner } from "react-bootstrap";
import "../../../assets/css/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAuthFetch } from "../../context/AuthFetch";
import { FaArrowLeft } from "react-icons/fa";
import LeftNav from "../LeftNav";
import DashBoardHeader from "../DashBoardHeader";

const AddCarousel = () => {
  const { auth, logout, refreshAccessToken, isLoading: authLoading, isAuthenticated } = useAuth();
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  // Form state for Carousel
  const [carouselFormData, setCarouselFormData] = useState({
    title: "",
    title_hi: "",
    sub_title: "",
    sub_title_hi: "",
    description: "",
    description_hi: "",
    imageFile: null
  });
  
  // State for image preview
  const [imagePreview, setImagePreview] = useState(null);
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const [showAlert, setShowAlert] = useState(false);
  
  // Image validation state
  const [imageError, setImageError] = useState(null);

  // Check device width
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setSidebarOpen(width >= 1024);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Handle form input changes
  const handleCarouselChange = (e) => {
    const { name, value } = e.target;
    setCarouselFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload with validation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError(null);

    if (file) {
      // Validate file size (50KB - 100KB)
      const fileSizeKB = file.size / 1024;
      if (fileSizeKB < 50) {
        setImageError("Image size must be at least 50KB");
        return;
      }
      if (fileSizeKB > 100) {
        setImageError("Image size must not exceed 100KB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setImageError("Please select a valid image file");
        return;
      }

      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Store the actual file object for upload
      setCarouselFormData((prev) => ({
        ...prev,
        imageFile: file
      }));
    }
  };

  // Clear form function
  const clearForm = () => {
    setCarouselFormData({
      title: "",
      title_hi: "",
      sub_title: "",
      sub_title_hi: "",
      description: "",
      description_hi: "",
      imageFile: null
    });
    setImagePreview(null);
    setImageError(null);
    setMessage("");
    setShowAlert(false);
  };

  // Handle form submission (POST request)
  const handleCarouselSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowAlert(false);
    setImageError(null);

    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append("title", carouselFormData.title);
      formData.append("title_hi", carouselFormData.title_hi);
      formData.append("sub_title", carouselFormData.sub_title);
      formData.append("sub_title_hi", carouselFormData.sub_title_hi);
      formData.append("description", carouselFormData.description);
      formData.append("description_hi", carouselFormData.description_hi);
      
      if (carouselFormData.imageFile) {
        formData.append("image", carouselFormData.imageFile);
      }

      console.log("Submitting FormData to create carousel item");

      // Use fetch directly for FormData
      const url = "https://mahadevaaya.com/ngoproject/ngoproject_backend/api/carousel1-item/";

      let response = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${auth?.access}`,
        },
      });

      // If unauthorized, try refreshing token and retry once
      if (response.status === 401) {
        const newAccess = await refreshAccessToken();
        if (!newAccess) throw new Error("Session expired");
        response = await fetch(url, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${newAccess}`,
          },
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorData = null;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          /* not JSON */
        }
        throw new Error(
          (errorData && errorData.message) || "Failed to create carousel item"
        );
      }

      const result = await response.json();
      console.log("POST Success response:", result);

      if (result.success || result.id) {
        setMessage("Carousel item created successfully!");
        setVariant("success");
        setShowAlert(true);

        // Clean up
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
        }

        // Reset form
        setTimeout(() => {
          clearForm();
          // Redirect to manage carousel
          navigate("/ManageCarousel");
        }, 2000);
      } else {
        throw new Error(result.message || "Failed to create carousel item");
      }
    } catch (error) {
      console.error("Error creating carousel item:", error);

      // Handle specific error cases
      if (error.message.includes("403") || error.message.includes("permission")) {
        setMessage("Permission denied. You may not have the required role to access this feature.");
      } else if (error.message.includes("authenticated") || error.message.includes("Session expired")) {
        setMessage("Authentication error. Please login again.");
        // Redirect to login
        setTimeout(() => {
          navigate("/Login");
        }, 2000);
      } else {
        setMessage(error.message || "Failed to create carousel item");
      }

      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while auth is loading
  if (authLoading) {
    return (
      <div className="dashboard-container">
        <div className="main-content-dash d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </div>
    );
  }

  // If not authenticated, show message and redirect
  if (!isAuthenticated) {
    return (
      <div className="dashboard-container">
        <div className="main-content-dash d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
          <div className="text-center">
            <Alert variant="warning">
              <Alert.Heading>Authentication Required</Alert.Heading>
              <p>You need to be logged in to view this page.</p>
              <Button variant="primary" onClick={() => navigate("/Login")}>
                Go to Login
              </Button>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-container">
        {/* Left Sidebar */}
        <LeftNav
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
          isTablet={isTablet}
        />

        {/* Main Content */}
        <div className="main-content-dash">
          <DashBoardHeader toggleSidebar={toggleSidebar} />

          <Container fluid className="dashboard-body dashboard-main-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="page-title">Add New Carousel Item</h1>
              <Button variant="outline-secondary" onClick={() => navigate("/ManageCarousel")}>
                <FaArrowLeft /> Back to Carousel List
              </Button>
            </div>

            {/* Alert for success/error messages */}
            {showAlert && (
              <Alert
                variant={variant}
                className="mb-4"
                onClose={() => setShowAlert(false)}
                dismissible
              >
                {message}
              </Alert>
            )}

            <Form onSubmit={handleCarouselSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title (English)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter title in English"
                      name="title"
                      value={carouselFormData.title}
                      onChange={handleCarouselChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title (हिंदी)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="हिंदी में शीर्षक दर्ज करें"
                      name="title_hi"
                      value={carouselFormData.title_hi}
                      onChange={handleCarouselChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Subtitle (English)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter subtitle in English"
                      name="sub_title"
                      value={carouselFormData.sub_title}
                      onChange={handleCarouselChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Subtitle (हिंदी)</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="हिंदी में उपशीर्षक दर्ज करें"
                      name="sub_title_hi"
                      value={carouselFormData.sub_title_hi}
                      onChange={handleCarouselChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Description (English)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter description in English"
                      name="description"
                      value={carouselFormData.description}
                      onChange={handleCarouselChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Description (हिंदी)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="हिंदी में विवरण दर्ज करें"
                      name="description_hi"
                      value={carouselFormData.description_hi}
                      onChange={handleCarouselChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Image (Optional - 50-100KB)</Form.Label>
                {imageError && (
                  <Alert variant="warning" className="mb-2">
                    {imageError}
                  </Alert>
                )}
                {imagePreview && (
                  <div className="mb-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-thumbnail"
                      style={{ maxHeight: "150px" }}
                    />
                  </div>
                )}
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Form.Text className="text-muted">
                  Recommended size: 50-100KB. Supported formats: JPG, PNG, GIF, WebP
                </Form.Text>
              </Form.Group>

              <div className="d-flex gap-2 mt-4">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? "Creating..." : "Create Carousel Item"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={clearForm}
                  type="button"
                  size="lg"
                >
                  Reset Form
                </Button>
              </div>
            </Form>
          </Container>
        </div>
      </div>
    </>
  );
};

export default AddCarousel;