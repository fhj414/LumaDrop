import crypto from "crypto";
import dns from "node:dns";
import { Agent } from "undici";

dns.setDefaultResultOrder("ipv4first");

const ipv4Dispatcher = new Agent({
  connect: { family: 4 }
});

export async function sendSmsCode(phone: string, code: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_PHONE;

  if (!sid || !token || !from) {
    throw new Error("SMS provider is not configured.");
  }

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      To: phone,
      From: from,
      Body: `Your LumaDrop verification code is ${code}. It expires in 5 minutes.`
    })
  });

  if (!response.ok) {
    throw new Error(`SMS provider failed: ${await response.text()}`);
  }
  return { sent: true };
}

export async function sendEmailCode(email: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "LumaDrop <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("Email provider is not configured.");
  }

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      dispatcher: ipv4Dispatcher,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: email,
        subject: "Your LumaDrop verification code",
        text: `Your LumaDrop verification code is ${code}. It expires in 5 minutes.`
      })
    });
  } catch (error) {
    const err = error as unknown as { message?: string; cause?: unknown; code?: string };
    const causeMessage =
      typeof err.cause === "object" && err.cause && "message" in (err.cause as any)
        ? String((err.cause as any).message)
        : err.cause
        ? String(err.cause)
        : "";
    const parts = [err.message ?? "fetch failed", err.code ? `(code: ${err.code})` : "", causeMessage ? `(cause: ${causeMessage})` : ""]
      .filter(Boolean)
      .join(" ");
    throw new Error(`Email provider network error: ${parts}`);
  }

  if (!response.ok) {
    throw new Error(`Email provider failed: ${await response.text()}`);
  }
  return { sent: true };
}

export function createWechatAuthUrl() {
  const appId = process.env.WECHAT_OPEN_APP_ID;
  const redirectUri = process.env.WECHAT_REDIRECT_URI;
  if (!appId || !redirectUri) {
    return null;
  }
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    appid: appId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "snsapi_login",
    state
  });
  return `https://open.weixin.qq.com/connect/qrconnect?${params.toString()}#wechat_redirect`;
}

export async function exchangeWechatCode(code: string) {
  const appId = process.env.WECHAT_OPEN_APP_ID;
  const appSecret = process.env.WECHAT_OPEN_APP_SECRET;
  if (!appId || !appSecret) {
    throw new Error("WeChat Open Platform secret is not configured.");
  }

  const tokenParams = new URLSearchParams({
    appid: appId,
    secret: appSecret,
    code,
    grant_type: "authorization_code"
  });
  const tokenResponse = await fetch(`https://api.weixin.qq.com/sns/oauth2/access_token?${tokenParams.toString()}`);
  const tokenPayload = await tokenResponse.json();
  if (!tokenResponse.ok || tokenPayload.errcode) {
    throw new Error(tokenPayload.errmsg ?? "Failed to exchange WeChat code.");
  }

  const userParams = new URLSearchParams({
    access_token: tokenPayload.access_token,
    openid: tokenPayload.openid,
    lang: "zh_CN"
  });
  const userResponse = await fetch(`https://api.weixin.qq.com/sns/userinfo?${userParams.toString()}`);
  const userPayload = await userResponse.json();
  if (!userResponse.ok || userPayload.errcode) {
    throw new Error(userPayload.errmsg ?? "Failed to fetch WeChat user.");
  }

  return {
    id: `wechat-${userPayload.unionid ?? userPayload.openid}`,
    name: userPayload.nickname ?? "微信用户",
    provider: "wechat" as const
  };
}
