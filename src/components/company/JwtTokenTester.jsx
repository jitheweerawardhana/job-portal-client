import React, { useState } from "react";

const JwtTokenTester = () => {
  const [tokenSource, setTokenSource] = useState("localStorage");
  const [tokenKey, setTokenKey] = useState("companyToken");
  const [manualToken, setManualToken] = useState("");
  const [endpoint, setEndpoint] = useState("/api/v1/applications/2/status");
  const [method, setMethod] = useState("PUT");
  const [queryParams, setQueryParams] = useState("status=REVIEWING");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    if (tokenSource === "manual") {
      return manualToken;
    } else {
      return localStorage.getItem(tokenKey);
    }
  };

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResponseData(null);

    try {
      const token = getToken();

      if (!token) {
        throw new Error("No token available");
      }

      // Log token details for debugging
      console.log("Using token:", token.substring(0, 20) + "...");

      // Build the URL
      const baseUrl = "http://localhost:8080";
      const url = `${baseUrl}${endpoint}${
        queryParams ? `?${queryParams}` : ""
      }`;

      console.log("Making request to:", url);
      console.log("Using method:", method);

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      // Try to parse response as JSON
      let responseText = "";
      try {
        responseText = await response.text();
        console.log("Response text:", responseText);

        if (responseText) {
          try {
            const jsonData = JSON.parse(responseText);
            setResponseData(jsonData);
          } catch (e) {
            setResponseData({ text: responseText });
          }
        }
      } catch (e) {
        console.error("Error reading response:", e);
      }

      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}: ${responseText}`
        );
      }
    } catch (err) {
      console.error("Test error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const decodeToken = () => {
    try {
      const token = getToken();
      if (!token) return null;

      const parts = token.split(".");
      if (parts.length !== 3)
        return { error: "Not a valid JWT token (should have 3 parts)" };

      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (e) {
      return { error: `Error decoding token: ${e.message}` };
    }
  };

  const tokenInfo = decodeToken();

  return (
    <div className="p-4 border rounded-md bg-gray-50 my-4">
      <h2 className="text-xl font-bold mb-4">JWT Token Tester</h2>

      <div className="mb-4">
        <label className="block mb-2">Token Source:</label>
        <div className="flex items-center space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="localStorage"
              checked={tokenSource === "localStorage"}
              onChange={() => setTokenSource("localStorage")}
              className="mr-2"
            />
            localStorage
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="manual"
              checked={tokenSource === "manual"}
              onChange={() => setTokenSource("manual")}
              className="mr-2"
            />
            Manual Input
          </label>
        </div>
      </div>

      {tokenSource === "localStorage" ? (
        <div className="mb-4">
          <label className="block mb-2">localStorage Key:</label>
          <input
            type="text"
            value={tokenKey}
            onChange={(e) => setTokenKey(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      ) : (
        <div className="mb-4">
          <label className="block mb-2">JWT Token:</label>
          <textarea
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2">Endpoint:</label>
        <input
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Method:</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Query Parameters:</label>
        <input
          type="text"
          value={queryParams}
          onChange={(e) => setQueryParams(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="param1=value1&param2=value2"
        />
      </div>

      <button
        onClick={handleTest}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? "Testing..." : "Test Endpoint"}
      </button>

      {tokenInfo && (
        <div className="mt-4 p-3 bg-white border rounded">
          <h3 className="font-bold mb-2">Token Information:</h3>
          {tokenInfo.error ? (
            <div className="text-red-500">{tokenInfo.error}</div>
          ) : (
            <div className="text-xs overflow-auto max-h-40">
              <pre>{JSON.stringify(tokenInfo, null, 2)}</pre>

              {tokenInfo.exp && (
                <div className="mt-2 font-semibold">
                  Expires: {new Date(tokenInfo.exp * 1000).toLocaleString()}(
                  {Date.now() > tokenInfo.exp * 1000 ? "EXPIRED" : "VALID"})
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          <h3 className="font-bold mb-1">Error:</h3>
          <div>{error}</div>
        </div>
      )}

      {responseData && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <h3 className="font-bold mb-1">Response:</h3>
          <div className="text-xs overflow-auto max-h-40">
            <pre>{JSON.stringify(responseData, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default JwtTokenTester;
