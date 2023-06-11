// import { NextResponse } from "next/server";
// import {get} from '@vercel/edge-config';
//
// export const config = {
//   matcher: [
//     '/api/email_check',
//   ],
// };
//
// async function devEmailValidation(request) {
//   const headers = new Headers(request.headers);
//
//   if (process.env.NODE_ENV === 'development') {
//     const deliverable = await get('addressIsDeliverable');
//
//     headers.set('x-tournio-deliverable', deliverable);
//     headers.set('x-tournio-perform-validation', false);
//   } else {
//     const performValidation = await get('verifalia-email-validation');
//     console.log("Middleware -- perform validation? --", performValidation);
//     headers.set('x-tournio-perform-validation', performValidation);
//   }
//
//   return NextResponse.next({
//     request: {
//       headers: headers,
//     },
//   });
// }
//
// export default devEmailValidation;
