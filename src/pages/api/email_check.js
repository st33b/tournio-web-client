import { NextResponse } from "next/server";
import {VerifaliaRestClient} from "verifalia";

export const config = {
  runtime: 'edge',
  api: {
    bodyParser: '64kb',
  }
}

export default async (req, res) => {
  if (!['production', 'preview'].includes(process.env.NODE_ENV)) {
    const isDeliverable = req.headers.get('x-tournio-deliverable') === 'true';
    console.log("Deliverability header says:", isDeliverable);

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
  } else {
    // Fall back to the Jokes API if we didn't get here via POST
    const url = `https://v2.jokeapi.dev//joke/Any?safe-mode`;

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });
    const joke = await response.json();
    return NextResponse.json(joke);
  }
};
