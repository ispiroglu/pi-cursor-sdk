import type { CursorSdkModule } from "./cursor-sdk-runtime.js";
import { parseEnvBoolean } from "./cursor-env-boolean.js";

export const CURSOR_HTTP1_ENV = "PI_CURSOR_HTTP_1.1";

type EnvRecord = Record<string, string | undefined>;

function getRuntimeEnv(): EnvRecord {
	return (globalThis as { process?: { env?: EnvRecord } }).process?.env ?? {};
}

export function resolveCursorHttp1Enabled(
	env: EnvRecord = getRuntimeEnv(),
): boolean {
	return parseEnvBoolean(env[CURSOR_HTTP1_ENV], false);
}

export function configureCursorSdkHttp1(
	sdk: Pick<CursorSdkModule, "Cursor">,
	env: EnvRecord = getRuntimeEnv(),
): boolean {
	const enabled = resolveCursorHttp1Enabled(env);
	sdk.Cursor.configure({ local: { useHttp1ForAgent: enabled } });
	return enabled;
}
