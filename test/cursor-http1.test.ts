import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CursorSdkModule } from "../src/cursor-sdk-runtime.js";
import {
	configureCursorSdkHttp1,
	CURSOR_HTTP1_ENV,
	resolveCursorHttp1Enabled,
	setStoredCursorHttp1Enabled,
} from "../src/cursor-http1.js";

describe("cursor HTTP/1.1 env support", () => {
	beforeEach(() => {
		setStoredCursorHttp1Enabled(undefined);
	});
	it("resolves PI_CURSOR_HTTP_1.1 using the shared env boolean convention", () => {
		expect(resolveCursorHttp1Enabled({})).toBe(false);
		expect(resolveCursorHttp1Enabled({ [CURSOR_HTTP1_ENV]: "true" })).toBe(
			true,
		);
		expect(resolveCursorHttp1Enabled({ [CURSOR_HTTP1_ENV]: "1" })).toBe(true);
		expect(resolveCursorHttp1Enabled({ [CURSOR_HTTP1_ENV]: "yes" })).toBe(true);
		expect(resolveCursorHttp1Enabled({ [CURSOR_HTTP1_ENV]: "on" })).toBe(true);
		expect(resolveCursorHttp1Enabled({ [CURSOR_HTTP1_ENV]: "false" })).toBe(
			false,
		);
		expect(resolveCursorHttp1Enabled({ [CURSOR_HTTP1_ENV]: "0" })).toBe(false);
		expect(resolveCursorHttp1Enabled({ [CURSOR_HTTP1_ENV]: "no" })).toBe(false);
		expect(resolveCursorHttp1Enabled({ [CURSOR_HTTP1_ENV]: "off" })).toBe(
			false,
		);
		expect(resolveCursorHttp1Enabled({ [CURSOR_HTTP1_ENV]: "wat" })).toBe(
			false,
		);
	});

	it("lets session state override the env default", () => {
		setStoredCursorHttp1Enabled(true);
		expect(resolveCursorHttp1Enabled({ [CURSOR_HTTP1_ENV]: "false" })).toBe(
			true,
		);

		setStoredCursorHttp1Enabled(false);
		expect(resolveCursorHttp1Enabled({ [CURSOR_HTTP1_ENV]: "true" })).toBe(
			false,
		);
	});

	it("configures the Cursor SDK local-agent HTTP/1.1/SSE transport when enabled", () => {
		const configure = vi.fn();
		const enabled = configureCursorSdkHttp1(
			{ Cursor: { configure } } as unknown as Pick<CursorSdkModule, "Cursor">,
			{ [CURSOR_HTTP1_ENV]: "true" },
		);

		expect(enabled).toBe(true);
		expect(configure).toHaveBeenCalledWith({
			local: { useHttp1ForAgent: true },
		});
	});

	it("explicitly configures the Cursor SDK default transport when disabled", () => {
		const configure = vi.fn();
		const enabled = configureCursorSdkHttp1(
			{ Cursor: { configure } } as unknown as Pick<CursorSdkModule, "Cursor">,
			{},
		);

		expect(enabled).toBe(false);
		expect(configure).toHaveBeenCalledWith({
			local: { useHttp1ForAgent: false },
		});
	});
});
