import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Card, Modal, Table, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaLink, FaHeading, FaSave, FaTimes } from "react-icons/fa";
import DashBoardHeader from "../../DashBoardHeader";
import LeftNav from "../../LeftNav";
import { useAuthFetch } from "../../../context/AuthFetch";

const ManageUpdates = () => {
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Language state
  const [language, setLanguage] = useState(() => localStorage.getItem('appLanguage') || 'english');

  // State for all updates
  const [updates, setUpdates] = useState([]);
  
  // Form state for selected update
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    title_hi: "",
    link: ""
  });

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const [showAlert, setShowAlert] = useState(false);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUpdateId, setSelectedUpdateId] = useState(null);

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updateToDelete, setUpdateToDelete] = useState(null);

  // Validation errors
  const [validationErrors, setValidationErrors] = useState({});

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

  // Fetch all updates on component mount
  useEffect(() => {
    fetchAllUpdates();
  }, []);

  // Handle language change from navbar
  useEffect(() => {
    const handleLanguageChange = (event) => {
      const newLanguage = event.detail.language;
      setLanguage(newLanguage);
      localStorage.setItem('appLanguage', newLanguage);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch all updates from API
  const fetchAllUpdates = async () => {
    setIsLoading(true);
    try {
      const response = await authFetch(
        "https://mahadevaaya.com/ngoproject/ngoproject_backend/api/latest-update-items/",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch updates data");
      }

      const result = await response.json();
      console.log("GET All Updates API Response:", result);

      if (result.success && result.data && result.data.length > 0) {
        setUpdates(result.data);
      } else if (Array.isArray(result)) {
        // Handle direct array response
        setUpdates(result);
      } else {
        setUpdates([]);
      }
    } catch (error) {
      console.error("Error fetching updates data:", error);
      setMessage(error.message || "An error occurred while fetching data");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit button click
  const handleEditClick = (update) => {
    setFormData({
      id: update.id,
      title: update.title,
      title_hi: update.title_hi || "",
      link: update.link
    });
    setSelectedUpdateId(update.id);
    setIsEditing(true);
    setShowAlert(false);
    setValidationErrors({});
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = "Title (English) is required";
    } else if (formData.title.length < 3) {
      errors.title = "Title must be at least 3 characters";
    }
    
    if (!formData.link.trim()) {
      errors.link = "Link is required";
    } else {
      // Basic URL validation
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(formData.link)) {
        errors.link = "Please enter a valid URL";
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission (UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!formData.id) {
      setMessage("No update selected for editing");
      setVariant("danger");
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true);
    setShowAlert(false);

    try {
      const response = await authFetch(
        "https://mahadevaaya.com/ngoproject/ngoproject_backend/api/latest-update-items/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: formData.id,
            title: formData.title,
            title_hi: formData.title_hi,
            link: formData.link
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage("Update modified successfully!");
        setVariant("success");
        setShowAlert(true);
        
        // Refresh the updates list
        await fetchAllUpdates();
        
        // Reset form
        setIsEditing(false);
        setSelectedUpdateId(null);
        setFormData({
          id: null,
          title: "",
          title_hi: "",
          link: ""
        });
      } else {
        setMessage(result.message || "Failed to update. Please try again.");
        setVariant("danger");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error updating:", error);
      setMessage("Network error. Please check your connection and try again.");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setSelectedUpdateId(null);
    setFormData({
      id: null,
      title: "",
      title_hi: "",
      link: ""
    });
    setValidationErrors({});
    setShowAlert(false);
  };

  // Handle delete button click
  const handleDeleteClick = (update) => {
    setUpdateToDelete(update);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!updateToDelete) return;

    try {
      const response = await authFetch(
        "https://mahadevaaya.com/ngoproject/ngoproject_backend/api/latest-update-items/",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: updateToDelete.id
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage("Update deleted successfully!");
        setVariant("success");
        setShowAlert(true);
        
        // Refresh the updates list
        await fetchAllUpdates();
        
        // If we were editing this update, clear the form
        if (selectedUpdateId === updateToDelete.id) {
          cancelEditing();
        }
      } else {
        setMessage(result.message || "Failed to delete update. Please try again.");
        setVariant("danger");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error deleting update:", error);
      setMessage("Network error. Please check your connection and try again.");
      setVariant("danger");
      setShowAlert(true);
    } finally {
      setShowDeleteModal(false);
      setUpdateToDelete(null);
    }
  };

  // Navigate to add page
  const navigateToAdd = () => {
    navigate('/AddUpdates');
  };

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

          <Container fluid className="dashboard-body dashboard-main-container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="page-title mb-1">Manage Latest Updates</h1>
                <p className="text-muted mb-0">View, edit, and delete latest updates</p>
              </div>
              <Button variant="primary" onClick={navigateToAdd}>
                <FaPlus className="me-2" />
                Add New Update
              </Button>
            </div>

            {/* Alert Messages */}
            {showAlert && (
              <Alert variant={variant} dismissible onClose={() => setShowAlert(false)}>
                {message}
              </Alert>
            )}

            {/* Edit Form */}
            {isEditing && (
              <Card className="shadow-sm mb-4">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Edit Update</h5>
                    <Button variant="outline-secondary" size="sm" onClick={cancelEditing}>
                      <FaTimes className="me-1" /> Cancel
                    </Button>
                  </div>
                  
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      {/* Title Field - English */}
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <FaHeading className="me-2" />
                            Title (English) <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter English title"
                            isInvalid={!!validationErrors.title}
                            disabled={isSubmitting}
                          />
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.title}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      {/* Title Field - Hindi */}
                      <Col md={6} className="mb-3">
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <FaHeading className="me-2" />
                            Title (हिंदी)
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="title_hi"
                            value={formData.title_hi}
                            onChange={handleChange}
                            placeholder="हिंदी शीर्षक दर्ज करें"
                            disabled={isSubmitting}
                          />
                        </Form.Group>
                      </Col>

                      {/* Link Field */}
                      <Col md={12} className="mb-3">
                        <Form.Group>
                          <Form.Label className="fw-semibold">
                            <FaLink className="me-2" />
                            Link <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="link"
                            value={formData.link}
                            onChange={handleChange}
                            placeholder="Enter URL (e.g., https://example.com)"
                            isInvalid={!!validationErrors.link}
                            disabled={isSubmitting}
                          />
                          <Form.Control.Feedback type="invalid">
                            {validationErrors.link}
                          </Form.Control.Feedback>
                          <Form.Text className="text-muted">
                            Enter a valid URL starting with http:// or https://
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Submit Button */}
                    <div className="d-flex justify-content-end gap-2 mt-3">
                      <Button
                        variant="secondary"
                        onClick={cancelEditing}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        <FaSave className="me-2" />
                        {isSubmitting ? "Updating..." : "Update"}
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            )}

            {/* Updates List */}
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                <h5 className="mb-4">All Updates</h5>
                
                {isLoading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-muted">Loading updates...</p>
                  </div>
                ) : updates.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted">No updates found. Create your first update!</p>
                    <Button variant="primary" onClick={navigateToAdd} className="mt-3">
                      <FaPlus className="me-2" />
                      Add New Update
                    </Button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Title</th>
                          <th>Link</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {updates.map((update, index) => (
                          <tr key={update.id} className={selectedUpdateId === update.id ? "table-active" : ""}>
                            <td>{index + 1}</td>
                            <td>
                              <div>
                                <div><strong>EN:</strong> {update.title}</div>
                                <div><strong>HI:</strong> {update.title_hi || '-'}</div>
                              </div>
                            </td>
                            <td>
                              <a 
                                href={update.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-decoration-none"
                              >
                                {update.link.length > 50 ? update.link.substring(0, 50) + '...' : update.link}
                              </a>
                            </td>
                            <td className="text-center">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => handleEditClick(update)}
                                disabled={isEditing}
                              >
                                <FaEdit className="me-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDeleteClick(update)}
                              >
                                <FaTrash className="me-1" />
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Container>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this update?
          {updateToDelete && (
            <div className="mt-3">
              <div className="mb-2">
                <strong>English Title:</strong> {updateToDelete.title}
              </div>
              <div>
                <strong>Hindi Title:</strong> {updateToDelete.title_hi || '-'}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            <FaTrash className="me-2" />
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageUpdates;
