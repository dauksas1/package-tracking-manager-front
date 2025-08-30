import '../components/ParcelTable.jsx'
import './Home.css'
import { useState, useEffect } from 'react'
import { loadAllParcels} from '../services/api.js'
import ParcelTable from '../components/ParcelTable.jsx'
import NavigationBar from '../components/NavigationBar.jsx'

function Home(){
    
        const testParcels = [
                                {
                                    id: 1,
                                    trackingNumber: "LT1234567890",
                                    sender: {
                                    name: "Jonas Petrauskas",
                                    address: "Vilniaus g. 10, Vilnius, LT-01119",
                                    phone: "+37061234567"
                                    },
                                    recipient: {
                                    name: "Agnė Žukauskaitė",
                                    address: "Kauno g. 5, Kaunas, LT-44296",
                                    phone: "+37069876543"
                                    },
                                    status: "Created",
                                    createdAt: "2025-08-28T10:15:00Z",
                                    expectedDelivery: "2025-09-01"
                                },
                                {
                                    id: 2,
                                    trackingNumber: "LT9876543210",
                                    sender: {
                                    name: "Darius Janulaitis",
                                    address: "Klaipėdos g. 22, Klaipėda, LT-92130",
                                    phone: "+37061233445"
                                    },
                                    recipient: {
                                    name: "Eglė Skuodaite",
                                    address: "Šiaulių g. 8, Šiauliai, LT-76289",
                                    phone: "+37069911223"
                                    },
                                    status: "Sent",
                                    createdAt: "2025-08-27T09:30:00Z",
                                    expectedDelivery: "2025-09-02"
                                },
                                {
                                    id: 3,
                                    trackingNumber: "LT5678901234",
                                    sender: {
                                    name: "Mantas Vaitkus",
                                    address: "Panevėžio g. 3, Panevėžys, LT-35100",
                                    phone: "+37061122334"
                                    },
                                    recipient: {
                                    name: "Rūta Kazlauskienė",
                                    address: "Alytaus g. 12, Alytus, LT-62100",
                                    phone: "+37069099887"
                                    },
                                    status: "Returned",
                                    createdAt: "2025-08-26T14:45:00Z",
                                    expectedDelivery: "2025-09-03"
                                },
                                {
                                    id: 4,
                                    trackingNumber: "LT2468135790",
                                    sender: {
                                    name: "Tomas Žilinskas",
                                    address: "Ukmergės g. 77, Vilnius, LT-09120",
                                    phone: "+37061200000"
                                    },
                                    recipient: {
                                    name: "Simona Petrauskaitė",
                                    address: "Jonavos g. 15, Kaunas, LT-44269",
                                    phone: "+37069888888"
                                    },
                                    status: "Accepted",
                                    createdAt: "2025-08-25T16:00:00Z",
                                    expectedDelivery: "2025-08-30"
                                },
                                {
                                    id: 5,
                                    trackingNumber: "LT1357924680",
                                    sender: {
                                    name: "Justinas Žemaitis",
                                    address: "Neringos g. 5, Palanga, LT-00137",
                                    phone: "+37061299999"
                                    },
                                    recipient: {
                                    name: "Laura Vaitkutė",
                                    address: "Birutės g. 20, Klaipėda, LT-92294",
                                    phone: "+37069977777"
                                    },
                                    status: "Canceled",
                                    createdAt: "2025-08-24T11:20:00Z",
                                    expectedDelivery: "2025-08-29"
                                }
                            ];




    
        const [parcels, setParcels] = useState([])

        const [searchQuery, setSearchQuery] = useState("")

        const [error, setError] = useState(null)

        const [loading, setLoading] = useState(true)

        const loadAllParcels = async () => {
                try{
                    setLoading(true)
                    const allParcels = await loadAllParcels();
                    setParcels(testParcels)
                } catch(error){
                    setError("Error occured while loading parcels")
                } finally{
                    setLoading(false)
                }
            } 

        useEffect(() => {
            loadAllParcels()
        }, [])

        const handleParcelSearch = async (e) => {
            e.preventDefault();
            if (searchQuery === ""){
               loadAllParcels();
               return;
            }
            if (loading) return;
            

            setLoading(true)
            try{
                const searchResults = await searchParcels(searchQuery)
                setParcels(searchResults)
                setError(null)

            }catch(error){
                setError("Error occured while attempting search")
            }finally{
                setLoading(false);
            }
            
        }

return(
    <>
        <NavigationBar/>
        <ParcelTable parcels = {testParcels}/>
    </>
    )
}
export default Home