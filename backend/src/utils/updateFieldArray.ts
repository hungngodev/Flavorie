export default function updateFieldArray(arr: any[], val: any) {
  let newArr = [...arr];
  const existed = newArr.some(element => element.equals(val));
  if (existed) {
    newArr = arr.filter(element => !element.equals(val));
  } else {
    newArr.push(val);
  }
  return newArr;
}
