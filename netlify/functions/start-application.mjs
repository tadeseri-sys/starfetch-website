import {
  createHash,
  randomBytes
} from "node:crypto";

import {
  getSupabaseAdmin
} from "../lib/supabase.mjs";



const ALLOWED_APPLICATION_TYPES =
  new Set([
    "individual",
    "joint",
    "minor",
    "corporate"
  ]);


const REFERENCE_PREFIXES = {
  individual: "IND",
  joint: "JNT",
  minor: "MIN",
  corporate: "COR"
};



function jsonResponse(
  body,
  status = 200
) {

  return Response.json(
    body,
    {
      status,
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );

}



function cleanString(
  value,
  maxLength
) {

  if (typeof value !== "string") {
    return "";
  }


  return value
    .trim()
    .slice(0, maxLength);

}



function isValidEmail(email) {

  if (!email) {
    return false;
  }


  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );

}



function lagosDateStamp() {

  const formatter =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone: "Africa/Lagos",

        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }
    );


  const parts =
    formatter.formatToParts(
      new Date()
    );


  const values = {};


  parts.forEach(
    function (part) {

      if (
        part.type === "year" ||
        part.type === "month" ||
        part.type === "day"
      ) {

        values[part.type] =
          part.value;

      }

    }
  );


  return (
    values.year +
    values.month +
    values.day
  );

}



function randomReferenceCode() {

  /*
   * Avoid ambiguous characters:
   * 0, O, 1, I
   */

  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


  const bytes =
    randomBytes(6);


  let result = "";


  for (
    let i = 0;
    i < bytes.length;
    i++
  ) {

    result +=
      alphabet[
        bytes[i] %
        alphabet.length
      ];

  }


  return result;

}



function createReference(
  applicationType
) {

  const prefix =
    REFERENCE_PREFIXES[
      applicationType
    ];


  return (
    "SF-" +
    prefix +
    "-" +
    lagosDateStamp() +
    "-" +
    randomReferenceCode()
  );

}



function createSubmissionToken() {

  return randomBytes(32)
    .toString("base64url");

}



function hashSubmissionToken(
  token
) {

  return createHash("sha256")
    .update(token)
    .digest("hex");

}



async function createApplicationRecord(
  supabase,
  applicationData
) {

  /*
   * Reference collisions are extremely unlikely,
   * but the database reference column is UNIQUE,
   * so retry a few times if one ever occurs.
   */

  for (
    let attempt = 0;
    attempt < 4;
    attempt++
  ) {

    const reference =
      createReference(
        applicationData.applicationType
      );


    const submissionToken =
      createSubmissionToken();


    const submissionTokenHash =
      hashSubmissionToken(
        submissionToken
      );


    /*
     * The submission session lasts for two hours.
     *
     * The customer has already completed the form
     * before this endpoint is called, so this is
     * primarily for the upload/finalisation process.
     */

    const tokenExpiresAt =
      new Date(
        Date.now() +
        (2 * 60 * 60 * 1000)
      ).toISOString();


    const {
      data,
      error
    } = await supabase
      .from("applications")
      .insert({
        reference,

        application_type:
          applicationData.applicationType,

        status:
          "uploading",

        applicant_name:
          applicationData.applicantName,

        contact_email:
          applicationData.contactEmail,

        contact_phone:
          applicationData.contactPhone,

        form_data: {},

        submission_token_hash:
          submissionTokenHash,

        submission_token_expires_at:
          tokenExpiresAt
      })
      .select(
        `
          id,
          reference,
          application_type,
          status,
          created_at
        `
      )
      .single();


    if (!error) {

      return {
        record: data,
        submissionToken
      };

    }


    /*
     * PostgreSQL error 23505 means
     * UNIQUE constraint violation.
     *
     * If the reference somehow collided,
     * simply generate another one.
     */

    if (
      error.code === "23505"
    ) {

      continue;

    }


    throw error;

  }


  throw new Error(
    "Unable to generate a unique application reference."
  );

}



export default async function handler(
  request
) {

  if (
    request.method !== "POST"
  ) {

    return jsonResponse(
      {
        ok: false,
        message:
          "Method not allowed."
      },
      405
    );

  }



  const contentType =
    request.headers.get(
      "content-type"
    ) || "";


  if (
    !contentType.includes(
      "application/json"
    )
  ) {

    return jsonResponse(
      {
        ok: false,
        message:
          "Content-Type must be application/json."
      },
      415
    );

  }



  let body;


  try {

    body =
      await request.json();

  } catch {

    return jsonResponse(
      {
        ok: false,
        message:
          "Invalid JSON request."
      },
      400
    );

  }



  /*
   * Honeypot.
   *
   * Real customers will leave this empty.
   * We will connect a hidden field to it
   * when wiring the forms.
   */

  if (
    typeof body.website === "string" &&
    body.website.trim() !== ""
  ) {

    /*
     * Don't tell bots that they have
     * triggered the honeypot.
     */

    return jsonResponse(
      {
        ok: true
      },
      200
    );

  }



  const applicationType =
    cleanString(
      body.applicationType,
      20
    ).toLowerCase();


  const applicantName =
    cleanString(
      body.applicantName,
      200
    );


  const contactEmail =
    cleanString(
      body.contactEmail,
      254
    ).toLowerCase();


  const contactPhone =
    cleanString(
      body.contactPhone,
      40
    );



  if (
    !ALLOWED_APPLICATION_TYPES.has(
      applicationType
    )
  ) {

    return jsonResponse(
      {
        ok: false,
        message:
          "Invalid application type."
      },
      400
    );

  }



  if (
    applicantName.length < 2
  ) {

    return jsonResponse(
      {
        ok: false,
        message:
          "Applicant name is required."
      },
      400
    );

  }



  if (
    !isValidEmail(
      contactEmail
    )
  ) {

    return jsonResponse(
      {
        ok: false,
        message:
          "A valid contact email is required."
      },
      400
    );

  }



  if (
    contactPhone.length < 7
  ) {

    return jsonResponse(
      {
        ok: false,
        message:
          "A valid contact phone number is required."
      },
      400
    );

  }



  try {

    const supabase =
      getSupabaseAdmin();


    const {
      record,
      submissionToken
    } =
      await createApplicationRecord(
        supabase,
        {
          applicationType,
          applicantName,
          contactEmail,
          contactPhone
        }
      );


    return jsonResponse(
      {
        ok: true,

        application: {
          id:
            record.id,

          reference:
            record.reference,

          applicationType:
            record.application_type,

          status:
            record.status,

          createdAt:
            record.created_at
        },

        submissionToken,

        expiresInSeconds:
          7200
      },
      201
    );


  } catch (error) {

    console.error(
      "Start application error:",
      error
    );


    return jsonResponse(
      {
        ok: false,

        message:
          "We could not start the application. Please try again."
      },
      500
    );

  }

}



/*
 * Clean public endpoint:
 *
 * /api/start-application
 *
 * We also rate-limit application creation
 * to reduce automated spam against the
 * onboarding database.
 */

export const config = {

  path:
    "/api/start-application",

  rateLimit: {

    windowLimit: 10,

    windowSize: 60,

    aggregateBy: [
      "ip",
      "domain"
    ]

  }

};