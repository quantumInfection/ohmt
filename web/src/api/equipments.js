export async function fetchEquipments() {
  const response = await fetch('https://clownfish-app-vi4my.ondigitalocean.app/v1/mock/equipments');
  if (!response.ok) {
    throw new Error('Failed to fetch equipments');
  }
  return response.json();
}

export async function addEquipment(equipmentData) {
  const response = await fetch('https://your-api-endpoint.com/equipments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(equipmentData),
  });

  if (!response.ok) {
    throw new Error('Failed to add equipment');
  }

  return response.json();
}
