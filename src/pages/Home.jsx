import './Home.css';
import { useState, useEffect } from 'react';
import { loadAllParcelsApi, updateParcelStatusApi } from '../services/api.js';
import ParcelTable from '../components/ParcelTable.jsx';
import CreateParcelDialog from '../components/CreateParcelDialog';
import NavigationBar from '../components/NavigationBar.jsx';

function Home() {
  const [parcels, setParcels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  // Load all parcels from API
  const loadAllParcels = async () => {
    try {
      setLoading(true);
      const allParcels = await loadAllParcelsApi();
      setParcels(allParcels);
    } catch (error) {
      setError('Error occurred while loading parcels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllParcels();
  }, []);

  // Handle status update
  const handleStatusChange = async (parcelId, newStatus) => {
    const confirmed = window.confirm(
      `Are you sure you want to change the status to "${newStatus}"?`
    );
    if (!confirmed) return;

    try {
      await updateParcelStatusApi(parcelId, newStatus);
      await loadAllParcels();
    } catch (error) {
      setError('Failed to update parcel status');
    }
  };

  return (
    <>
      <NavigationBar />

      <ParcelTable
        parcels={parcels}
        setShowDialog={setShowDialog}
        reloadParcels={loadAllParcels}
        onStatusChange={handleStatusChange}
      />

      {showDialog && (
        <CreateParcelDialog
          onClose={() => setShowDialog(false)}
          onCreate={() => {
            setShowDialog(false);
            loadAllParcels();
          }}
        />
      )}
    </>
  );
}

export default Home