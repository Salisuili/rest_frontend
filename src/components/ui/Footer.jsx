const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto"> 
      <div className="container"> 
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center"> 
          <div className="mb-3 mb-md-0 text-center text-md-start"> 
            <h5 className="fw-bold">Tripple S Restaurant</h5> 
            <p className="text-muted small mb-0">Delicious food at your doorstep</p> 
          </div>
          <div className="d-flex gap-3"> 
            <a href="#" className="link-light text-decoration-none">About Us</a> 
            <a href="#" className="link-light text-decoration-none">Contact</a>
            <a href="#" className="link-light text-decoration-none">Terms</a>
          </div>
        </div>
        <div className="text-center text-muted small mt-3"> 
          © {new Date().getFullYear()} Tripple S Restaurant. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;