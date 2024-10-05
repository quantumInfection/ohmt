export async function fetchCases() {
  const response = await fetch('https://clownfish-app-vi4my.ondigitalocean.app/v1/mock/cases');
  if (!response.ok) {
    throw new Error('Failed to fetch cases');
  }
  return response.json();
}

export async function addCase(caseData) {
  console.log('caseData:', caseData);
  const response = await fetch('https://your-api-endpoint.com/cases', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(caseData),
  });

  if (!response.ok) {
    throw new Error('Failed to add case');
  }

  return response.json();
}
