
export const loadAllParcels = async ()=>{
    const response = await fetch("http://localhost:8080/api/parcels");
    const data = await response.json()
    return data
};

export const createParcel = async (formedParcel) => {
    const response = await fetch(`http://localhost:8080/api/parcels/createParcel`,
        {   
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formedParcel),
        });
    const text = await response.text();

    if(response.ok){
        alert(text)
    }else{
        alert(text)
    }
};

export const updateParcelStatus = async (parcel) => {
    const response = await fetch(`http://localhost:8080/api/parcels/updateParcelStatus/${parcel.id}`,
        {   
            method:"PUT",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(parcel),
        });
    if(response.ok){
        alert("Parcel updated.")
    }
};
