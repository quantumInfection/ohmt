import { baseUrl } from '@/api/host';
import { customFetch } from './customFetch';

const casesUrl = `${baseUrl}/v1/cases/`;

export async function fetchCases() {
  const response = await customFetch(casesUrl);
  if (!response.ok) {
    console.error('Failed to fetch cases', response);
    throw new Error('Failed to fetch cases' + response);
  }
  return response.json();
}

export async function addCase(caseData) {
  const response = await customFetch(casesUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      case_id: caseData.caseId,
      name: caseData.name,
      location_id: caseData.location,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to add case');
  }

  return response.json();
}




export async function updateCase({ caseId, selectedLocationId }) { 
  const response = await fetch(`${casesUrl}${caseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      location_id: selectedLocationId
    }),
  });


  if (!response.ok) {
    throw new Error('Failed to add equipment');
  }

  return response.json();
}
