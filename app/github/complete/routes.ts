import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response(null, {
      status: 400,
    });  }
  
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  // github에서 액세스 토큰을 가져옴
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });

  const { error, access_token } = await accessTokenResponse.json();
  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  // github의 방식에 따라 사용자 프로필을 가져옴
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`, // github API가 작동하는 방식 (문서 참고)
    },
    cache: "no-cache",
  });
  
  //github에서 사용자 정보(id, avatar, login-id)를 가져옴
  const { id, avatar_url, login } = await userProfileResponse.json();
  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  });
  if (user) {
    const session = await getSession();
    session.id = user.id;
    await session.save();
    return redirect("/profile");
  }
  // 사용자가 존재하지 않으면 새로운 사용자를 만듦
  const newUser = await db.user.create({
    data: {
      username: login,
      github_id: id + "",
      avatar: avatar_url,
    },
    select: {
      id: true,
    },
  });
  // 사용자가 새로 생성되면 세션을 만들어 사용자를 로그인 상태로 만듦
  const session = await getSession();
  session.id = newUser.id;
  await session.save();
  return redirect("/profile");
}