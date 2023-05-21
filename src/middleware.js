// import {NextResponse} from "next/server";
// import {get} from "@vercel/edge-config";
//
// export const config = {
//   matcher: ['/(tourn|bowl|dir|team)(.+)'], // Any page that we expect to be requested, other than / and /about
// };
//
// export async function middleware(request) {
//   const inMaintenanceMode = await get('maintenanceMode');
//
//   // If we are, then re-route to maintenance
//   if (inMaintenanceMode) {
//     request.nextUrl.pathname = '/maint.html';
//
//     return NextResponse.rewrite(request.nextUrl);
//   }
// }
