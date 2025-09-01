import './ParcelTable.css';
import { useState } from 'react';
import { updateParcelStatus } from '../services/api.js';
import { useNavigate } from 'react-router-dom';

const statusTransitions = {
  Created: ['Sent', 'Canceled'],
  Sent: ['Accepted', 'Returned', 'Canceled'],
  Returned: ['Sent', 'Canceled'],
  Accepted: [],
  Canceled: []
};

function ParcelTable({ parcels, setShowDialog, reloadParcels }) {
  const [trackingFilter, setTrackingFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  const filteredParcels = parcels.filter(parcel => {
    const matchesTracking = parcel.trackingNumber
      .toLowerCase()
      .includes(trackingFilter.toLowerCase());
    const matchesStatus = statusFilter ? parcel.status === statusFilter : true;
    return matchesTracking && matchesStatus;
  });

  const handleStatusChange = async (parcelId, newStatus) => {
    try {
      await updateParcelStatus(parcelId, newStatus);
      await reloadParcels();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Could not update parcel status. Please try again.');
    }
  };

  const handleRowClick = (parcelId) => {
    navigate(`/parcel/${parcelId}`);
  };

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

        <div className="status-selector-wrapper">
          <h3>Filter by status:</h3>
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
        </div>

        <button onClick={() => setShowDialog(true)}>CREATE NEW PACKAGE</button>
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
              const currentStatus = parcel.status;
              const isFinal = (statusTransitions[currentStatus] || []).length === 0;

              return (
                <tr
                  key={parcel.id}
                  onClick={() => handleRowClick(parcel.id)}
                  className="clickable-row"
                >
                  <td>{parcel.trackingNumber}</td>
                  <td>{parcel.senderName}</td>
                  <td>{parcel.recipientName}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {isFinal ? (
                      <span className={`status-badge status-${currentStatus?.toLowerCase() || 'unknown'}`}>
                        {currentStatus || 'Unknown'}
                      </span>
                    ) : (
                      <select
                        value={currentStatus || ''}
                        onChange={(e) => handleStatusChange(parcel.id, e.target.value)}
                        className={`status-select status-${currentStatus?.toLowerCase() || 'unknown'}`}
                      >
                        <option value={currentStatus || ''}>{currentStatus || 'Unknown'}</option>
                        {(statusTransitions[currentStatus] || []).map(status => (
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

export default ParcelTable;

