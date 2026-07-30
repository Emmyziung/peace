import { NextResponse } from "next/server";

const ACCESS_COOKIE = "site_access";
const ACCESS_COOKIE_VALUE = "roses-are-red-3456";
const SEVEN_DAYS_IN_SECONDS = 60 * 60 * 24 * 7;

type UnlockRequest = {
  passcode?: unknown;
};

export async function POST(request: Request) {
  let body: UnlockRequest;

  try {
    body = (await request.json()) as UnlockRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const passcode = body.passcode;
  const expectedPasscode = process.env.SITE_PASSCODE;

  if (!expectedPasscode) {
    return NextResponse.json(
      { error: "The site passcode has not been configured." },
      { status: 500 },
    );
  }

  if (typeof passcode !== "string" || passcode !== expectedPasscode) {
    return NextResponse.json({ error: "issshh... wrong password" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ACCESS_COOKIE,
    value: ACCESS_COOKIE_VALUE,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS_IN_SECONDS,
  });

  return response;
}
