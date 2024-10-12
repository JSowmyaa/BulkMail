import React, { useState } from 'react';
import axios from 'axios'; // Don't forget to import axios
import './index.css';
import * as XLSX from "xlsx"

const App = () => {
  const [msg, setMsg] = useState(""); // This is correct
  const [status, setStatus] = useState(false); // Add this line with initializer
  const [emailList, setEmailList] = useState([]);

  function handleMsg(evt) {
    setMsg(evt.target.value); // Fixed casing here
  }

  function handleFile(event) {
    const xlfile = event.target.files[0];
    console.log(xlfile);

    const reader = new FileReader();
    reader.onload = function(event) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailListData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Use header: 1 for array of arrays
      const totalEmails = emailListData.map(item => item[0]); // Assuming emails are in the first column

      console.log("Total emails extracted:", totalEmails);
      setEmailList(totalEmails);
      console.log("Updated emailList state:", totalEmails);
    };

    reader.readAsBinaryString(xlfile);
  }

  function send() {
    setStatus(true)
    axios.post("http://localhost:5000/sendemail", { msg: msg, emailList: emailList })
      .then(function (data) {
        if (data.data === true) {
          alert("Email send Successfully")
          setStatus(false)
        }
        else {
          alert("Failed ")
        }
      })
  }

  return ( // Ensure return is here, inside the App function
    <div>
      <div className="bg-pink-800 text-white text-center">
        <h1 className="text-2xl font-medium px-5 py-3">BULKMAIL</h1>
      </div>

      <div className="bg-pink-700 text-white text-center">
        <h1 className="font-medium px-5 py-3">We can elevate your business by enabling the seamless dispatch of multiple emails at once.</h1>
      </div>

      <div className="bg-pink-600 text-white text-center">
        <h1 className="font-medium px-5 py-3">Drag and Drop</h1>
      </div>

      <div className="bg-pink-400 flex flex-col items-center text-black px-5 py-3">
        <textarea 
          onChange={handleMsg} // Use handleMsg (correct casing)
          value={msg} 
          className="w-[80%] h-32 py-2 px-2 outline-none border border-black rounded-md" 
          placeholder="Kindly compose your email message..."
        ></textarea>

        <div>
          <input 
            type="file" 
            onChange={handleFile} 
            className="border-4 border-dashed py-4 px-4 mt-10 mb-10" // Corrected property
          />
        </div>

        <p>Total number of emails in the file: {emailList.length}</p>

        <button 
          onClick={send} 
          className="bg-pink-900 mt-2 py-2 px-2 text-white font-medium rounded-md w-fit"
        >
          {status ? "Sending..." : "Send"}
        </button>
      </div>

      <div className="bg-pink-300 text-white text-center p-8">
        {/* Additional content can go here */}
      </div>

      <div className="bg-pink-200 text-white text-center p-8">
        {/* Additional content can go here */}
      </div>
    </div>
  );
};

export default App;
