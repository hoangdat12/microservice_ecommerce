export const convertArrToKeyValuePair = ({ obj, offset = 0, limit = 20 }) => {
  let ids = [];
  console.log(obj);
  for (let key of Object.keys(obj)) {
    console.log(key);
    ids.push(key);
  }
  return ids;
};
