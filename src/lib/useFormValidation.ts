export default function (rules: { condition: boolean; text: string }[]) {
  for (const rule of rules) {
    if (!rule.condition) {
      return false;
    }
  }
  return true;
}
