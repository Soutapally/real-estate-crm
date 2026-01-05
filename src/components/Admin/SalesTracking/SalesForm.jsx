import React, { useEffect, useState } from "react";
import Sidebar from "../../Navbar/Sidebar";
import Topbar from "../../Navbar/Topbar";
import Button from "../../Buttons/Buttons";
import { useNavigate, useParams } from "react-router-dom";
import "./SalesForm.css";
import API_BASE_URL from "../../Config/api";

const INITIAL_FORM = {
  buyer_name: "",
  buyer_phone: "",
  seller_name: "",
  seller_phone: "",
  property_id: null,
  property_name: "",
  sale_price: "",
  commission_amount: "",
  loan_status: "Pending",
  payment_status: "Pending",
  sale_date: "",
  registration_date: "",
  notes: ""
};

export default function SalesForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  /* LOAD SALE FOR EDIT */
  useEffect(() => {
    if (isEdit) loadSale();
  }, [id]);

  const loadSale = async () => {
    try {
      setLoading(true);
const res = await fetch(`${API_BASE_URL}/api/edit-sale/${id}`);
      const data = await res.json();

      setForm({
        buyer_name: data.buyer_name || "",
        buyer_phone: data.buyer_phone || "",
        seller_name: data.seller_name || "",
        seller_phone: data.seller_phone || "",
        property_id: data.property_id,
        property_name: data.property_name || "",
        sale_price: data.sale_price || "",
        commission_amount: data.commission_amount || "",
        loan_status: data.loan_status || "Pending",
        payment_status: data.payment_status || "Pending",
        sale_date: data.sale_date?.split("T")[0] || "",
        registration_date: data.registration_date?.split("T")[0] || "",
        notes: data.notes || ""
      });
    } catch (err) {
      console.error("Load sale error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
const url = isEdit
  ? `${API_BASE_URL}/api/update-sale/${id}`
  : `${API_BASE_URL}/api/add-sale`;

    await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    navigate("/sales");
  };

  return (
    <div className="layout-wrapper">
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} />

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="salesForm-content">
        <div className="salesForm-wrapper">
          <div className="salesForm-card">
            <h2 className="salesForm-title">
              {isEdit ? "Edit Sale" : "Add Sale"}
            </h2>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <form className="salesForm-form" onSubmit={handleSubmit}>
                <input name="buyer_name" placeholder="Buyer Name"
                  value={form.buyer_name} onChange={handleChange} required />

                <input name="buyer_phone" placeholder="Buyer Phone"
                  value={form.buyer_phone} onChange={handleChange} required />

                <input name="seller_name" placeholder="Seller Name"
                  value={form.seller_name} onChange={handleChange} />

                <input name="seller_phone" placeholder="Seller Phone"
                  value={form.seller_phone} onChange={handleChange} />

                <input name="property_name" placeholder="Property Name"
                  value={form.property_name} onChange={handleChange} required />

                <input name="sale_price" placeholder="Sale Price"
                  value={form.sale_price} onChange={handleChange} required />

                <input name="commission_amount" placeholder="Commission"
                  value={form.commission_amount} onChange={handleChange} />

                <select name="loan_status"
                  value={form.loan_status} onChange={handleChange}>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>NA</option>
                </select>

                <select name="payment_status"
                  value={form.payment_status} onChange={handleChange}>
                  <option>Pending</option>
                  <option>Partial</option>
                  <option>Completed</option>
                </select>

                <input type="date" name="sale_date"
                  value={form.sale_date} onChange={handleChange} required />

                <input type="date" name="registration_date"
                  value={form.registration_date} onChange={handleChange} />

                <textarea name="notes" placeholder="Notes"
                  value={form.notes} onChange={handleChange} />

                <Button
                  label={isEdit ? "Update Sale" : "Save Sale"}
                  type="submit"
                />
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
