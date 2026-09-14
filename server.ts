import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import mqtt from "mqtt";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Enable CORS for frontend deployment flexibility
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const AIO_USERNAME = process.env.ADAFRUIT_IO_USERNAME || "kumarswamynaidu09";

const AIO_KEY = process.env.ADAFRUIT_IO_KEY;

// Cache the latest received status payloads for each feed
const isAioConfigured = !!AIO_KEY && AIO_KEY.trim() !== "";
const feedCache: Record<string, string> = isAioConfigured ? {
  "device-status": "OFFLINE", // Starts offline, waiting for actual Pico heartbeat
  "player-status": "",
  "music-library": "",
  "playlist-control": "",
  "schedule-status": ""
} : {
  "device-status": "ONLINE", 
  "player-status": "PAUSED|1|20|SHUFFLE_OFF|REPEAT_OFF", 
  "music-library": "", 
  "playlist-control": "",
  "schedule-status": "SCHEDULER|ON|NEXT|06:30|Pratah Morning Aarti"
};

// Simulation State (used when AIO is not configured or disconnected)
let simState = {
  isPlaying: false,
  currentTrackId: 1,
  volume: 20,
  isShuffle: false,
  isRepeat: false,
  isSchedulerOn: true
};

// Connect to Adafruit IO MQTT broker if key is available
let mqttClient: mqtt.MqttClient | null = null;
let sseClients: any[] = [];

function broadcastToClients(feed: string, payload: string) {
  const dataStr = JSON.stringify({ feed, payload });
  sseClients.forEach((client) => {
    try {
      client.write(`data: ${dataStr}\n\n`);
    } catch (e) {
      // client connection might be closed
    }
  });
}

if (AIO_KEY && AIO_KEY.trim() !== "") {
  console.log(`[MQTT] Connecting to Adafruit IO for user: ${AIO_USERNAME}...`);
  try {
    mqttClient = mqtt.connect("mqtts://io.adafruit.com", {
      username: AIO_USERNAME,
      password: AIO_KEY,
      port: 8883,
      reconnectPeriod: 5000,
    });

    mqttClient.on("connect", () => {
      console.log("[MQTT] Connected to Adafruit IO MQTT Broker!");

      // Subscribe to all 8 feeds
      const feeds = [
        "music-control",
        "music-volume",
        "device-status",
        "player-status",
        "music-library",
        "playlist-control",
        "schedule-control",
        "schedule-status",
      ];

      feeds.forEach((feed) => {
        const topic = `${AIO_USERNAME}/feeds/${feed}`;
        mqttClient?.subscribe(topic, (err) => {
          if (err) {
            console.error(`[MQTT] Failed to subscribe to ${topic}:`, err);
          } else {
            console.log(`[MQTT] Subscribed to topic: ${topic}`);
          }
        });
      });
    });

    mqttClient.on("message", (topic, message) => {
      const payload = message.toString().trim();
      const parts = topic.split("/");
      const feedKey = parts[parts.length - 1];

      console.log(`[MQTT Message] ${feedKey} => ${payload}`);
      feedCache[feedKey] = payload;
      broadcastToClients(feedKey, payload);
    });

    mqttClient.on("error", (err) => {
      console.error("[MQTT Error]", err);
    });

    mqttClient.on("close", () => {
      console.warn("[MQTT] Connection closed.");
      broadcastToClients("device-status", "OFFLINE");
      feedCache["device-status"] = "OFFLINE";
    });
  } catch (error) {
    console.error("[MQTT Connect Error]", error);
  }
} else {
  console.warn(
    "[MQTT] ADAFRUIT_IO_KEY is not defined in .env. Falling back to simulated Pico mode."
  );

  // Simulate Pico booting up and publishing the SD card music library after 2.5 seconds
  setTimeout(() => {
    const mockPayload = [
      "1|Sukhkarta Dukhharta",
      "2|Ganesh Aarti",
      "3|Shendur Lal Chadhayo",
      "4|Vakratunda Mahakaya",
      "5|Deva Shree Ganesha",
      "6|Ganpati Bappa Morya",
      "7|Jai Ganesh Deva",
      "8|Gajanana Shri Ganraya",
      "9|Ekadantaya Vakratundaya",
      "10|Om Gan Ganapataye Namo Namah"
    ].join("\n");

    feedCache["music-library"] = mockPayload;
    broadcastToClients("music-library", mockPayload);
    console.log("[Simulation] Pico published dynamic SD card music-library payload!");
  }, 2500);
}

// REST API Endpoints
app.use(express.json());

// Server-Sent Events Endpoint
app.get("/api/status-stream", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });
  res.write("\n");

  // Add client to active connection pool
  sseClients.push(res);

  // Send initial cached state
  Object.keys(feedCache).forEach((feedKey) => {
    const cachedPayload = feedCache[feedKey];
    if (cachedPayload) {
      res.write(`data: ${JSON.stringify({ feed: feedKey, payload: cachedPayload })}\n\n`);
    }
  });

  req.on("close", () => {
    sseClients = sseClients.filter((client) => client !== res);
  });
});

// Publish command endpoint
app.post("/api/command", (req, res) => {
  const { feed, payload } = req.body;
  if (!feed || payload === undefined) {
    return res.status(400).json({ error: "Missing feed or payload parameter" });
  }

  const topic = `${AIO_USERNAME}/feeds/${feed}`;
  const payloadStr = String(payload).trim();

  // If MQTT is connected, publish to Adafruit IO
  if (mqttClient && mqttClient.connected) {
    console.log(`[MQTT Publishing] Topic: ${topic} | Payload: ${payloadStr} (QoS 1)`);
    mqttClient.publish(topic, payloadStr, { qos: 1 }, (err) => {
      if (err) {
        console.error(`[MQTT Publish Error] Failed to publish to ${topic} (Payload: ${payloadStr}):`, err);
        return res.status(500).json({ error: "Failed to publish to Adafruit IO", details: err.message });
      }
      console.log(`[MQTT Publish Success] Delivered to Adafruit IO: ${topic} => ${payloadStr}`);
      return res.json({ success: true, mode: "real", status: "published" });
    });
  } else {
    // Local Interactive Pico Simulation Mode
    console.log(`[Simulating MQTT Publish] Feed: ${feed} => Payload: ${payloadStr}`);
    feedCache[feed] = payloadStr;

    // Simulate behavior of Pico reacting to commands
    setTimeout(() => {
      if (feed === "music-control") {
        if (payloadStr === "PLAY") {
          simState.isPlaying = true;
        } else if (payloadStr === "PAUSE") {
          simState.isPlaying = false;
        } else if (payloadStr === "NEXT") {
          simState.currentTrackId = (simState.currentTrackId % 18) + 1;
          simState.isPlaying = true;
        } else if (payloadStr === "PREV") {
          simState.currentTrackId = simState.currentTrackId === 1 ? 18 : simState.currentTrackId - 1;
          simState.isPlaying = true;
        } else if (payloadStr === "SHUFFLE_ON") {
          simState.isShuffle = true;
        } else if (payloadStr === "SHUFFLE_OFF") {
          simState.isShuffle = false;
        } else if (payloadStr === "REPEAT_ON") {
          simState.isRepeat = true;
        } else if (payloadStr === "REPEAT_OFF") {
          simState.isRepeat = false;
        } else if (payloadStr.startsWith("TRACK:")) {
          const trackNum = parseInt(payloadStr.split(":")[1], 10);
          if (!isNaN(trackNum)) {
            simState.currentTrackId = trackNum;
            simState.isPlaying = true;
          }
        }

        const stateStr = simState.isPlaying ? "PLAYING" : "PAUSED";
        const shuffleStr = simState.isShuffle ? "SHUFFLE_ON" : "SHUFFLE_OFF";
        const repeatStr = simState.isRepeat ? "REPEAT_ON" : "REPEAT_OFF";
        const newPlayerStatus = `${stateStr}|${simState.currentTrackId}|${simState.volume}|${shuffleStr}|${repeatStr}`;
        
        feedCache["player-status"] = newPlayerStatus;
        broadcastToClients("player-status", newPlayerStatus);

      } else if (feed === "music-volume") {
        const volumeNum = parseInt(payloadStr, 10);
        if (!isNaN(volumeNum)) {
          simState.volume = Math.max(0, Math.min(30, volumeNum));
        }

        const stateStr = simState.isPlaying ? "PLAYING" : "PAUSED";
        const shuffleStr = simState.isShuffle ? "SHUFFLE_ON" : "SHUFFLE_OFF";
        const repeatStr = simState.isRepeat ? "REPEAT_ON" : "REPEAT_OFF";
        const newPlayerStatus = `${stateStr}|${simState.currentTrackId}|${simState.volume}|${shuffleStr}|${repeatStr}`;
        
        feedCache["player-status"] = newPlayerStatus;
        broadcastToClients("player-status", newPlayerStatus);
      } else if (feed === "schedule-control") {
        if (payloadStr.startsWith("SCHEDULE_SET:")) {
          const parts = payloadStr.split(":");
          if (parts[1]) {
            const args = parts[1].split(",");
            const name = args[1] || "Schedule";
            const hh = args[2] || "06";
            const mm = args[3] || "30";
            const nextSched = `SCHEDULER|ON|NEXT|${hh}:${mm}|${name}`;
            feedCache["schedule-status"] = nextSched;
            broadcastToClients("schedule-status", nextSched);
          }
        } else if (payloadStr.startsWith("SCHEDULE_DELETE:")) {
          const nextSched = `SCHEDULER|ON|NEXT|--:--|No Schedule`;
          feedCache["schedule-status"] = nextSched;
          broadcastToClients("schedule-status", nextSched);
        }
      }

      // Sync the published control feed to client so it has exact command ack
      broadcastToClients(feed, payloadStr);
    }, 150);

    return res.json({ success: true, mode: "simulated", status: "simulated_ack" });
  }
});

// Rescan SD card endpoint
app.post("/api/rescan", (req, res) => {
  const topic = `${AIO_USERNAME}/feeds/music-control`;
  
  if (mqttClient && mqttClient.connected) {
    mqttClient.publish(topic, "RESCAN", { qos: 0 }, (err) => {
      if (err) {
        console.error("[MQTT Publish Error] Failed to publish RESCAN to music-control:", err);
        return res.status(500).json({ error: "Failed to publish RESCAN command" });
      }
      return res.json({ success: true, mode: "real", status: "rescan_published" });
    });
  } else {
    // Simulated Rescan Behavior
    console.log("[Simulating Rescan] Sending updated music library payload after 1 second...");
    setTimeout(() => {
      const mockPayload = [
        "1|Sukhkarta Dukhharta",
        "2|Ganesh Aarti",
        "3|Shendur Lal Chadhayo",
        "4|Vakratunda Mahakaya",
        "5|Deva Shree Ganesha",
        "6|Ganpati Bappa Morya",
        "7|Jai Ganesh Deva",
        "8|Gajanana Shri Ganraya",
        "9|Ekadantaya Vakratundaya",
        "10|Om Gan Ganapataye Namo Namah"
      ].join("\n");
      
      feedCache["music-library"] = mockPayload;
      broadcastToClients("music-library", mockPayload);
    }, 1000);
    return res.json({ success: true, mode: "simulated", status: "simulated_rescan_ack" });
  }
});

// App configuration and connection status endpoint
app.get("/api/config", (req, res) => {
  res.json({
    aioUsername: AIO_USERNAME,
    isMqttConfigured: !!AIO_KEY && AIO_KEY.trim() !== "",
    isMqttConnected: mqttClient ? mqttClient.connected : false,
  });
});

// Healthcheck endpoint for Railway / Cloud monitoring
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Serve frontend assets or fallback gracefully
async function startServer() {
  const distPath = path.join(process.cwd(), "dist");
  const hasDist = fs.existsSync(path.join(distPath, "index.html"));

  if (process.env.NODE_ENV === "production" || hasDist) {
    console.log(`[Server] Serving production static assets from ${distPath}`);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    try {
      console.log("[Server] Initializing Vite middleware for development...");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (err) {
      console.error("[Server Warning] Failed to initialize Vite middleware:", err);
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Ekadantha application running on port ${PORT}`);
  });
}

startServer();

