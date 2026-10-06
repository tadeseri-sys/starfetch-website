import {
  randomBytes
} from "node:crypto";

import {
  getSupabaseAdmin
} from "../lib/supabase.mjs";

import {
  verifyApplicationSession
} from "../lib/application-session.mjs";



const STORAGE_BUCKET =
  "kyc-documents";


const FIVE_MB =
  5 * 1024 * 1024;


const TEN_MB =
  10 * 1024 * 1024;


const TEN_KB =
  10 * 1024;



/*
 * Rules for every file type that Corporate
 * Account Opening may upload.
 *
 * minSize and maxSize are preliminary server
 * checks. We will verify the actual stored file
 * again during application finalisation.
 */

const FILE_RULES = {

  director1_signature: {
    applicationTypes: ["corporate"],
    category: "signature",
    minSize: TEN_KB,
    maxSize: FIVE_MB
  },

  director2_signature: {
    applicationTypes: ["corporate"],
    category: "signature",
    minSize: TEN_KB,
    maxSize: FIVE_MB
  },

  declaration_signatory1_signature: {
    applicationTypes: ["corporate"],
    category: "signature",
    minSize: TEN_KB,
    maxSize: FIVE_MB
  },

  declaration_signatory2_signature: {
    applicationTypes: ["corporate"],
    category: "signature",
    minSize: TEN_KB,
    maxSize: FIVE_MB
  },

  indemnity_signatory1_signature: {
    applicationTypes: ["corporate"],
    category: "signature",
    minSize: TEN_KB,
    maxSize: FIVE_MB
  },

  indemnity_signatory2_signature: {
    applicationTypes: ["corporate"],
    category: "signature",
    minSize: TEN_KB,
    maxSize: FIVE_MB
  },

  witness_signature: {
    applicationTypes: ["corporate"],
    category: "signature",
    minSize: TEN_KB,
    maxSize: FIVE_MB
  },

  company_seal: {
    applicationTypes: ["corporate"],
    category: "image",
    minSize: 1,
    maxSize: FIVE_MB
  },

  director1_passport_photo: {
    applicationTypes: ["corporate"],
    category: "image",
    minSize: 1,
    maxSize: FIVE_MB
  },

  director2_passport_photo: {
    applicationTypes: ["corporate"],
    category: "image",
    minSize: 1,
    maxSize: FIVE_MB
  },

  certificate_incorporation: {
    applicationTypes: ["corporate"],
    category: "document",
    minSize: 1,
    maxSize: TEN_MB
  },

  memorandum_articles: {
    applicationTypes: ["corporate"],
    category: "document",
    minSize: 1,
    maxSize: TEN_MB
  },

  cac_status_report: {
    applicationTypes: ["corporate"],
    category: "document",
    minSize: 1,
    maxSize: TEN_MB
  },

  board_resolution: {
    applicationTypes: ["corporate"],
    category: "document",
    minSize: 1,
    maxSize: TEN_MB
  },

  tin_certificate: {
    applicationTypes: ["corporate"],
    category: "document",
    minSize: 1,
    maxSize: TEN_MB
  },

  corporate_proof_address: {
    applicationTypes: ["corporate"],
    category: "document",
    minSize: 1,
    maxSize: TEN_MB
  },

  corporate_identity_documents: {
    applicationTypes: ["corporate"],
    category: "document",
    minSize: 1,
    maxSize: TEN_MB
  },

  corporate_ips: {
    applicationTypes: ["corporate"],
    category: "document",
    minSize: 1,
    maxSize: TEN_MB
  },

  source_funds_evidence: {
    applicationTypes: ["corporate"],
    category: "document",
    minSize: 1,
    maxSize: TEN_MB
  },

  scuml_certificate: {
    applicationTypes: ["corporate"],
    category: "document",
    minSize: 1,
    maxSize: TEN_MB
  }

};



const MIME_EXTENSIONS = {

  "application/pdf":
    "pdf",

  "image/jpeg":
    "jpg",

  "image/png":
    "png",

  "image/webp":
    "webp"

};



const CATEGORY_MIME_TYPES = {

  signature:
    new Set([
      "image/jpeg",
      "image/png",
      "image/webp"
    ]),

  image:
    new Set([
      "image/jpeg",
      "image/png",
      "image/webp"
    ]),

  document:
    new Set([
      "application/pdf",
      "image/jpeg",
      "image/png"
    ])

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

  if (
    typeof value !== "string"
  ) {

    return "";

  }


  return value
    .trim()
    .slice(0, maxLength);

}



function createStoragePath({
  application,
  fileType,
  mimeType
}) {

  const extension =
    MIME_EXTENSIONS[
      mimeType
    ];


  const randomName =
    randomBytes(16)
      .toString("hex");


  return [
    application.application_type,
    application.id,
    fileType,
    randomName + "." + extension
  ].join("/");

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



  const applicationId =
    cleanString(
      body.applicationId,
      100
    );


  const submissionToken =
    cleanString(
      body.submissionToken,
      500
    );


  const fileType =
    cleanString(
      body.fileType,
      100
    );


  const originalName =
    cleanString(
      body.originalName,
      255
    );


  const mimeType =
    cleanString(
      body.mimeType,
      100
    ).toLowerCase();


  const sizeBytes =
    Number(
      body.sizeBytes
    );



  /*
   * Check that the requested file type is one
   * we explicitly understand.
   */

  const rule =
    FILE_RULES[
      fileType
    ];


  if (!rule) {

    return jsonResponse(
      {
        ok: false,
        message:
          "Unsupported upload type."
      },
      400
    );

  }



  if (
    originalName.length < 1
  ) {

    return jsonResponse(
      {
        ok: false,
        message:
          "Original file name is required."
      },
      400
    );

  }



  if (
    !Number.isSafeInteger(
      sizeBytes
    ) ||
    sizeBytes < rule.minSize ||
    sizeBytes > rule.maxSize
  ) {

    return jsonResponse(
      {
        ok: false,
        message:
          "The selected file does not meet the allowed size requirements."
      },
      400
    );

  }



  const allowedMimeTypes =
    CATEGORY_MIME_TYPES[
      rule.category
    ];


  if (
    !allowedMimeTypes ||
    !allowedMimeTypes.has(
      mimeType
    ) ||
    !MIME_EXTENSIONS[
      mimeType
    ]
  ) {

    return jsonResponse(
      {
        ok: false,
        message:
          "The selected file type is not allowed."
      },
      400
    );

  }



  try {

    const supabase =
      getSupabaseAdmin();


    /*
     * Authenticate the temporary application
     * session before giving out any Storage
     * upload permission.
     */

    const verification =
      await verifyApplicationSession({
        supabase,
        applicationId,
        submissionToken
      });


    if (
      !verification.ok
    ) {

      return jsonResponse(
        {
          ok: false,
          message:
            "Application session is invalid or has expired."
        },
        401
      );

    }



    const application =
      verification.application;



    /*
     * A Corporate application cannot request
     * an Individual-only upload type, and vice versa.
     */

    if (
      !rule.applicationTypes.includes(
        application.application_type
      )
    ) {

      return jsonResponse(
        {
          ok: false,
          message:
            "This upload type is not valid for the application."
        },
        400
      );

    }



    /*
     * Never trust the original filename for our
     * actual private Storage path.
     *
     * Example result:
     *
     * corporate/
     * <application UUID>/
     * certificate_incorporation/
     * <random>.pdf
     */

    const storagePath =
      createStoragePath({
        application,
        fileType,
        mimeType
      });



    /*
     * Supabase creates temporary upload permission.
     *
     * upsert:false means this permission cannot be
     * used to intentionally overwrite an existing
     * object with the same path.
     */

    const {
      data,
      error
    } = await supabase
      .storage
      .from(
        STORAGE_BUCKET
      )
      .createSignedUploadUrl(
        storagePath,
        {
          upsert: false
        }
      );



    if (
      error ||
      !data
    ) {

      console.error(
        "Create signed upload URL failed:",
        error
      );


      return jsonResponse(
        {
          ok: false,
          message:
            "We could not prepare the file upload. Please try again."
        },
        500
      );

    }



    /*
     * IMPORTANT:
     *
     * We deliberately do NOT insert into
     * application_files yet.
     *
     * Receiving an upload URL does not prove
     * that the customer successfully uploaded
     * the file.
     *
     * During finalisation we will verify the
     * actual object in private Storage and only
     * then record it as an application file.
     */

    return jsonResponse(
      {
        ok: true,

        upload: {

          fileType,

          originalName,

          mimeType,

          sizeBytes,

          path:
            data.path,

          signedUrl:
            data.signedUrl,

          token:
            data.token,

          expiresInSeconds:
            7200
        }
      },
      201
    );


  } catch (error) {

    console.error(
      "Create upload URL error:",
      error
    );


    return jsonResponse(
      {
        ok: false,
        message:
          "We could not prepare the file upload. Please try again."
      },
      500
    );

  }

}



/*
 * Public API route.
 *
 * The application token is still required before
 * any signed Storage permission is issued.
 */

export const config = {

  path:
    "/api/create-upload-url",

  rateLimit: {

    windowLimit: 40,

    windowSize: 60,

    aggregateBy: [
      "ip",
      "domain"
    ]

  }

};