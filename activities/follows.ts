import { MaybeRefOrGetter, toValue, type Ref } from "vue";
import {
  useGraffiti,
  useGraffitiSession,
  useQuery,
  type GraffitiObject,
} from "@graffiti-garden/client-vue";

export interface Follow extends GraffitiObject {
  value: {
    type: "Follow";
    object: string;
    actor?: string;
  };
}

export async function putFollow(object: string) {
  const myWebId = useGraffitiSession().webId;
  return useGraffiti().put({
    value: {
      type: "Follow",
      object,
      actor: myWebId,
    },
    channels: [myWebId!],
  });
}

export function useFollows(
  actor: MaybeRefOrGetter<string>,
  object?: MaybeRefOrGetter<string>,
) {
  const values = useQuery(() => [toValue(actor)], {
    query: () => ({
      properties: {
        value: {
          properties: {
            type: { enum: ["Follow"] },
            object: toValue(object)
              ? { enum: [toValue(object)] }
              : { type: "string" },
            actor: { enum: [toValue(actor)] },
          },
          required: ["type", "object"],
        },
        webId: { enum: [toValue(actor)] },
      },
    }),
  });

  const results = values.results;
  return {
    ...values,
    results: results as Ref<Follow[]>,
  };
}
