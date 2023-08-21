import path from "path";
import fs from "fs";

export function workspaceRoot(): string {
  const root = findGitRoot();
  if (root === null) {
    throw new Error("Could not find git root");
  }
  return root;
}

export function workspacePath(suffix: string): string {
  return path.join(workspaceRoot(), suffix);
}

function findGitRoot(start?: string): string | null {
  start = path.resolve(start || process.cwd());

  const chunks = start.split(path.sep);
  for (let i = chunks.length - 1; i >= 0; --i) {
    const dir = path.join(...chunks.slice(0, i));
    const fullPath = path.resolve("/", path.join(dir, ".git"));
    if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory()) {
      return path.dirname(fullPath);
    }
  }
  return null;
}

export const getEnv = (name: string): string => {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
};

export function getWebDomainName(stage: string): string {
  switch (stage) {
    case "production":
      return "";
    case "staging":
      return "";
    case "devel":
      return "";
    default:
      throw new Error(`Unknown stage ${stage}`);
  }
}
