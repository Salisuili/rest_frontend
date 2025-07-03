import { useState, useEffect } from 'react';
import { getCategories, getMenuItems } from '../api/menu';
import MenuItemCard from '../components/menu/MenuItemCard';
import CategoryFilter from '../components/menu/CategoryFilter';
import LoadingSpinner from '../components/ui/LoadingSpinner';

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
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredItems();
  }, [selectedCategory, searchTerm]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
        
        <div className="md:w-3/4">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search menu items..."
              className="w-full p-3 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map(item => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;