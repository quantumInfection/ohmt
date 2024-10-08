export async function fetchEquipments() {
  const response = await fetch('https://clownfish-app-vi4my.ondigitalocean.app/v1/mock/equipments');
  if (!response.ok) {
    throw new Error('Failed to fetch equipments');
  }
  return response.json();
}
