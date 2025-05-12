import React, { useState } from "react";
import "./OvertimeForm.css";

const OvertimeForm = () => {
  const [formData, setFormData] = useState({
    paMinDuration: "",
    paMaxDuration: "",
    ot1MinDuration: "",
    ot1MaxDuration: "",
    ot2MaxDuration: "",
    excludedPaycodes: "",
  });
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload an .xlsx file");
      return;
    }

    setIsLoading(true);

    const queryParams = new URLSearchParams({
      paMinDuration: formData.paMinDuration,
      paMaxDuration: formData.paMaxDuration,
      ot1MinDuration: formData.ot1MinDuration,
      ot1MaxDuration: formData.ot1MaxDuration,
      ot2MinDuration: formData.ot2MaxDuration,
      excludedPaycodes: formData.excludedPaycodes,
    }).toString();

    const formDataToSend = new FormData();
    formDataToSend.append("file", file);

    try {
      const response = await fetch(
        `http://localhost:8080/api/attendance/upload?${queryParams}`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "processed_overtime.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      alert("File processed and downloaded successfully");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to process file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      paMinDuration: "",
      paMaxDuration: "",
      ot1MinDuration: "",
      ot1MaxDuration: "",
      ot2MaxDuration: "",
      excludedPaycodes: "",
    });
    setFile(null);
    document.getElementById("fileInput").value = null;
  };

  return (
    <div className="form-container">
      <h1>Overtime Management System</h1>
      {isLoading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Processing...</p>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Present Duration Minimum Threshold</label>
          <input
            type="number"
            step="0.01"
            name="paMinDuration"
            value={formData.paMinDuration}
            onChange={handleInputChange}
            placeholder="e.g., 4.0"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label>Present Duration Maximum Threshold</label>
          <input
            type="number"
            step="0.01"
            name="paMaxDuration"
            value={formData.paMaxDuration}
            onChange={handleInputChange}
            placeholder="e.g., 8.0"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label>Overtime 1hr Minimum Threshold</label>
          <input
            type="number"
            step="0.01"
            name="ot1MinDuration"
            value={formData.ot1MinDuration}
            onChange={handleInputChange}
            placeholder="e.g., 10.45"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label>Overtime 1hr Maximum Threshold</label>
          <input
            type="number"
            step="0.01"
            name="ot1MaxDuration"
            value={formData.ot1MaxDuration}
            onChange={handleInputChange}
            placeholder="e.g., 11.14"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label>Overtime 2hr Maximum Threshold</label>
          <input
            type="number"
            step="0.01"
            name="ot2MaxDuration"
            value={formData.ot2MaxDuration}
            onChange={handleInputChange}
            placeholder="e.g., 11.15"
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label>Exclude PayCode (comma-separated)</label>
          <input
            type="text"
            name="excludedPaycodes"
            value={formData.excludedPaycodes}
            onChange={handleInputChange}
            placeholder="e.g., DDD,EEE"
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label>Upload .xlsx File</label>
          <input
            type="file"
            id="fileInput"
            accept=".xlsx"
            onChange={handleFileChange}
            required
            disabled={isLoading}
          />
        </div>
        <div className="button-group">
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : "Submit"}
          </button>
          <button type="button" onClick={handleReset} disabled={isLoading}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default OvertimeForm;
