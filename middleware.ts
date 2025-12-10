// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que son accesibles sin necesidad de iniciar sesión
// Se incluye /login para permitir a los usuarios acceder a la página de inicio de sesión.
const publicRoutes = ['/login'];

// El nombre del cookie que se establece durante el login
const AUTH_COOKIE_NAME = 'auth-token'; 

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get(AUTH_COOKIE_NAME);
  const pathname = request.nextUrl.pathname;

  // 1. Dejar pasar peticiones a la API de verificación/login/logout, recursos de Next.js y archivos públicos.
  // El matcher en la configuración se encarga de la mayoría de estos, pero es un buen chequeo.
  if (
    pathname.startsWith('/api/auth/login') ||
    pathname.startsWith('/api/auth/verify') ||
    pathname.startsWith('/api/auth/logout') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static')
  ) {
    return NextResponse.next();
  }

  // 2. Si el usuario intenta acceder a la página de LOGIN, dejarlo pasar.
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // 3. Si intenta acceder a una RUTA PROTEGIDA (como '/') y NO tiene el token, redirigir a /login
  if (!authToken) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  // 4. Si tiene el token y la ruta no es pública, dejar pasar.
  return NextResponse.next();
}

// Configuración para que el Middleware se ejecute en todas las peticiones a páginas
// El matcher excluye las rutas internas de Next.js (_next) y archivos estáticos (favicon.ico).
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};