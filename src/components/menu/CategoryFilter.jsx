const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <h3 className="h5 card-title mb-3">Categories</h3>
        <ul className="list-unstyled">
          <li className="mb-2">
            <button
              onClick={() => onSelectCategory(null)}
              className={`w-100 text-start px-3 py-2 rounded ${!selectedCategory ? 'bg-primary text-white' : 'btn-outline-primary'}`}
            >
              All Items
            </button>
          </li>
          {categories.map(category => (
            <li key={category.id} className="mb-2">
              <button
                onClick={() => onSelectCategory(category.id)}
                className={`w-100 text-start px-3 py-2 rounded ${selectedCategory === category.id ? 'bg-primary text-white' : 'btn-outline-primary'}`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryFilter;