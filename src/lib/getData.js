import baseURL from "@/lib/config";
import axios from "axios";

export default async function getData(collectionName) {
  try {
    const response = await axios.post(baseURL() + "/api/data/get", { collectionName }, { headers: { "Content-Type": "application/json" } });

    const result = response.data;

    if (Array.isArray(result.data) && result.data.length === 1) {
      return { ...result, data: result.data[0] };
    }

    return result;
  } catch (err) {
    console.error("Failed to fetch data:", err);
    return {
      success: false,
      error: "Error while fetching data",
      details: err.message,
    };
  }
}
