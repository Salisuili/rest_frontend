import { useState, useEffect } from 'react';
import { getCategories, getMenuItems } from '../api/menu';
import MenuItemCard from '../components/menu/MenuItemCard'; // Assuming this component is handled separately
import CategoryFilter from '../components/menu/CategoryFilter'; // Assuming this component is handled separately
import LoadingSpinner from '../components/ui/LoadingSpinner'; // Assuming this component is now Bootstrap-ready

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, items] = await Promise.all([
          getCategories(),
          getMenuItems()
        ]);
        setCategories(cats);
        setMenuItems(items);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Optionally, show a toast error here
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchFilteredItems = async () => {
      try {
        setLoading(true);
        const items = await getMenuItems(selectedCategory, searchTerm);
        setMenuItems(items);
      } catch (error) {
        console.error('Error filtering items:', error);
        // Optionally, show a toast error here
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredItems();
  }, [selectedCategory, searchTerm]);

  // Display a loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container py-5"> {/* Bootstrap container with vertical padding */}
      <div className="row g-4"> {/* Bootstrap row with gutters for main layout */}
        <div className="col-md-3"> {/* Takes 1/4 width on medium screens and up */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div className="col-md-9"> {/* Takes 3/4 width on medium screens and up */}
          <div className="mb-4"> {/* Margin bottom for search input */}
            <input
              type="text"
              placeholder="Search menu items..."
              className="form-control form-control-lg" // Bootstrap form control for input, larger size
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4"> {/* Responsive grid for menu items */}
            {menuItems.length === 0 ? (
              <div className="col-12 text-center py-5">
                <p className="lead text-muted">No items found matching your criteria.</p>
              </div>
            ) : (
              menuItems.map(item => (
                <div className="col" key={item.id}> {/* Column for each MenuItemCard */}
                  <MenuItemCard item={item} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;