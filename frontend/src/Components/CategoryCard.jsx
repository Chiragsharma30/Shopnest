function CategoryCard({ category }) {
  return (
    <div className="category-card">

      <div className="category-icon">
        {category.icon}
      </div>

      <h3>{category.name}</h3>

      <p>{category.description}</p>

      <button>
        Explore →
      </button>

    </div>
  );
}

export default CategoryCard;