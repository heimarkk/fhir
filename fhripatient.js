/**
 * FHIR Patient Management JavaScript Library
 * This file contains functions for managing FHIR Patient resources
 * Compatible with FHIR R4 specification
 */

class FHIRPatientManager {
  constructor() {
    //this.baseUrl = 'https://hapi.fhir.org/baseR4';
    this.baseUrl = "https://fhir-bootcamp.medblocks.com/fhir/";
    this.patients = [];
    this.selectedPatient = null; // Add selected patient state
    this.init();
  }

  init() {
    this.log("FHIR Patient Manager initialized");
    this.setupEventListeners();
    this.updateServerUrl();
  }

  setupEventListeners() {
    // Patient form submission
    const patientForm = document.getElementById("patientForm");
    if (patientForm) {
      patientForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.createPatient();
      });
    }

    // Server URL change
    const fhirServerUrl = document.getElementById("fhirServerUrl");
    if (fhirServerUrl) {
      fhirServerUrl.addEventListener("change", () => {
        this.updateServerUrl();
      });
    }
  }

  updateServerUrl() {
    const urlInput = document.getElementById("fhirServerUrl");
    if (urlInput && urlInput.value) {
      this.baseUrl = urlInput.value.replace(/\/$/, ""); // Remove trailing slash
      this.log(`FHIR Server URL updated to: ${this.baseUrl}`);
    }
  }

  /**
   * Utility function to log messages to both console and UI
   */
  log(message, type = "info") {
    console.log(message);
    const output = document.getElementById("output");
    if (output) {
      const timestamp = new Date().toLocaleTimeString();
      const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}\n`;
      output.textContent += logEntry;
      output.scrollTop = output.scrollHeight;
    }
  }

  /**
   * Display error messages
   */
  showError(message) {
    this.log(`ERROR: ${message}`, "error");
    const results = document.getElementById("results");
    if (results) {
      results.innerHTML = `<div class="error">❌ Error: ${message}</div>`;
    }
  }

  /**
   * Display success messages
   */
  showSuccess(message) {
    this.log(`SUCCESS: ${message}`, "success");
    const results = document.getElementById("results");
    if (results) {
      results.innerHTML = `<div class="success">✅ Success: ${message}</div>`;
    }
  }

  /**
   * Test connection to FHIR server
   */
  async testConnection() {
    try {
      this.log("Testing connection to FHIR server...");
      const response = await fetch(`${this.baseUrl}/metadata`, {
        method: "GET",
        headers: {
          Accept: "application/fhir+json",
        },
      });

      if (response.ok) {
        const metadata = await response.json();
        this.showSuccess(
          `Connected to FHIR server: ${metadata.software?.name || "Unknown"} v${
            metadata.software?.version || "Unknown"
          }`
        );
        this.displayFHIRResource(metadata);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      this.showError(`Connection failed: ${error.message}`);
    }
  }

  /**
   * Create a FHIR Patient resource from form data
   */
  createPatientResource() {
    const firstName = document.getElementById("firstName")?.value || "";
    const lastName = document.getElementById("lastName")?.value || "";
    const gender = document.getElementById("gender")?.value || "";
    const birthDate = document.getElementById("birthDate")?.value || "";
    const phone = document.getElementById("phone")?.value || "";
    const email = document.getElementById("email")?.value || "";
    const address = document.getElementById("address")?.value || "";

    // Validation checks
    if (!firstName.trim()) {
      this.showError("First name cannot be null or empty");
      return null;
    }

    if (!lastName.trim()) {
      this.showError("Last name cannot be null or empty");
      return null;
    }

    if (!gender.trim()) {
      this.showError("Gender cannot be null or empty");
      return null;
    }

    // Validate birth date
    if (!birthDate.trim()) {
      this.showError("Birth date cannot be null or empty");
      return null;
    }
    //Policy check for entered data
    if (birthDate) {
      const birthDateObj = new Date(birthDate);
      const today = new Date();

      if (isNaN(birthDateObj.getTime())) {
        this.showError("Birth date must be a valid date");
        return null;
      }

      if (birthDateObj > today) {
        this.showError("Birth date cannot be in the future");
        return null;
      }
    }

    // Validate email format if provided
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        this.showError("Email must be in valid format (example@domain.com)");
        return null;
      }
    }

    // Validate phone number format if provided
    if (phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""))) {
        this.showError(
          "Phone number must contain only digits and valid formatting characters"
        );
        return null;
      }
    }

    const patient = {
      resourceType: "Patient",
      active: true,
      name: [
        {
          use: "official",
          family: lastName,
          given: [firstName],
        },
      ],
      gender: gender,
      telecom: [],
    };

    // Add birth date if provided
    if (birthDate) {
      patient.birthDate = birthDate;
    }

    // Add phone if provided
    if (phone) {
      patient.telecom.push({
        system: "phone",
        value: phone,
        use: "home",
      });
    }

    // Add email if provided
    if (email) {
      patient.telecom.push({
        system: "email",
        value: email,
        use: "home",
      });
    }

    // Add address if provided
    if (address) {
      patient.address = [
        {
          use: "home",
          type: "both",
          text: address,
        },
      ];
    }

    return patient;
  }

  /**
   * Set selected patient as state
   */
  setSelectedPatient(patient) {
    this.selectedPatient = patient;
    this.log(
      `Selected patient set: ${this.getPatientName(patient)} (ID: ${
        patient.id
      })`
    );
  }

  /**
   * Get current selected patient
   */
  getSelectedPatient() {
    return this.selectedPatient;
  }

  /**
   * Clear selected patient
   */
  clearSelectedPatient() {
    if (this.selectedPatient) {
      this.log(
        `Cleared selected patient: ${this.getPatientName(this.selectedPatient)}`
      );
    }
    this.updateSubmitButton("create");
    this.selectedPatient = null;
  }

  /**
   * Update submit button caption and functionality
   */
  updateSubmitButton(mode = "create") {
    const submitButton = document.querySelector(
      '#patientForm button[type="submit"]'
    );
    if (submitButton) {
      if (mode === "update") {
        submitButton.textContent = "Update Patient";
        submitButton.onclick = (e) => {
          e.preventDefault();
          if (window.updateSelectedPatient) {
            window.updateSelectedPatient();
          }
        };
      } else {
        submitButton.textContent = "Create Patient";
        submitButton.onclick = (e) => {
          e.preventDefault();
          this.createPatient();
        };
      }
    }
  }

  /**
   * Create a new patient
   */
  async createPatient() {
    try {
      const patientResource = this.createPatientResource();

      // Exit immediately if validation failed
      if (!patientResource) {
        return;
      }

      this.log("Creating patient...");
      this.displayFHIRResource(patientResource);

      const response = await fetch(`${this.baseUrl}/Patient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/fhir+json",
          Accept: "application/fhir+json",
        },
        body: JSON.stringify(patientResource),
      });

      if (response.ok) {
        const createdPatient = await response.json();
        const patientName = this.getPatientName(createdPatient);
        this.showSuccess(
          `Patient created successfully: ${patientName} (ID: ${createdPatient.id})`
        );

        // Set selected patient when new patient has been successfully added
        this.setSelectedPatient(createdPatient);

        // Change submit button caption to Update
        this.updateSubmitButton("update");

        this.displayFHIRResource(createdPatient);
        // Don't clear form after creation to allow immediate updates
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (error) {
      this.showError(`Failed to create patient: ${error.message}`);
    }
  }

  /**
   * Search for patients by name
   */
  async searchPatients() {
    try {
      const searchTerm = document.getElementById("searchTerm")?.value || "";
      if (!searchTerm.trim()) {
        this.showError("Please enter a search term");
        return;
      }

      this.log(`Searching for patients with name: ${searchTerm}`);
      const response = await fetch(
        `${this.baseUrl}/Patient?name=${encodeURIComponent(searchTerm)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/fhir+json",
          },
        }
      );

      if (response.ok) {
        const bundle = await response.json();
        this.displaySearchResults(bundle);
        this.displayFHIRResource(bundle);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      this.showError(`Search failed: ${error.message}`);
    }
  }

  /**
   * Get patient by ID
   */
  async getPatientById() {
    try {
      const patientId = document.getElementById("patientId")?.value || "";
      if (!patientId.trim()) {
        this.showError("Please enter a patient ID");
        return;
      }

      this.log(`Fetching patient with ID: ${patientId}`);
      const response = await fetch(`${this.baseUrl}/Patient/${patientId}`, {
        method: "GET",
        headers: {
          Accept: "application/fhir+json",
        },
      });

      if (response.ok) {
        const patient = await response.json();
        const patientName = this.getPatientName(patient);
        this.showSuccess(`Patient found: ${patientName}`);
        this.displaySinglePatient(patient);
        this.displayFHIRResource(patient);
      } else if (response.status === 404) {
        this.showError(`Patient with ID ${patientId} not found`);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      this.showError(`Failed to fetch patient: ${error.message}`);
    }
  }

  /**
   * Get all patients (limited to first 20 for performance)
   */
  async getAllPatients() {
    try {
      this.log("Fetching all patients...");
      //const response = await fetch(`${this.baseUrl}/Patient?_count=20`, {
      const response = await fetch(`${this.baseUrl}/Patient`, {
        method: "GET",
        headers: {
          Accept: "application/fhir+json",
        },
      });

      if (response.ok) {
        const bundle = await response.json();
        this.displaySearchResults(bundle);
        this.displayFHIRResource(bundle);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      this.showError(`Failed to fetch patients: ${error.message}`);
    }
  }

  /**
   * Load patient data for updating
   */
  async loadPatientForUpdate() {
    try {
      const patientId = document.getElementById("updatePatientId")?.value || "";
      if (!patientId.trim()) {
        this.showError("Please enter a patient ID to update");
        return;
      }

      this.log(`Loading patient ${patientId} for update...`);
      const response = await fetch(`${this.baseUrl}/Patient/${patientId}`, {
        method: "GET",
        headers: {
          Accept: "application/fhir+json",
        },
      });

      if (response.ok) {
        const patient = await response.json();
        this.populateFormWithPatient(patient);

        // Set selected patient when patient is loaded for update
        this.setSelectedPatient(patient);

        // Change submit button caption to Update
        this.updateSubmitButton("update");

        this.showSuccess(
          `Patient loaded for update: ${this.getPatientName(patient)}`
        );
        this.displayFHIRResource(patient);
      } else if (response.status === 404) {
        this.showError(`Patient with ID ${patientId} not found`);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      this.showError(`Failed to load patient: ${error.message}`);
    }
  }

  /**
   * Delete a patient
   */
  async deletePatient() {
    try {
      const patientId = document.getElementById("updatePatientId")?.value || "";
      if (!patientId.trim()) {
        this.showError("Please enter a patient ID to delete");
        return;
      }

      const confirmDelete = confirm(
        `Are you sure you want to delete patient ${patientId}? This action cannot be undone.`
      );
      if (!confirmDelete) {
        this.log("Delete operation cancelled by user");
        return;
      }

      this.log(`Deleting patient with ID: ${patientId}`);
      const response = await fetch(`${this.baseUrl}/Patient/${patientId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/fhir+json",
        },
      });

      if (response.ok || response.status === 204) {
        this.showSuccess(`Patient ${patientId} deleted successfully`);

        // Clear selected patient when patient is deleted
        this.clearSelectedPatient();

        document.getElementById("updatePatientId").value = "";
      } else if (response.status === 404) {
        this.showError(`Patient with ID ${patientId} not found`);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      this.showError(`Failed to delete patient: ${error.message}`);
    }
  }

  /**
   * Utility function to extract patient name
   */
  getPatientName(patient) {
    if (patient.name && patient.name.length > 0) {
      const name = patient.name[0];
      const given = name.given ? name.given.join(" ") : "";
      const family = name.family || "";
      return `${given} ${family}`.trim() || "Unknown";
    }
    return "Unknown";
  }

  /**
   * Utility function to format patient demographics
   */
  formatPatientDemographics(patient) {
    const name = this.getPatientName(patient);
    const gender = patient.gender
      ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)
      : "Unknown";
    const birthDate = patient.birthDate || "Unknown";
    const id = patient.id || "Unknown";

    let telecom = "";
    if (patient.telecom && patient.telecom.length > 0) {
      telecom = patient.telecom
        .map((t) => `${t.system}: ${t.value}`)
        .join(", ");
    }

    return { name, gender, birthDate, id, telecom };
  }

  /**
   * Display search results
   */
  displaySearchResults(bundle) {
    const results = document.getElementById("results");
    if (!results) return;

    if (!bundle.entry || bundle.entry.length === 0) {
      results.innerHTML =
        "<p>No patients found matching your search criteria.</p>";
      return;
    }

    let html = `<h3>Found ${bundle.entry.length} patient(s):</h3><div class="patient-list">`;

    bundle.entry.forEach((entry) => {
      const patient = entry.resource;
      const demo = this.formatPatientDemographics(patient);

      html += `
                <div class="patient-card">
                    <div class="patient-id">ID: ${demo.id}</div>
                    <div><strong>Name:</strong> ${demo.name}</div>
                    <div><strong>Gender:</strong> ${demo.gender}</div>
                    <div><strong>Birth Date:</strong> ${demo.birthDate}</div>
                    ${
                      demo.telecom
                        ? `<div><strong>Contact:</strong> ${demo.telecom}</div>`
                        : ""
                    }
                </div>
            `;
    });

    html += "</div>";
    results.innerHTML = html;

    this.log(`Displayed ${bundle.entry.length} patients`);
  }

  /**
   * Display single patient
   */
  displaySinglePatient(patient) {
    const results = document.getElementById("results");
    if (!results) return;

    const demo = this.formatPatientDemographics(patient);

    const html = `
            <h3>Patient Details:</h3>
            <div class="patient-card">
                <div class="patient-id">ID: ${demo.id}</div>
                <div><strong>Name:</strong> ${demo.name}</div>
                <div><strong>Gender:</strong> ${demo.gender}</div>
                <div><strong>Birth Date:</strong> ${demo.birthDate}</div>
                ${
                  demo.telecom
                    ? `<div><strong>Contact:</strong> ${demo.telecom}</div>`
                    : ""
                }
                <div><strong>Active:</strong> ${
                  patient.active ? "Yes" : "No"
                }</div>
            </div>
        `;

    results.innerHTML = html;
    this.log("Displayed single patient details");
  }

  /**
   * Display FHIR resource JSON
   */
  displayFHIRResource(resource) {
    const fhirResource = document.getElementById("fhirResource");
    if (fhirResource) {
      fhirResource.innerHTML = `<pre><code>${JSON.stringify(
        resource,
        null,
        2
      )}</code></pre>`;
    }
  }

  /**
   * Populate form with patient data
   */
  populateFormWithPatient(patient) {
    if (patient.name && patient.name.length > 0) {
      const name = patient.name[0];
      if (name.given && name.given.length > 0) {
        document.getElementById("firstName").value = name.given[0];
      }
      if (name.family) {
        document.getElementById("lastName").value = name.family;
      }
    }

    if (patient.gender) {
      document.getElementById("gender").value = patient.gender;
    }

    if (patient.birthDate) {
      document.getElementById("birthDate").value = patient.birthDate;
    }

    // Populate telecom
    if (patient.telecom) {
      patient.telecom.forEach((telecom) => {
        if (telecom.system === "phone") {
          document.getElementById("phone").value = telecom.value;
        } else if (telecom.system === "email") {
          document.getElementById("email").value = telecom.value;
        }
      });
    }

    // Populate address
    if (patient.address && patient.address.length > 0) {
      document.getElementById("address").value = patient.address[0].text || "";
    }
  }

  /**
   * Clear the patient form
   */
  clearForm() {
    const form = document.getElementById("patientForm");
    if (form) {
      form.reset();
      // Reset submit button to create mode
      this.updateSubmitButton("create");
      this.setSelectedPatient(null);
      this.log("Form cleared");
    }
  }

  /**
   * Clear results display
   */
  clearResults() {
    const results = document.getElementById("results");
    if (results) {
      results.innerHTML =
        "<p>No results to display. Use the search functions above to find patients.</p>";
    }

    const fhirResource = document.getElementById("fhirResource");
    if (fhirResource) {
      fhirResource.innerHTML =
        "<p>FHIR resource JSON will appear here when you create or fetch a patient.</p>";
    }

    this.log("Results cleared");
  }

  /**
   * Clear debug output
   */
  clearOutput() {
    const output = document.getElementById("output");
    if (output) {
      output.textContent = "Console output cleared...\n";
    }
  }

  /**
   * Calculate age from birth date
   */
  calculateAge(birthDate) {
    if (!birthDate) return "Unknown";

    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }

  /**
   * Export patient data as JSON
   */
  exportPatientData(patient) {
    const dataStr = JSON.stringify(patient, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `patient_${patient.id || "unknown"}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    this.log(`Patient data exported: ${exportFileDefaultName}`);
  }

  /**
   * Validate FHIR Patient resource
   */
  validatePatientResource(patient) {
    const errors = [];

    if (!patient.resourceType || patient.resourceType !== "Patient") {
      errors.push('Resource type must be "Patient"');
    }

    if (!patient.name || patient.name.length === 0) {
      errors.push("Patient must have at least one name");
    }

    if (
      patient.gender &&
      !["male", "female", "other", "unknown"].includes(patient.gender)
    ) {
      errors.push("Invalid gender value");
    }

    if (patient.birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(patient.birthDate)) {
      errors.push("Birth date must be in YYYY-MM-DD format");
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }
}

// Initialize the FHIR Patient Manager when the DOM is loaded
let fhirPatient;

document.addEventListener("DOMContentLoaded", function () {
  fhirPatient = new FHIRPatientManager();
});

// Expose the class globally for external use
window.FHIRPatientManager = FHIRPatientManager;
