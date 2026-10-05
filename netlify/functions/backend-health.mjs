import { getSupabaseAdmin } from "../lib/supabase.mjs";


export default async function handler(request) {

  /*
   * This endpoint exists only to confirm that:
   *
   * 1. Netlify Functions are working.
   * 2. Environment variables are available.
   * 3. Supabase can be reached.
   * 4. The applications table exists.
   *
   * It does NOT return customer information.
   */


  if (request.method !== "GET") {

    return Response.json(
      {
        ok: false,
        message: "Method not allowed."
      },
      {
        status: 405,
        headers: {
          "Cache-Control": "no-store",
          "Allow": "GET"
        }
      }
    );

  }


  try {

    const supabase =
      getSupabaseAdmin();


    /*
     * Ask Supabase for at most one application ID.
     *
     * We don't care whether an application actually exists.
     * We only want to confirm that the database/table
     * can be accessed successfully.
     */

    const {
      error
    } = await supabase
      .from("applications")
      .select("id")
      .limit(1);


    if (error) {

      console.error(
        "Supabase health check failed:",
        error
      );


      return Response.json(
        {
          ok: false,
          database: "unavailable"
        },
        {
          status: 500,
          headers: {
            "Cache-Control": "no-store"
          }
        }
      );

    }


    return Response.json(
      {
        ok: true,
        backend: "online",
        database: "connected"
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );


  } catch (error) {

    console.error(
      "Backend health check error:",
      error
    );


    return Response.json(
      {
        ok: false,
        backend: "configuration_error"
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );

  }

}