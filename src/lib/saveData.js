import baseURL from "@/lib/config";
import axios from "axios";

export default async function saveData(collectionName, data, replace = false) {
  if (replace) data = [data];
  try {
    const res = await axios.post(
      baseURL() + "/api/data/save",
      { collectionName, data, replace },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Data saved:", res.data);
  } catch (err) {
    console.error("Failed to save data:", err);
  }
}
