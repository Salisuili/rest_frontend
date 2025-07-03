const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-4">Categories</h3>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full text-left px-3 py-2 rounded ${!selectedCategory ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
          >
            All Items
          </button>
        </li>
        {categories.map(category => (
          <li key={category.id}>
            <button
              onClick={() => onSelectCategory(category.id)}
              className={`w-full text-left px-3 py-2 rounded ${selectedCategory === category.id ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;