import { baseUrl } from '@/api/host';

const casesUrl = `${baseUrl}/v1/cases/`;

export async function fetchCases() {
  const response = await fetch(casesUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch cases');
  }
  return response.json();
}

export async function addCase(caseData) {
  const response = await fetch(casesUrl, {
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




export async function UpdateCase({ caseId, selectedLocationId }) {
  console.log('Case ID:', caseId, 'Selected Location ID:', selectedLocationId);
  const requestBody = JSON.stringify({
    location_id: selectedLocationId,
  });

  console.log('Request Body:', requestBody); // Log the request body

  try {
    const response = await fetch(`${casesUrl}/${caseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    if (!response.ok) {
      const errorText = await response.text(); // Get the response text
      throw new Error(`Failed to update case: ${response.status} ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error during fetch:', error); // Log the error for debugging
    throw new Error('Network error: ' + error.message);
  }
}
