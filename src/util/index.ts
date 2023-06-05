export { getNextNameFromNumberString };

function getNextNameFromNumberString(
  numStr: string,
  count?: number,
): string | string[] {
  const num = parseInt(numStr, 10);
  if (count) {
    let str = [];
    for (let i = 1; i <= count; i++) {
      str.push(String(num + i).padStart(numStr.length, '0'));
    }
    return str;
  } else {
    return String(num + 1).padStart(numStr.length, '0');
  }
}
