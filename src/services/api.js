
export const loadAllParcelsApi = async () => {
  const response = await fetch("http://localhost:5190/api/parcels");
  const data = await response.json();
  return data;
};

export const createParcelApi = async (newParcel) => {
  const response = await fetch("http://localhost:5190/api/parcels/createParcel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newParcel),
  });

};

export async function updateParcelStatusApi(parcelId, newStatus) {
  const response = await fetch(`http://localhost:5190/api/parcels/${parcelId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newStatus }),
  });

  const data = await response.json();

  return {
    success: response.ok,
    message: data.message,
  };
}

export async function getParcelByIdApi(id) {
  const response = await fetch(`http://localhost:5190/api/parcels/${id}`);
  if (!response.ok) throw new Error("Parcel not found");
  return await response.json();
}