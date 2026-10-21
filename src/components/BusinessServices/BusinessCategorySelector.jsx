
import "./BusinessCategorySelector.css";

const categories = [
  { id: "dealership", title: "Dealership", description: "Sell and showcase vehicles" },
  { id: "insurance", title: "Insurance", description: "Vehicle insurance services" },
  { id: "leasing", title: "Leasing", description: "Vehicle leasing and finance" },
  { id: "workshop", title: "Workshop", description: "Repairs and maintenance" },
  { id: "importExport", title: "Importer / Exporter", description: "Import and export vehicles" },
  { id: "drivingSchool", title: "Driving School", description: "Driving lessons and training" },
  {id:  "showroom", title:"Showroom", description:"Choose your car and bike from here"},
];

function BusinessCategorySelector({ selectedCategory, onSelect }) {
  return (
    <section className="business-category-section">
      <h2>Business Services</h2>
      <p>Choose a category to create or manage your business listing.</p>

      <div className="business-category-grid">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`business-category-card ${
              selectedCategory === category.id ? "selected" : ""
            }`}
            onClick={() => onSelect(category.id)}
            aria-pressed={selectedCategory === category.id}
          >
            <h3>{category.title}</h3>
            <p>{category.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

export default BusinessCategorySelector;
