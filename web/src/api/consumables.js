// import { baseUrl } from '@/api/host';
// import { customFetch } from './customFetch';

const consumableURL = `https://run.mocky.io/v3/65fbde9d-d3d8-43f2-9d2f-8cece7917a6a`;

export async function fetchConsumable() {
  const response = await fetch(consumableURL);
  if (!response.ok) {
    throw new Error('Failed to fetch consumable');
  }
  return response.json();
}
