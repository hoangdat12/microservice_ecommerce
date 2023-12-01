export const convertArrToKeyValuePair = ({ arr, offset = 0, limit = 20 }) => {
  let ids = [];
  let productKV = new Map();
  for (let i = offset * 2; i < limit * 2; i += 2) {
    ids.push(arr[i]);
    productKV.set(arr[i], arr[i + 1]);
  }

  return { ids, productKV };
};
