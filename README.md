# FHIR Patient Manager

A JavaScript-based web application for managing FHIR (Fast Healthcare Interoperability Resources) patient data through a RESTful API interface.

## ⚠️ Important Notice

**This is a Proof of Concept (PoC) project.**

This application is designed for educational and demonstration purposes only. It is not intended for production use in healthcare environments or with real patient data.

## 🤖 AI-Generated Code Disclaimer

**Most of the code in this project was generated using Artificial Intelligence tools.** While the code has been reviewed and tested for basic functionality, users should thoroughly validate and test all functionality before any use, especially in healthcare-related contexts.

## Features

- **FHIR Server Connectivity**: Connect to FHIR-compliant servers
- **Patient Management**: Create, read, update, and delete patient records
- **Patient Search**: Search for patients by name or ID
- **Data Validation**: Client-side validation for patient data including:
  - Email format validation
  - Phone number format validation
  - Date validation (birth date cannot be in the future)
- **Real-time Logging**: Console and UI logging for operations
- **FHIR Resource Display**: View raw FHIR JSON resources

## Project Structure

```
├── fhripatient.js          # Main FHIR Patient Manager class
├── update.js               # Patient update functionality
├── index.html              # Main HTML interface
├── patientex.json          # Example patient data
├── fhir.schema.json        # FHIR schema definitions
├── settings.json           # Application settings
├── JavaScript_Instructions.md  # Development instructions
└── README.md               # This file
```

## Getting Started

1. **Open the Application**

   - Open `index.html` in a modern web browser
   - Ensure JavaScript is enabled

2. **Configure FHIR Server**

   - Default server: `https://fhir-bootcamp.medblocks.com/fhir/`
   - You can change the server URL in the application interface

3. **Test Connection**

   - Click "Test Connection" to verify server connectivity

4. **Manage Patients**
   - Create new patients using the form
   - Search for existing patients
   - Update or delete patient records

## FHIR Compliance

This application works with FHIR R4 specification and expects:

- Standard FHIR Patient resources
- JSON format (`application/fhir+json`)
- RESTful API endpoints for CRUD operations

## Browser Requirements

- Modern web browser with ES6+ support
- Fetch API support
- Local storage access for settings

## Development

The main functionality is contained in the `FHIRPatientManager` class in `fhripatient.js`. Key methods include:

- `createPatient()` - Create new patient records
- `searchPatients()` - Search for patients by name
- `getPatientById()` - Retrieve patient by ID
- `loadPatientForUpdate()` - Load patient data for editing
- `deletePatient()` - Remove patient records

## Data Validation

The application includes client-side validation for:

- **Required Fields**: First name, last name, gender, birth date
- **Email Format**: Standard email regex validation
- **Phone Numbers**: International format with length limits
- **Birth Date**: Must be a valid date, cannot be in the future

## License

**MIT License with Disclaimers**

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

**DISCLAIMER OF WARRANTIES AND LIABILITY**

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

**NO RESPONSIBILITY CLAUSE**

IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**THE AUTHORS AND COPYRIGHT HOLDERS TAKE NO RESPONSIBILITY FOR ANY CONSEQUENCES, DAMAGES, OR ISSUES THAT MAY ARISE FROM THE USE OF THIS SOFTWARE, INCLUDING BUT NOT LIMITED TO DATA LOSS, SECURITY BREACHES, COMPLIANCE VIOLATIONS, OR ANY OTHER DIRECT OR INDIRECT DAMAGES.**

**HEALTHCARE DATA WARNING**

This software is NOT intended for use with real patient data or in production healthcare environments. Users assume full responsibility for ensuring compliance with applicable healthcare regulations (HIPAA, GDPR, etc.) and data protection requirements.

## Contributing

This is an educational project. While contributions are welcome, please note:

1. This is a proof of concept, not a production system
2. Most code was AI-generated and may require human review
3. Any contributions should maintain the educational focus
4. All contributors must understand and agree to the license terms

## Support

This is an educational/demonstration project with limited support. Users are encouraged to:

1. Review and understand the code before use
2. Test thoroughly in their specific environment
3. Ensure compliance with relevant regulations
4. Seek professional advice for healthcare applications

---

**Remember: This is a Proof of Concept. Do not use with real patient data or in production healthcare environments.**
