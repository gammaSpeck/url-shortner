import { api, APIError } from "encore.dev/api";
import { randomBytes } from "node:crypto";
import { db } from "./db";
import log from "encore.dev/log";

type URL = {
  /** Short-form URL id */
  id: string;
  /** Complete URL, in long form */
  url: string;
};
type ShortenParams = {
  /** The URL to be shortened */
  url: string; // the URL to shorten
};

/** Takes in a URL and give you a shortened URL */
export const shorten = api(
  { method: "POST", path: "/url", expose: true },
  async ({ url }: ShortenParams): Promise<URL> => {
    const id = randomBytes(6).toString("base64url");
    log.debug("Conn String", db.connectionString);
    await db.exec`
      INSERT INTO url (id, original_url)
      VALUES (${id}, ${url})
    `;
    return { id, url };
  }
);

/** Get URL info by shortened url id */
export const get = api(
  { method: "GET", path: "/url/:id", expose: true },
  async ({ id }: { id: string }): Promise<URL> => {
    const row = await db.queryRow`
        SELECT original_url FROM url WHERE id = ${id}
      `;
    if (!row) throw APIError.notFound("url not found");
    return { id, url: row.original_url };
  }
);
