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
