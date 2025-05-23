import { baseUrl } from '@/api/host';
import { customFetch } from './customFetch';

const equipmentsUrl = `${baseUrl}/v1/equipments/`;

export async function fetchEquipments() {
  const response = await customFetch(equipmentsUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch equipments');
  }
  return response.json();
}

async function fetchImagesSignedUrls(filepaths) {
  const response = await customFetch(
    `${equipmentsUrl}images-signed-url?file_names=${encodeURIComponent(JSON.stringify(filepaths))}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch signed URLs');
  }

  return response.json();
}

async function uploadImagesToSignedUrls(signedUrls, images) {
  const uploadPromises = images.map((image) => {
    return fetch(signedUrls[image.name], {
      method: 'PUT',
      headers: {
        'Content-Type': image.type,
        'x-amz-acl': 'public-read',
      },
      body: image,
    });
  });

  const responses = await Promise.all(uploadPromises);
  const allUploadsSuccessful = responses.every((response) => response.ok);

  if (!allUploadsSuccessful) {
    const errorResponses = await Promise.all(responses.map((response) => response.text()));
    throw new Error(`Failed to upload images: ${errorResponses.join(', ')}`);
  }
}

export async function addEquipment(equipmentData) {
  const filePaths = equipmentData.files.map((file) => file.name);
  const signedUrlsResponse = await fetchImagesSignedUrls(filePaths);

  try {
    await uploadImagesToSignedUrls(signedUrlsResponse, equipmentData.files);
  } catch (error) {
    throw new Error('Failed to upload images');
  }

  const requestBody = {
    asset_id: equipmentData.assetId,
    device_id: equipmentData.deviceId,
    model: equipmentData.model,
    serial_number: equipmentData.serial,
    location_id: equipmentData.location,
    image_urls: filePaths,
    primary_image_index: equipmentData.primaryImageIndex,
    status: equipmentData.status,
    category_id: equipmentData.category,
    calibration_category: equipmentData.calibrationCategory,
    notes: equipmentData.notes,
    case_id: equipmentData.caseId ? equipmentData.caseId : undefined,
  };

  const response = await customFetch(equipmentsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error('Failed to add equipment');
  }

  return response.json();
}


export async function editEquipment(equipmentData) {
  const filePaths = equipmentData.files.map((file) => file.name);
  const signedUrlsResponse = await fetchImagesSignedUrls(filePaths);

  try {
    await uploadImagesToSignedUrls(signedUrlsResponse, equipmentData.files);
  } catch (error) {
    throw new Error('Failed to upload images');
  }
  const bodyData = {
    status: equipmentData.status,
    location_id: equipmentData.location,
    image_urls: filePaths,
    primary_image_index: equipmentData.primaryImageIndex,
    notes: equipmentData.notes,
    case_id: equipmentData.caseId ? equipmentData.caseId : undefined,
  };
  const response = await customFetch(`${equipmentsUrl}${equipmentData?.equip_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bodyData),
  });
  if (!response.ok) {
    throw new Error('Failed to edit equipment');
  }
  return response.json();
}



export async function fetchEquipment(id) {
  const response = await customFetch(`${equipmentsUrl}${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch equipment');
  }
  return response.json();
}


async function fetchSignedUrlForPDF(fileName) {
  const response = await customFetch(`${equipmentsUrl}pdf-signed-url?file_name=${encodeURIComponent(fileName)}`);
  if (response.status !== 200) {
    throw new Error(`Failed to fetch signed URL, status: ${response.status}`);
  }
  let signedUrl;
  try {
    signedUrl = await response.text();
  } catch (error) {
    throw new Error('Failed to read the signed URL from the response');
  }

  return signedUrl;
}

async function uploadPDFToSignedUrl(signedUrl, pdfFile) {
  const response = await fetch(signedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': pdfFile.type,
      'x-amz-acl': 'public-read',
    },
    body: pdfFile,
  });
  if (!response.ok) {
    throw new Error('Failed to upload PDF');
  }
}

export async function addCalibrations(formattedData) {
  const pdfFile = formattedData.pdfFile;
  const signedUrl = await fetchSignedUrlForPDF(pdfFile.name); // Use the plain text signed URL
  try {
    await uploadPDFToSignedUrl(signedUrl, pdfFile);
  } catch (error) {
    throw new Error('Failed to upload PDF');
  }
  const response = await customFetch(`${equipmentsUrl}${formattedData.equipmentId}/calibration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider_id: formattedData.provider,
      calibration_type: formattedData.calibrationType,
      completion_date_iso: formattedData.dateCompleted,
      expiry_date_iso: formattedData.expiryDate,
      pdf_file_url: pdfFile.name,
      notes: formattedData.notes,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to add calibration');
  }
  return response.json(); // Return the JSON response from the server
}

export async function editCalibration(formattedData) {
  const pdfFile = formattedData.pdfFile;
  const signedUrl = await fetchSignedUrlForPDF(pdfFile.name); // Use the plain text signed URL
  try {
    await uploadPDFToSignedUrl(signedUrl, pdfFile);
  } catch (error) {
    throw new Error('Failed to upload PDF');
  }
  const response = await customFetch(
    `${equipmentsUrl}${formattedData.equipmentId}/calibration/${formattedData.calibrationId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider_id: formattedData.provider,
        calibration_type: formattedData.calibrationType,
        completion_date_iso: formattedData.dateCompleted,
        expiry_date_iso: formattedData.expiryDate,
        pdf_file_url: pdfFile.name,
        notes: formattedData.notes,
      }),
    }
  );
  if (!response.ok) {
    throw new Error('Failed to edit calibration');
  }
  return response.json();
}

export async function archiveEquipment(equipmentId) {
  const response = await customFetch(`${equipmentsUrl}${equipmentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to upload PDF');
  }
}
