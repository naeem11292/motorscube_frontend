
import { useState } from "react";
import "./MyItems.css";

function MyItems() {
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const tabs = [
    { id: "all", label: "All Items" },
    { id: "sale", label: "Sale Ads" },
    { id: "hire", label: "Hire Ads" },
  ];

  return (
    <div className="my-items-page">
      <div className="my-items-header">
        <div>
          <p className="my-items-eyebrow">YOUR GARAGE</p>
          <h1>My Items</h1>
          <p>Manage all your MotorsCube listings in one place.</p>
        </div>
      </div>

      <div className="my-items-toolbar">
        <div className="my-items-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`my-items-tab ${
                activeTab === tab.id ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          className="my-items-status-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter items by status"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      <div className="my-items-content">
        <div className="my-items-empty-icon">🚘</div>
        <h2>Your listings will appear here</h2>
        <p>
          Your sale and hire ads will appear here once we connect
          this page to your MotorsCube APIs.
        </p>
      </div>
    </div>
  );
}

export default MyItems;
