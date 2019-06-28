import { with_scanner } from "./expression-scanner.mjs";

export const read = code =>
  with_scanner(new Function("world", `with (world) { ${code} }`));
