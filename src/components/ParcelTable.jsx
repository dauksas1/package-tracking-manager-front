import './ParcelTable.css'
import React, { useState } from 'react';

const statusTransitions = {
  Created: ['Sent', 'Canceled'],
  Sent: ['Accepted', 'Returned', 'Canceled'],
  Returned: ['Sent', 'Canceled'],
  Accepted: [],
  Canceled: []
};

function ParcelTable({ parcels }) {
  const [trackingFilter, setTrackingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [parcelStatuses, setParcelStatuses] = useState(
    parcels.reduce((acc, parcel) => {
      acc[parcel.id] = parcel.status;
      return acc;
    }, {})
  );

  const handleStatusChange = (id, newStatus) => {
    setParcelStatuses(prev => ({
      ...prev,
      [id]: newStatus
    }));
  };

  const filteredParcels = parcels.filter(parcel => {
    const currentStatus = parcelStatuses[parcel.id];
    const matchesTracking = parcel.trackingNumber
      .toLowerCase()
      .includes(trackingFilter.toLowerCase());
    const matchesStatus = statusFilter
      ? currentStatus === statusFilter
      : true;
    return matchesTracking && matchesStatus;
  });

  return (
    <div className="table-container">
      <h2 className="table-title">📦 All Parcels</h2>

      <div className="table-controls">
        <input
          type="text"
          placeholder="Search tracking number"
          value={trackingFilter}
          onChange={(e) => setTrackingFilter(e.target.value)}
          className="filter-input"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All</option>
          {Object.keys(statusTransitions).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <button className="create-package-button">CREATE NEW PACKAGE</button>
      </div>

      <div className="table-scroll">
        <table className="parcel-table">
          <thead>
            <tr>
              <th>Tracking</th>
              <th>Sender</th>
              <th>Recipient</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredParcels.map(parcel => {
              const currentStatus = parcelStatuses[parcel.id];
              const isFinal = (statusTransitions[currentStatus] || []).length === 0;

              return (
                <tr key={parcel.id}>
                  <td>{parcel.trackingNumber}</td>
                  <td>{parcel.sender.name}</td>
                  <td>{parcel.recipient.name}</td>
                  <td>
                    {isFinal ? (
                      <span className={`status-badge status-${currentStatus.toLowerCase()}`}>
                        {currentStatus}
                      </span>
                    ) : (
                      <select
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(parcel.id, e.target.value)}
                        className={`status-select status-${currentStatus.toLowerCase()}`}
                      >
                        <option value={currentStatus}>{currentStatus}</option>
                        {statusTransitions[currentStatus].map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td>{new Date(parcel.createdAt).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ParcelTable
