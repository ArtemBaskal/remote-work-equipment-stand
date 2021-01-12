export const generateQueryParam = (
  queryParamKey, queryParamValue,
) => new URLSearchParams({ [queryParamKey]: queryParamValue }).toString();
