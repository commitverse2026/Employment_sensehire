import { useEffect, useState } from "react";

export default function F02() {
  const [types, setTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubtype, setSelectedSubtype] = useState("");

  // Fetch data
  useEffect(() => {
    fetch("http://localhost:5000/api/disability-types")
      .then(res => res.json())
      .then(data => {
        console.log("DATA:", data);
        setTypes(data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSubmit = async () => {
    if (!selectedCategory || !selectedSubtype) {
      alert("Please select category and subtype");
      return;
    }

    const res = await fetch("http://localhost:5000/api/disability", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        category: selectedCategory.category,
        subtype: selectedSubtype
      })
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}>
      <h2>Disability Profiler</h2>

      {/* CATEGORY */}
      <select
        onChange={(e) => {
          const cat = types.find(t => t.id === e.target.value);
          setSelectedCategory(cat);
          setSelectedSubtype("");
        }}
      >
        <option value="">Select Category</option>
        {types.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.icon} {cat.category}
          </option>
        ))}
      </select>

      <br /><br />

      {/* SUBTYPE */}
      <select onChange={(e) => setSelectedSubtype(e.target.value)}>
        <option value="">Select Subtype</option>

        {selectedCategory?.subTypes.map((sub) => (
          <option key={sub.id} value={sub.label}>
            {sub.label}
          </option>
        ))}
      </select>

      <br /><br />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}