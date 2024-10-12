const fileinput = document.getElementById("fileInput");

fileinput.addEventListener("change", function(event) {
    const xlfile = event.target.files[0];

    if (!xlfile) {
        console.error("No file selected.");
        return;
    }

   
    if (xlfile.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        console.error("Please upload a valid Excel file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: "binary" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).map(row => row[0]);

        console.log("Extracted Emails:", emailList);
    };

    reader.onerror = function(error) {
        console.error("Error reading file:", error);
    };

    reader.readAsBinaryString(xlfile);
});
