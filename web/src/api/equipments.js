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
    return customFetch(signedUrls[image.name], {
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
  } else {
    console.log('All images uploaded successfully!');
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

<<<<<<< HEAD
  const response = await customFetch(equipmentsUrl, {
=======


  const response = await fetch(equipmentsUrl, {
>>>>>>> 0077c1b (23 oct)
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

export async function editEquipment(equipmentData) {
  // console.log(equipmentData)
  const filePaths = equipmentData.files.map((file) => file.name);
  const signedUrlsResponse = await fetchImagesSignedUrls(filePaths);
  console.log(signedUrlsResponse)
  try {
    await uploadImagesToSignedUrls(signedUrlsResponse, equipmentData.files);
  } catch (error) {
    throw new Error('Failed to upload images');
  }

  const response = await fetch(`${equipmentsUrl}${equipmentData?.equip_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: equipmentData.status,
      case_id: equipmentData.caseId,
      location_id: equipmentData.location,
      image_urls:filePaths,
      primary_image_index: equipmentData.selectedImageIndex.idx,
      notes: equipmentData.notes,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to add equipment');
  }

  return response.json();
}

export async function fetchEquipment(id) {
  const response = await fetch(`${equipmentsUrl}${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch equipment');
  }
  return response.json();
}










async function fetchSignedUrlForPDF(fileName) {
  console.log(fileName);
  
  const response = await fetch(`${equipmentsUrl}/pdf-signed-url?file_name=${encodeURIComponent(fileName)}`);
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


  const response = await fetch(`${equipmentsUrl}${formattedData.equipmentId}/calibration`, {
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
  console.log(signedUrl)
console.log(pdfFile)
  try {
    await uploadPDFToSignedUrl(signedUrl, pdfFile);
  } catch (error) {
    throw new Error('Failed to upload PDF');
  }
  const response = await fetch(
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
    throw new Error('Failed to add equipment');
  }

  return response.json();
}
