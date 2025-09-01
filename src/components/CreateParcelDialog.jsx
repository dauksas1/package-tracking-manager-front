import React, { useState, useEffect } from 'react';
import './CreateParcelDialog.css';
import { createParcel } from '../services/api';

function CreateParcelDialog({ onClose, onCreate }) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const generated = 'LT' + Math.floor(Math.random() * 1000000000);
    setTrackingNumber(generated);
  }, []);

  const validatePhone = (phone) => /^(\+370|370)[0-9]{8}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validatePhone(senderPhone)) newErrors.senderPhone = 'Invalid Lithuanian phone number';
    if (!validatePhone(recipientPhone)) newErrors.recipientPhone = 'Invalid Lithuanian phone number';
    if (!senderAddress.trim()) newErrors.senderAddress = 'Sender address is required';
    if (!recipientAddress.trim()) newErrors.recipientAddress = 'Recipient address is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newParcel = {
      trackingNumber,
      senderName,
      senderPhone,
      senderAddress,
      recipientName,
      recipientPhone,
      recipientAddress,
      status: 'Created',
      createdAt: new Date().toISOString(),
      expectedDelivery
    };

    try {
      await createParcel(newParcel);
      onCreate();
      onClose();
    } catch (error) {
      console.error('Parcel creation failed:', error);
    }
  };

return (
  <div className="dialog-overlay">
    <div className="dialog-box">
      <h2>Create New Parcel</h2>
      <form onSubmit={handleSubmit} className="parcel-form">
        <div className="tracking-section">
          <label>Tracking Number:</label>
          <input type="text" value={trackingNumber} disabled />
        </div>

        <div className="details-section">
          <div className="sender-details">
            <label>Sender Name:</label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              required
            />

            <label>Sender Phone:</label>
            <input
              type="text"
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
              required
            />
            {errors.senderPhone && <span className="error">{errors.senderPhone}</span>}

            <label>Sender Address:</label>
            <textarea
              className="sender-address"
              type="text"
              value={senderAddress}
              onChange={(e) => setSenderAddress(e.target.value)}
              required
            />
            {errors.senderAddress && <span className="error">{errors.senderAddress}</span>}
          </div>

          <div className="recipient-details">
            <label>Recipient Name:</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
            />

            <label>Recipient Phone:</label>
            <input
              type="text"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              required
            />
            {errors.recipientPhone && <span className="error">{errors.recipientPhone}</span>}

            <label>Recipient Address:</label>
            <textarea
              className="recipient-address"
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              required
            />
            {errors.recipientAddress && <span className="error">{errors.recipientAddress}</span>}
          </div>
        </div>

        <div className="delivery-section">
          <label>Expected Delivery:</label>
          <input
            type="date"
            value={expectedDelivery}
            onChange={(e) => setExpectedDelivery(e.target.value)}
            required
            min={new Date().toISOString().split("T")[0]}


          />
        </div>

        <div className="dialog-actions">
          <button type="submit">Create</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
);


}

export default CreateParcelDialog;







