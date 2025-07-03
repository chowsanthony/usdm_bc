const fs = require('fs');
const jsonata = require("jsonata");

// Parse command-line arguments
const args = process.argv.slice(2);
const fileIndex = args.indexOf('-f');
if (fileIndex === -1 || !args[fileIndex + 1]) {
    console.error('Usage: node usdm_bc.js -f <filepath to USDM JSON file>');
    process.exit(1);
}
const filePath = args[fileIndex + 1];

// Read and parse the JSON file
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

/**
 * Function to evaluate a JSONata expression and output the result to a JSON file
 * @param {string} expression - The JSONata expression
 * @param {string} fileName - The name of the output file
 * @param {object} inputUsdm - The input USDM JSON data
 */
async function generateOutput(expression, fileName, inputUsdm) {
    try {
        const jsonataExpr = jsonata(expression);
        jsonataExpr.assign("studyVersionId", "2"); // Assign studyVersionId dynamically if needed
        const result = await jsonataExpr.evaluate(inputUsdm);

        console.log(result);

        // Write JSON to file
        const outputFileName = `${fileName}.json`;
        fs.writeFileSync(outputFileName, JSON.stringify(result, null, 2), 'utf-8');
        console.log(`Output written to ${outputFileName}`);
    } catch (error) {
        console.error(`Error generating ${fileName}:`, error);
    }
}

// Define extraction expressions for biomedical concepts within each study design activity
const extractSoaBc = `
    (
        $forceArray := function($v) {
            $type($v) = "array" ? $v : [$v]
        };
        $a := study.versions[].studyDesigns[].activities[].{
            "id": id,
            "name": name,
            "biomedicalConceptIds": biomedicalConceptIds
        };
        $b := study.versions[].**.biomedicalConcepts[].{
            "id": id,
            "concept": name,
            "type": reference ? (
                $contains(reference, "datasetspecializations") ? "Dataset Specialization" :
                $contains(reference, "biomedicalconcepts") ? "Biomedical Concept"
            ) : "Undefined",
            "code": code.standardCode.code,
            "decode": code.standardCode.decode,
            "dataElements": properties.name~>$join(", "),
            "dataTypes": properties.datatype.( $ = "" or $ = null ? "null" : $ )~>$join(", ")
        };

        $a.{
            "activityId": id,
            "activityName": name,
            "bc": $forceArray(
                $map(biomedicalConceptIds, function($id){
                    $b[id = $id].{
                        "usdmBcId": id,
                        "concept": concept,
                        "bcId": code,
                        "bcShortname": decode,
                        "bcType": type,
                        "dataElements": dataElements,
                        "dataTypes": dataTypes
                    }
                })
            )
        }
    )
`;

// Generate output
generateOutput(extractSoaBc, "usdm_bc", data);