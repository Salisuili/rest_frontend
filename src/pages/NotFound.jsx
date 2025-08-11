// frontend/src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="d-flex align-items-center justify-content-center text-center bg-light" style={{ minHeight: '100vh' }}>
      <div className="container">
        <h1 className="display-1 fw-bold text-danger">404</h1>
        <h2 className="mb-3">Page Not Found</h2>
        <p className="lead mb-4">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          Go to Homepage
        </Link>
        
      </div>
    </div>
  );
};

export default NotFound;