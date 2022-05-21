import { JSONObject, JSONObject } from "./json";

export function serialize(data: any): JSONObject {
  return JSON.parse(JSON.stringify(data)) as JSONObject;
}

export function deserialize(source: JSONObject, dest: Record<string, any>): void {
  // Deep copy hack.
  const copy = JSON.parse(JSON.stringify(source));

  // Copy values into source.
  for (const [key, value] of Object.entries(copy)) {
    dest[key] = copy[key];
  }
}
