import { useState, useEffect } from 'react';
import { getCategories, getMenuItems } from '../api/menu';
import MenuItemCard from '../components/menu/MenuItemCard';
import CategoryFilter from '../components/menu/CategoryFilter';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import useDebounce from '../hooks/useDebounce'; 
import { toast } from 'react-hot-toast'; 

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

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
        console.error('Error fetching initial data:', error);
        toast.error('Failed to load menu data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); 

  useEffect(() => {
    const fetchFilteredItems = async () => {
      setLoading(true);
      try {
        // Pass selectedCategory and debouncedSearchTerm to the API call
        const items = await getMenuItems(selectedCategory, debouncedSearchTerm);
        setMenuItems(items);
      } catch (error) {
        console.error('Error filtering items:', error);
        toast.error('Failed to filter menu items.');
      } finally {
        setLoading(false);
      }
    };

    if (!loading || debouncedSearchTerm !== '' || selectedCategory !== null) {
      fetchFilteredItems();
    }
  }, [selectedCategory, debouncedSearchTerm]); 

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-md-3">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div className="col-md-9">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search menu items..."
              className="form-control form-control-lg"
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {menuItems.length === 0 ? (
              <div className="col-12 text-center py-5">
                <p className="lead text-muted">No items found matching your criteria.</p>
              </div>
            ) : (
              menuItems.map(item => (
                <div className="col" key={item.id}>
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
