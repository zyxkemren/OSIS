import baseURL from "@/lib/config";
import axios from "axios";

export async function delImage(bucketName, folder, image) {
  try {
    await axios.post(
      baseURL() + "/api/data/delete-image",
      { bucketName, folder, image },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: e };
  }
}
