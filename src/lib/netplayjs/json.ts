export type JSONPrimitive = string | number | boolean | null;
export type JSONObject = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = { [member: string]: JSONObject };
export type JSONArray = Array<JSONObject>
