export const isNotNullish = (
  data: unknown
): data is Record<string, unknown> => {
  return data != null;
};
