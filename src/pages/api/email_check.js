import { NextResponse } from "next/server";
import {VerifaliaRestClient} from "verifalia";

export const config = {
  runtime: 'edge',
  api: {
    bodyParser: '64kb',
  }
}

export default async (req, res) => {
  const shouldPerform = req.headers.get('x-tournio-perform-validation') === 'true';

  if (process.env.NODE_ENV === 'development') {
    // The header tells us how to respond
    const isDeliverable = req.headers.get('x-tournio-deliverable') === 'true';
    console.log("In DEV. Deliverability header says:", isDeliverable);

    // Just making sure.
    const shouldPerform = req.headers.get('x-tournio-perform-validation') === 'true';
    console.log("In DEV. I should check Verifalia? -- ", shouldPerform);

    return new NextResponse(
      JSON.stringify({
        checked: false,
        rejected: !isDeliverable,
      }),
      {
        status: 200,
      }
    )
  }
  if (req.method === 'POST' && shouldPerform) {
    console.log("I should check Verifalia? -- ", shouldPerform);

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
  console.log("I should check Verifalia? -- ", shouldPerform);

  return new NextResponse(
    JSON.stringify({
      checked: false,
      error: 'Bad request. So bad.',
    }),
    {
      status: 400,
    }
  )
};
