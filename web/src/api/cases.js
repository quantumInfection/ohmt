import { baseUrl } from '@/api/host';

export async function fetchCases() {
  const response = await fetch(`${baseUrl}/v1/cases/`);
  if (!response.ok) {
    throw new Error('Failed to fetch cases');
  }
  return response.json();
}

export async function addCase(caseData) {
  const response = await fetch(`${baseUrl}/v1/cases/`, {
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
