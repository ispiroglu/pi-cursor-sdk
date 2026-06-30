import type { CursorSdkModule } from "./cursor-sdk-runtime.js";
import { parseEnvBoolean } from "./cursor-env-boolean.js";

export const CURSOR_HTTP1_ENV = "PI_CURSOR_HTTP_1_1";
export const CURSOR_HTTP1_ENTRY_TYPE = "cursor-http1-state";

type EnvRecord = Record<string, string | undefined>;

export interface CursorHttp1EntryData {
	enabled: boolean;
}

let globalCursorHttp1Enabled: boolean | undefined;
let sessionCursorHttp1Enabled: boolean | undefined;

function getRuntimeEnv(): EnvRecord {
	return (globalThis as { process?: { env?: EnvRecord } }).process?.env ?? {};
}

export function isCursorHttp1EntryData(
	value: unknown,
): value is CursorHttp1EntryData {
	return (
		typeof (value as CursorHttp1EntryData | undefined)?.enabled === "boolean"
	);
}

export function getGlobalCursorHttp1Enabled(): boolean | undefined {
	return globalCursorHttp1Enabled;
}

export function setGlobalCursorHttp1Enabled(
	enabled: boolean | undefined,
): void {
	globalCursorHttp1Enabled = enabled;
}

export function getStoredCursorHttp1Enabled(): boolean | undefined {
	return sessionCursorHttp1Enabled;
}

export function setStoredCursorHttp1Enabled(
	enabled: boolean | undefined,
): void {
	sessionCursorHttp1Enabled = enabled;
}

export function resolveCursorHttp1EnvDefault(
	env: EnvRecord = getRuntimeEnv(),
): boolean {
	return parseEnvBoolean(env[CURSOR_HTTP1_ENV], false);
}

export function resolveCursorHttp1Enabled(
	env: EnvRecord = getRuntimeEnv(),
): boolean {
	return (
		sessionCursorHttp1Enabled ??
		globalCursorHttp1Enabled ??
		resolveCursorHttp1EnvDefault(env)
	);
}

export function configureCursorSdkHttp1(
	sdk: Pick<CursorSdkModule, "Cursor">,
	env: EnvRecord = getRuntimeEnv(),
): boolean {
	const enabled = resolveCursorHttp1Enabled(env);
	sdk.Cursor.configure({ local: { useHttp1ForAgent: enabled } });
	return enabled;
}
