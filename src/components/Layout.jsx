import Header from './ui/Header';
import Footer from './ui/Footer';

const Layout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 container px-4 py-5">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;