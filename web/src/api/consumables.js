// import { baseUrl } from '@/api/host';
// import { customFetch } from './customFetch';

const consumableURL = `https://run.mocky.io/v3/37ecd20f-f8c5-4516-9b4b-96ecb6f08ce2`;

export async function fetchConsumable() {
  const response = await fetch(consumableURL);
  if (!response.ok) {
    throw new Error('Failed to fetch consumable');
  }
  return response.json();
}
