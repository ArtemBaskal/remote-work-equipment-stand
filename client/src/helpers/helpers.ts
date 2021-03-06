export const generateQueryParam = (
  queryParamKey: string, queryParamValue: string,
) => new URLSearchParams({ [queryParamKey]: queryParamValue }).toString();
