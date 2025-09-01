import '../pages/ParcelDetails.css';
import NavigationBar from '../components/NavigationBar';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { updateParcelStatusApi } from '../services/api';

const statusTransitions = {
  Created: ['Sent', 'Canceled'],
  Sent: ['Accepted', 'Returned', 'Canceled'],
  Returned: ['Sent', 'Canceled'],
  Accepted: [],
  Canceled: []
};

function ParcelDetails({ getParcelById }) {
  const { id } = useParams();

  const [parcel, setParcel] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [message, setMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);

  useEffect(() => {
    const loadParcel = async () => {
      try {
        const data = await getParcelById(id);
        setParcel(data);
      } catch (error) {
        console.error('Failed to load parcel:', error);
      }
    };
    loadParcel();
  }, [id, getParcelById]);

  const handleStatusUpdateClick = () => {
    if (!newStatus) {
      setMessage('Please select a status.');
      return;
    }
    setShowConfirmation(true);
  };

  const confirmStatusUpdate = async () => {
    setShowConfirmation(false);
    try {
      const result = await updateParcelStatusApi(id, newStatus);

      if (result?.success) {
        setMessage(result.message || 'Status updated.');
        const updated = await getParcelById(id);
        setParcel(updated);
        setNewStatus('');
        setShowSuccessModal(true);
      } else {
        setShowFailureModal(true);
      }
    } catch (error) {
      console.error('Status update failed:', error);
      setShowFailureModal(true);
    }
  };

  if (!parcel) return <div>Loading...</div>;

  const availableTransitions = statusTransitions[parcel.status] || [];

  return (
  <>
    <NavigationBar />

    <div className="parcel-details-container">
      <h2>📦 Package Details</h2>

      <div className="top-section">
        {/* Left Column */}
        <div className="parcel-info">
          {/* Tracking + Status Container */}
          <div className="info-box">
            <p><strong>Tracking Number:</strong> {parcel.trackingNumber}</p>
            <p>
              <strong>Status:</strong> {parcel.status}{' '}
              <em>({new Date(parcel.updatedAt).toLocaleString()})</em>
            </p>

            {/* Status Update */}
            <div className="status-update-inline">
              {availableTransitions.length > 0 ? (
                <div className="status-controls">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="">Select new status</option>
                    {availableTransitions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <button onClick={handleStatusUpdateClick}>Submit</button>
                </div>
              ) : (
                <p className="final-warning">
                  ⚠️ Status <strong>{parcel.status}</strong> is final.
                </p>
              )}
              {message && <p className="status-message">{message}</p>}
            </div>
          </div>

          {/* Status Timeline Container */}
          <div className="info-box">
            <h3>Status Timeline</h3>
            <ul>
              {parcel.statusHistory?.map((entry, index) => (
                <li key={index}>
                  <strong>{entry.status}</strong> — {new Date(entry.timestamp).toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="sender-recipient-section">
          <div className="sender-box">
            <h3>Sender</h3>
            <p>{parcel.senderName}</p>
            <p>{parcel.senderPhone}</p>
            <p>{parcel.senderAddress}</p>
          </div>

          <div className="recipient-box">
            <h3>Recipient</h3>
            <p>{parcel.recipientName}</p>
            <p>{parcel.recipientPhone}</p>
            <p>{parcel.recipientAddress}</p>
          </div>
        </div>
      </div>

      {/* Modals (unchanged) */}
      {showConfirmation && (
        <div className="confirmation-modal" role="dialog" aria-modal="true">
          <div className="modal-content">
            <p>
              Are you sure you want to update the status to <strong>{newStatus}</strong>?
            </p>
            {(newStatus === 'Canceled' || newStatus === 'Accepted') && (
              <p className="final-warning">
                ⚠️ Please note: <strong>{newStatus}</strong> is a final status and cannot be changed later.
              </p>
            )}
            <div className="modal-buttons">
              <button onClick={confirmStatusUpdate}>Yes</button>
              <button onClick={() => setShowConfirmation(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="confirmation-modal" role="dialog" aria-modal="true">
          <div className="modal-content">
            <p>Status successfully updated to <strong>{parcel.status}</strong>.</p>
            <button onClick={() => setShowSuccessModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showFailureModal && (
        <div className="confirmation-modal failure" role="dialog" aria-modal="true">
          <div className="modal-content">
            <p>❌ Failed to update status. Please try again later.</p>
            <button onClick={() => setShowFailureModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  </>
);
}

export default ParcelDetails;

