import { getConfigPaths } from "../info.ts";

export async function get(): Promise<string | null> {
  const { credentialsPath } = getConfigPaths();
  try {
    const token = JSON.parse(await Deno.readTextFile(credentialsPath)).token;
    return token || null;
  } catch (_) {
    if (e instanceof Deno.errors.NotFound) {
      return null;
    }
    throw new Error(
      `The credentials file has been tampered with and will be ignored. Please delete it.`,
    );
  }
}

export async function store(token: string): Promise<void> {
  const { credentialsPath, configDir } = getConfigPaths();
  await Deno.mkdir(configDir, { recursive: true });
  await Deno.writeTextFile(
    credentialsPath,
    JSON.stringify({ token }, null, 2),
    { mode: 0o600 },
  );
  return Promise.resolve();
}

export async function remove(): Promise<void> {
  const { credentialsPath, configDir } = getConfigPaths();
  await Deno.mkdir(configDir, { recursive: true });
  await Deno.writeTextFile(credentialsPath, "{}", { mode: 0o600 });
  return Promise.resolve();
}
