import { NextRequest, NextResponse } from 'next/server';
import getSession from './lib/session';

//인증된 사용자만 접근할 수 있도록 하는 미들웨어 만들기
interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  '/': true,
  '/login': true,
  '/sms': true,
  '/create-account': true,
  '/github/start': true,
  '/github/complete': true, 
};

export async function middleware(request: NextRequest) {
  //1 세션을 가져옴 2. 세션이 없는 경우 3. 세션이 없는 경우에만 리다이렉트
  const session = await getSession();
  const exists = publicOnlyUrls[request.nextUrl.pathname];
  if (!session.id) {
    if (!exists) {
      return NextResponse.redirect(new URL('/ ', request.url)); 
    } else {
      if (exists) {
        console.log('exists', exists);
        // return NextResponse.redirect(new URL('/products', request.url));
      }
      
    }
  }
}

//matcher 속성을 사용하여 특정 경로에만 미들웨어를 적용할 수 있음
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
