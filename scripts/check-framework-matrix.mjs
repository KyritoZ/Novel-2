import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function major(v) {
  if (!v) return null;
  const m = String(v).match(/(\d+)\./);
  return m ? Number(m[1]) : null;
}

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"));
const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

const nextV = deps.next;
const eslintNextV = deps["eslint-config-next"];
const reactV = deps.react;
const reactDomV = deps["react-dom"];

const nextMaj = major(nextV);
const reactMaj = major(reactV);
const reactDomMaj = major(reactDomV);

const usesAppRouter =
  fs.existsSync(path.join(__dirname, "..", "src", "app")) ||
  fs.existsSync(path.join(__dirname, "..", "app"));

const errors = [];

if (nextV && eslintNextV && eslintNextV !== nextV) {
  errors.push(`eslint-config-next (${eslintNextV}) must exactly match next (${nextV}).`);
}

if (usesAppRouter && nextMaj !== null && nextMaj >= 15) {
  if (reactMaj === null || reactMaj < 19) errors.push(`App Router + Next ${nextV} requires react 19+, got ${reactV}.`);
  if (reactDomMaj === null || reactDomMaj < 19) errors.push(`App Router + Next ${nextV} requires react-dom 19+, got ${reactDomV}.`);
}

if (errors.length) {
  console.error("\nDependency matrix check failed:\n- " + errors.join("\n- ") + "\n");
  process.exit(1);
}
console.log("Dependency matrix check passed.");

