import './ParcelTable.css';
import { useState } from 'react';
import { updateParcelStatusApi } from '../services/api.js';
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
  const [selectedParcelId, setSelectedParcelId] = useState(null);
  const [selectedNewStatus, setSelectedNewStatus] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);

  const navigate = useNavigate();

  const filteredParcels = parcels.filter(parcel => {
    const matchesTracking = parcel.trackingNumber
      .toLowerCase()
      .includes(trackingFilter.toLowerCase());

    const matchesStatus = statusFilter ? parcel.status === statusFilter : true;

    return matchesTracking && matchesStatus;
  });

  const handleStatusSelect = (parcelId, newStatus) => {
    setSelectedParcelId(parcelId);
    setSelectedNewStatus(newStatus);
    setShowConfirmationModal(true);
  };

  const confirmStatusChange = async () => {
    try {
      await updateParcelStatusApi(selectedParcelId, selectedNewStatus);
      await reloadParcels();
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to update status:', error);
      setShowFailureModal(true);
    } finally {
      setShowConfirmationModal(false);
    }
  };

  const handleRowClick = (parcelId) => {
    navigate(`/parcel/${parcelId}`);
  };

  return (
    <div className="table-container">
      <h2 className="table-title">📦 All Parcels</h2>

      {/* Filters and Controls */}
      <div className="table-controls">
        <div className="control-group">
          <input
            id="tracking"
            type="text"
            placeholder="Search tracking number"
            value={trackingFilter}
            onChange={(e) => setTrackingFilter(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="control-group">
          <label className="control-label" htmlFor="status">STATUS FILTER:</label>
          <select
            id="status"
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

        <button
          className="create-package-button"
          onClick={() => setShowDialog(true)}
        >
          CREATE NEW PACKAGE
        </button>
      </div>

      {/* Parcel Table */}
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
                        onChange={(e) => handleStatusSelect(parcel.id, e.target.value)}
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

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="confirmation-modal" role="dialog" aria-modal="true">
          <div className="modal-content">
            <p>
              Are you sure you want to update the status to <strong>{selectedNewStatus}</strong>?
            </p>
            {(selectedNewStatus === 'Canceled' || selectedNewStatus === 'Accepted') && (
              <p className="final-warning">
                ⚠️ Please note: <strong>{selectedNewStatus}</strong> is a final status and cannot be changed later.
              </p>
            )}
            <div className="modal-buttons">
              <button onClick={confirmStatusChange}>Yes</button>
              <button onClick={() => setShowConfirmationModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="confirmation-modal" role="dialog" aria-modal="true">
          <div className="modal-content">
            <p>Status successfully updated to <strong>{selectedNewStatus}</strong>.</p>
            <button onClick={() => setShowSuccessModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Failure Modal */}
      {showFailureModal && (
        <div className="confirmation-modal failure" role="dialog" aria-modal="true">
          <div className="modal-content">
            <p>❌ Failed to update status. Please try again later.</p>
            <button onClick={() => setShowFailureModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParcelTable;
