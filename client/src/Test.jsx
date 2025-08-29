import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/staff"; // 👈 your Node API

const Test = () => {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({ first_name: "", last_name: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load staff on mount
  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch staff");
      const data = await res.json();
      setStaff(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        // UPDATE
        await fetch(`${API_URL}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        // CREATE
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      setForm({ first_name: "", last_name: "" });
      setEditId(null);
      fetchStaff();
    } catch (err) {
      setError("Failed to save staff");
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchStaff();
    } catch (err) {
      setError("Failed to delete staff");
    }
  };

  const handleEdit = (person) => {
    setForm({ first_name: person.first_name, last_name: person.last_name });
    setEditId(person.id);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Simple CRUD with Node + Supabase (Staff)</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="First Name"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          required
        />
        <button type="submit">{editId ? "Update" : "Add"}</button>
      </form>

      {/* Loading / Error */}
      {loading && <p>Loading staff...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Staff List */}
      {!loading && !error && (
        <ul>
          {staff.length > 0 ? (
            staff.map((person) => (
              <li key={person.staff_id}>
                {person.first_name} {person.last_name}
                <button onClick={() => handleEdit(person)}>✏️ Edit</button>
                <button onClick={() => handleDelete(person.staff_id)}>🗑️ Delete</button>
              </li>
            ))
          ) : (
            <p>No staff found.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Test;
