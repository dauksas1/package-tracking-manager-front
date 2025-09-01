
export  const loadAllParcelsApi = async ()=>{
        const response = await fetch("http://localhost:5190/api/parcels");
        const data = await response.json()
        return data
};

export  const createParcel = async (newParcel) => {
        const response = await fetch(`http://localhost:5190/api/parcels/createParcel`,{   
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(newParcel),
        });
    const text = await response.text();

    if(response.ok){
        alert(text)
    }else{
        alert(text)
    }
};

export async function updateParcelStatus(parcelId, newStatus) {
    const response = await fetch(`http://localhost:5190/api/parcels/${parcelId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus })
        });
    const data = await response.json();

  return {
    success: response.ok, // This line is key
    message: data.message,
  };


}

export async function getParcelById(id) {
  const response = await fetch(`http://localhost:5190/api/parcels/${id}`);
  if (!response.ok) throw new Error('Parcel not found');
  return await response.json();
}



