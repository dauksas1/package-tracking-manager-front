import '../components/ParcelTable.jsx'
import CreateParcelDialog from '../components/CreateParcelDialog';
import './Home.css'
import { useState, useEffect } from 'react'
import { loadAllParcelsApi, createParcel} from '../services/api.js'
import ParcelTable from '../components/ParcelTable.jsx'
import NavigationBar from '../components/NavigationBar.jsx'

function Home(){
    
    
        const [parcels, setParcels] = useState([])

        const [error, setError] = useState(null)

        const [loading, setLoading] = useState(true)

        const [showDialog, setShowDialog] = useState(false);

        const loadAllParcels = async () => {
                try{
                    setLoading(true)
                    const allParcels = await loadAllParcelsApi();
                    setParcels(allParcels)
                } catch(error){
                    setError("Error occured while loading parcels")
                } finally{
                    setLoading(false)
                }
            } 

        useEffect(() => {
            loadAllParcels()
        }, [])


return (
  <>
    <NavigationBar />
    <ParcelTable parcels={parcels} setShowDialog={setShowDialog} reloadParcels={loadAllParcels} />
    {showDialog && (
      <CreateParcelDialog
        onClose={() => setShowDialog(false)}
        onCreate={() => {
                setShowDialog(false);     // Close the dialog
                loadAllParcels();         // Reload parcels
         }      }


      />
    )}
  </>
);


}
export default Home