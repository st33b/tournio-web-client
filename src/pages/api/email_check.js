import {NextResponse} from "next/server";
import {get} from "@vercel/edge-config";
import {VerifaliaRestClient} from "verifalia";

export const config = {
  runtime: 'edge',
  api: {
    bodyParser: '64kb',
  }
}

export default async (req, res) => {
  if (process.env.NODE_ENV === 'development') {
    const reject = await get ('verifalia-reject');
    console.log("In DEV. Deliverability header says:", reject);

    return new NextResponse(
      JSON.stringify({
        checked: false,
        rejected: reject,
      }),
      {
        status: 200,
      }
    )
  }

  const shouldPerform = await get('verifalia-email-validation');

  if (!shouldPerform) {
    const reject = await get ('verifalia-reject').catch((error) => false);
    return new NextResponse(
      JSON.stringify({
        checked: false,
        rejected: reject,
      }),
      {
        status: 200,
      }
    );
  }

  if (req.method === 'POST') {
    let entry;
    const body = await req.json();
    const addressToCheck = body.email;

    const verifalia = new VerifaliaRestClient({
      username: process.env.VERIFALIA_BROWSER_APP_KEY,
    });

    const result = await verifalia.emailValidations.submit(addressToCheck).catch((error) => {
      console.log("Ran into a problem validating an address.", error);
      return {
        checked: true,
        error: error,
      };
    });
    if (!result.error) {
      entry = result.entries[0];
      const responseBody = {
        checked: true,
        rejected: entry.classification === 'Undeliverable',
      };
      return NextResponse.json(responseBody);
    }
    return new NextResponse(
      JSON.stringify({
        checked: true,
        error: error
      }),
      {
        status: 500,
      }
    )
  }

  console.error('API email check requested by something other than POST.');
  return new NextResponse(
    JSON.stringify({
      error: 'Bad request.',
    }),
    {
      status: 400,
    }
  )
};
