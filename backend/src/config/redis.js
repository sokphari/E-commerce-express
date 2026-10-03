const { createClient } = require("redis");
const env = require("./env");

let client;
let connectPromise;

function getRedisClient() {
  if (!client) {
    client = createClient({
      url: env.redis.url,
    });

    client.on("error", (error) => {
      if (env.nodeEnv !== "test") {
        console.warn(`Redis error: ${error.message}`);
      }
    });
  }

  if (!client.isOpen) {
    connectPromise ||= client.connect().finally(() => {
      connectPromise = null;
    });
  }

  return {
    client,
    ready: connectPromise || Promise.resolve(),
  };
}

async function closeRedisClient() {
  if (client?.isOpen) {
    await client.quit();
  }
}

module.exports = {
  getRedisClient,
  closeRedisClient,
};
