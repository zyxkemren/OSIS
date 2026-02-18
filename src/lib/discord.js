import axios from "axios";
import baseURL from "@/lib/config";
import dynamic from "next/dynamic";

export async function discordWebhook({
  webhookURL,
  title,
  desc,
  color,
  footer = "",
  timestamp = new Date().toISOString(),
  username,
  avatar,
  user = ".anjay",
}) {
  if (!webhookURL) {
    throw new Error("Webhook URL is required!");
  }

  const playerRegex = /^[a-zA-Z0-9_]{3,16}$/;
  let mcAvatar = "https://cravatar.eu/avatar/steve/64.png";

  try {
    if (playerRegex.test(user)) mcAvatar = `https://cravatar.eu/avatar/${user}/64.png`;

    let payload = {
      username,
      avatar_url: avatar,
      embeds: [
        {
          title: title,
          description: desc,
          color: color,
          footer: footer ? { text: footer } : undefined,
          timestamp: timestamp,
        },
      ],
    };

    if (desc?.includes("{avatar}")) {
      desc = desc.replace(/\{avatar\}/g, ""); 
      payload.embeds[0].description = desc; 
      payload.embeds[0].thumbnail = {
        url: mcAvatar,
        dynamic: true,
      }
    }

    const response = await axios.post(webhookURL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Failed to send webhook:", error);
    return { success: false, error: error.message };
  }
}

export async function sendDiscordMessage({ channelId, content, token, isEmbed = false, user = ".anjay" }) {
  const playerRegex = /^[a-zA-Z0-9_]{3,16}$/;
  let mcAvatar = "https://cravatar.eu/avatar/steve/64.png";
  content.timestamp = new Date().toISOString();

  try {
    if (playerRegex.test(user)) mcAvatar = `https://cravatar.eu/avatar/${user}/64.png`;

    if (content.description?.includes("{avatar}")) {
      content.description = content.description.replace(/\{avatar\}/g, "");
      content.thumbnail = {
        url: mcAvatar,
        dynamic: true
      }
    }

    const response = await axios.post(
      baseURL() + "/api/discord",
      { channelId, content, token, isEmbed },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("Message sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending Discord message:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || "Failed to send message");
  }
}
