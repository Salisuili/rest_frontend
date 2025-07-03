import Header from './ui/Header';
import Footer from './ui/Footer';

const Layout = ({ children }) => {
  return (
    // min-vh-100 for min-height: 100vh, d-flex flex-column for flex-col
    <div className="d-flex flex-column min-vh-100">
      <Header />
      {/* flex-grow-1 for flex-grow, container for mx-auto, px-4 py-5 for padding */}
      <main className="flex-grow-1 container px-4 py-5">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;