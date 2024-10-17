import { baseUrl } from '@/api/host';

const equipmentsUrl = `${baseUrl}/v1/equipments/`;

export async function fetchEquipments() {
  const response = await fetch(equipmentsUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch equipments');
  }
  return response.json();
}

async function fetchImagesSignedUrls(filepaths) {
  const response = await fetch(
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

  // Check error in uploading images
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

  const response = await fetch(equipmentsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      asset_id: equipmentData.assetId,
      device_id: equipmentData.deviceId,
      model: equipmentData.model,
      serial_number: equipmentData.serial,
      case_id: equipmentData.caseId,
      location_id: equipmentData.location,
      image_urls: filePaths,
      primary_image_index: equipmentData.selectedImageIndex.idx,
      status: equipmentData.status,
      category_id: equipmentData.category,
      calibration_category: equipmentData.calibrationCategory,
      notes: equipmentData.notes,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to add equipment');
  }

  return response.json();
}


export async function fetchSepecificEquipments(id) {
  console.log(id)
  const response = await fetch(`${equipmentsUrl}${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch equipments');
  }
  return response.json();
}




export async function addCalibrations(formattedData) {
  // const filePaths = equipmentData.files.map((file) => file.name);
  // const signedUrlsResponse = await fetchImagesSignedUrls(filePaths);
  // try {
  //   await uploadImagesToSignedUrls(signedUrlsResponse, equipmentData.files);
  // } catch (error) {
  //   throw new Error('Failed to upload images');
  // }

  const bodydata ={
    provider_id: formattedData.provider,
    calibration_type: formattedData.calibrationType,
    completion_date_iso: formattedData.dateCompleted,
    expiry_date_iso: formattedData.expiryDate,
    pdf_file_url: 'https://example.com/calibration.pdf',
    notes: formattedData.notes,
  }
  console.log(bodydata)

  const response = await fetch((`${equipmentsUrl}7b36c42a-2074-4778-97e2-7a7f4d18d3ca/calibration`), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider_id: formattedData.provider,
      calibration_type: formattedData.calibrationType,
      completion_date_iso: formattedData.dateCompleted,
      expiry_date_iso: formattedData.expiryDate,
      pdf_file_url: 'https://example.com/calibration.pdf',
      notes: formattedData.notes,
      
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to add equipment');
  }

  return response.json();
}
