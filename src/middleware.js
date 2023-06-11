import { NextResponse } from "next/server";
import {get} from '@vercel/edge-config';

export const config = {
  matcher: [
    '/api/email_check',
  ],
};

async function devEmailValidation(request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.next();
  }

  const deliverable = await get('addressIsDeliverable');

  const headers = new Headers(request.headers);
  headers.set('x-tournio-deliverable', deliverable);

  console.log("x-tournio-deliverable:", deliverable);

  return NextResponse.next({
    request: {
      headers: headers,
    },
  });
}

export default devEmailValidation;
