/**
 * Patient Update Functions
 * This file contains functions for updating FHIR Patient resources
 */

/**
 * Update the currently selected patient
 */
async function updateSelectedPatient() {
  if (!fhirPatient) {
    console.error("FHIR Patient Manager not initialized");
    return;
  }

  const selectedPatient = fhirPatient.getSelectedPatient();
  if (!selectedPatient) {
    fhirPatient.showError(
      "No patient selected for update. Please load a patient first."
    );
    return;
  }

  try {
    // Create updated patient resource from form data
    const updatedPatientResource = fhirPatient.createPatientResource();

    // Exit immediately if validation failed
    if (!updatedPatientResource) {
      return;
    }

    updatedPatientResource.id = selectedPatient.id;

    fhirPatient.log(`Updating patient ${selectedPatient.id}...`);

    const response = await fetch(
      `${fhirPatient.baseUrl}/Patient/${selectedPatient.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/fhir+json",
          Accept: "application/fhir+json",
        },
        body: JSON.stringify(updatedPatientResource),
      }
    );

    if (response.ok) {
      const updatedPatient = await response.json();
      const patientName = fhirPatient.getPatientName(updatedPatient);

      // Update the selected patient state with new data
      fhirPatient.setSelectedPatient(updatedPatient);

      fhirPatient.showSuccess(`Patient updated successfully: ${patientName}`);
      fhirPatient.displayFHIRResource(updatedPatient);
    } else {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
  } catch (error) {
    fhirPatient.showError(`Failed to update patient: ${error.message}`);
  }
}

// Make function available globally
window.updateSelectedPatient = updateSelectedPatient;
