const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto"> {/* bg-dark for dark background, py-4 for vertical padding, mt-auto pushes to bottom */}
      <div className="container"> {/* Bootstrap container for fixed width */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center"> {/* Flexbox for responsive layout */}
          <div className="mb-3 mb-md-0 text-center text-md-start"> {/* Margin bottom, responsive text alignment */}
            <h5 className="fw-bold">Restaurant App</h5> {/* Bootstrap heading and bold font weight */}
            <p className="text-muted small mb-0">Delicious food at your doorstep</p> {/* Muted text, small font, no bottom margin */}
          </div>
          <div className="d-flex gap-3"> {/* Flexbox for links, gap for spacing */}
            <a href="#" className="link-light text-decoration-none">About Us</a> {/* Link styling, no underline */}
            <a href="#" className="link-light text-decoration-none">Contact</a>
            <a href="#" className="link-light text-decoration-none">Terms</a>
          </div>
        </div>
        <div className="text-center text-muted small mt-3"> {/* Centered muted text, small font, top margin */}
          © {new Date().getFullYear()} Restaurant App. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;