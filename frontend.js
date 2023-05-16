// Function to convert XLSX to JSON
function convertXLSXToJSON(workbook) {
  const sheetName = workbook.SheetNames[0]; // Assuming the first sheet
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  return jsonData;
}

// Function to handle file conversion and download
function handleFileConversion() {
  const fileUpload = document.getElementById("file-upload");
  const file = fileUpload.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const jsonData = convertXLSXToJSON(workbook);
      downloadJSON(jsonData);
    };

    reader.readAsBinaryString(file);
  }
}

// Function to trigger download of the JSON file
function downloadJSON(jsonData) {
  var newJson = jsonData[0];
  var currKey = "";
  jsonData.forEach((row) => {
    if (!row.definition) {
      currKey = row["key term"];
    } else {
      if (!newJson[currKey]) {
        newJson[currKey] = [];
      }
      newJson[currKey].push(row);
    }
  });

  const blob = new Blob([JSON.stringify(newJson)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "converted.json";
  link.click();

  URL.revokeObjectURL(url);
}

// Call the handleFileConversion function when the Convert button is clicked
document
  .getElementById("convert-btn")
  .addEventListener("click", handleFileConversion);
