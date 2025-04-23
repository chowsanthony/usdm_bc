# Extract BC used by SoA from USDM JSON

This script extracts biomedical concepts (BCs) from Unified Study Data Model (USDM) JSON data and maps them to study design activities using JSONata expressions.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher recommended)
- npm (comes with Node.js)

## Installation

Install the required dependencies by running:

```
npm install jsonata
```

## Usage
1. Place a USDM JSON file in the project directory and name it sdw-lzzt-usdm.json (or update the file path in usdm-to-tdm.js).

1. Run the script using Node.js:

```
node usdm_bc.js -f <filepath to USDM JSON file>
```

1. The script will process the USDM JSON file and output the converted SDTM TDM dataset to the console and as CSV.

## How It Works
- The script uses JSONata to extract and transform data from the USDM JSON file.
- It maps `activities` to their associated biomedical concepts (BCs).
- Each BC includes details such as:
  - Concept name
  - Type (e.g., Dataset Specialization, Biomedical Concept)
  - Standard code and decode
  - Data elements and their data types

## Example Output
The output will look like this:

```
[
  {
    "activityId": "Activity_24",
    "activityName": "Hemoglobin A1C",
    "bc": [
      {
        "usdmBcId": "BiomedicalConcept_32",
        "concept": "Hemoglobin A1C Concentration in Blood",
        "bcId": "C64849",
        "bcShortname": "HBA1C",
        "bcType": "Dataset Specialization",
        "dataElements": "LBTESTCD, LBORRES, LBORRESU, LBSPEC, LBFAST",
        "dataTypes": "null, float, null, null, null"
      },
      ...
    ]
  },
  ...
]
```

## Notes
The file `sdw-lzzt-usdm.json` contains the study definition for the CDISC Pilot Study in the USDM v3.6 format. It was created using the Study Definitions Workbench from D4K. Website: [Study Definitions Workbench](https://d4k-sdw.fly.dev/)