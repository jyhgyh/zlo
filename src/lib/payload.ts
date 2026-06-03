import { getPayload } from "payload";
import config from "@payload-config";


export async function getPayloadClient() {
  const payload = await getPayload({
    config,
  });

  return payload;
}
