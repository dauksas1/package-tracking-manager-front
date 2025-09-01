import '../pages/ParcelDetails.css';
import NavigationBar from '../components/NavigationBar';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { updateParcelStatus } from '../services/api';

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

  useEffect(() => {
    const loadParcel = async () => {
      const data = await getParcelById(id);
      setParcel(data);
    };
    loadParcel();
  }, [id, getParcelById]);

      const handleStatusUpdate = async () => {


    const result = await updateParcelStatus(id, newStatus);
    console.log(parcel.statusHistory)
    
    if (result.success) {
      setMessage(result.message);
      const updated = await getParcelById(id);
      setParcel(updated);
      setShowConfirmation(true);
      setNewStatus(''); // Reset selection
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
          <div className="parcel-info">
            <p><strong>Tracking Number:</strong> {parcel.trackingNumber}</p>
            <p><strong>Status:</strong> {parcel.status} <em>({new Date(parcel.updatedAt).toLocaleString()})</em></p>

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
                  <button onClick={handleStatusUpdate}>Confirm Update</button>
                </div>
              ) : (
                <p>Status is final.</p>
              )}
              {message && <p className="status-message">{message}</p>}
            </div>

            <div className="status-history-vertical">
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

        {showConfirmation && (
          <div className="confirmation-modal" role="dialog" aria-modal="true">
            <div className="modal-content">
              <p>Status successfully updated to <strong>{parcel.status}</strong>.</p>
              <button onClick={() => setShowConfirmation(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ParcelDetails;

