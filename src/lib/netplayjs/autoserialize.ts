import { JSONValue } from "./json";

export function serialize(data: any): JSONValue {
  return JSON.parse(JSON.stringify(data)) as JSONValue;
}

export function deserialize(source: JSONValue, dest: Record<string, any>): void {
  // Deep copy hack.
  const copy = JSON.parse(JSON.stringify(source));

  // Copy values into source.
  for (const [key, value] of Object.entries(copy)) {
    dest[key] = copy[key];
  }
}
