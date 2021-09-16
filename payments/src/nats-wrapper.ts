import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Cannot acces NATS client before connect");
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    this._client.on("close", () => {
      console.log("NATS connection closed");
      process.exit();
    });
    process.on("SIGINT", () => this.client.close());
    process.on("SIGTERM", () => this.client.close());

    return new Promise<void>((res, rej) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS successfully");
        res();
      });

      this.client.on("error", (err) => {
        console.log("Error trying connect to TO NATS");
        rej(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
