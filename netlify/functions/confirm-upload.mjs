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
 * Corporate file rules.
 *
 * These mirror the rules used by
 * create-upload-url.mjs.
 */
const FILE_RULES = {

  director1_signature: {
    applicationTypes: ["corporate"],
    category: "signature",
    minSize: TEN_KB,
    maxSize: FIVE_MB,
    maxCount: 1
  },

  director2_signature: {
    applicationTypes: ["corporate"],
    category: "signature",
    minSize: TEN_KB,
    maxSize: FIVE_MB,
    maxCount: 1
  },

  declaration_signatory1_signature: {
    applicationTypes: ["corporate"],
    category: "signature",
    minSize: TEN_KB,
    maxSize: FIVE_MB,
    maxCount: 1
  },

  declaration_signatory2_signature: {
    applicationTypes: ["corporate"],
    category: "signature",
    minSize: TEN_KB,
    maxSize: FIVE_MB,
    maxCount: 1
  },

  indemnity_signatory1_signature: {
    applicationTypes: ["corporate"],
    category: "signature",
    minSize: TEN_KB,
    maxSize: FIVE_MB,
    maxCount: 1
  },

  indemnity_signatory2_signature: {
    applicationTypes: ["corporate"],
    category: "signature",
    minSize: TEN_KB,
    maxSize: FIVE_MB,
    maxCount: 1
  },

  witness_signature: {
    applicationTypes: [
  "corporate",
  "individual",
  "joint",
  "minor"
],
    category: "signature",
    minSize: TEN_KB,
    maxSize: FIVE_MB,
    maxCount: 1
  },

  company_seal: {
    applicationTypes: ["corporate"],
    category: "image",
    minSize: 1,
    maxSize: FIVE_MB,
    maxCount: 1
  },

  director1_passport_photo: {
    applicationTypes: ["corporate"],
    category: "image",
    minSize: 1,
    maxSize: FIVE_MB,
    maxCount: 1
  },

  director2_passport_photo: {
    applicationTypes: ["corporate"],
    category: "image",
    minSize: 1,
    maxSize: FIVE_MB,
    maxCount: 1
  },

  certificate_incorporation: {
    applicationTypes: ["corporate"],
    category: "document",
    minSize: 1,
    maxSize: TEN_MB,
    maxCount: 1
  },

  memorandum_articles: {
    applicationTypes: ["corporate"],
    category: "document",
    minSize: 1,
    maxSize: TEN_MB,
    maxCount: 1
  },

  cac_status_report: {
    applicationTypes: ["corporate"],
    category: "document",
    minSize: 1,
    maxSize: TEN_MB,
    maxCount: 1
  },

  board_resolution: {
    applicationTypes: ["corporate"],
    category: "document",
    minSize: 1,
    maxSize: TEN_MB,
    maxCount: 1
  },

  tin_certificate: {
    applicationTypes: ["corporate"],
    category: "document",
    minSize: 1,
    maxSize: TEN_MB,
    maxCount: 1
  },

  corporate_proof_address: {
    applicationTypes: ["corporate"],
    category: "document",
    minSize: 1,
    maxSize: TEN_MB,
    maxCount: 1
  },

  corporate_identity_documents: {
    applicationTypes: ["corporate"],
    category: "document",
    minSize: 1,
    maxSize: TEN_MB,

    /*
     * Multiple IDs may be required for directors,
     * signatories and beneficial owners.
     */
    maxCount: 20
  },

  corporate_ips: {
    applicationTypes: ["corporate"],
    category: "document",
    minSize: 1,
    maxSize: TEN_MB,
    maxCount: 1
  },

  source_funds_evidence: {
    applicationTypes: [
  "corporate",
  "individual",
  "joint",
  "minor"
],
    category: "document",
    minSize: 1,
    maxSize: TEN_MB,
    maxCount: 5
  },

  scuml_certificate: {
    applicationTypes: ["corporate"],
    category: "document",
    minSize: 1,
    maxSize: TEN_MB,
    maxCount: 1
  },

  declaration_app1_signature: {
  applicationTypes: [
    "individual",
    "joint",
    "minor"
  ],
  category: "signature",
  minSize: TEN_KB,
  maxSize: FIVE_MB,
  maxCount: 1
},

declaration_app2_signature: {
  applicationTypes: ["joint"],
  category: "signature",
  minSize: TEN_KB,
  maxSize: FIVE_MB,
  maxCount: 1
},

completed_signed_form: {
  applicationTypes: [
    "individual",
    "joint",
    "minor"
  ],
  category: "document",
  minSize: 1,
  maxSize: TEN_MB,
  maxCount: 1
},

app1_passport_photo: {
  applicationTypes: [
    "individual",
    "joint",
    "minor"
  ],
  category: "image",
  minSize: 1,
  maxSize: FIVE_MB,
  maxCount: 1
},

app2_passport_photo: {
  applicationTypes: ["joint"],
  category: "image",
  minSize: 1,
  maxSize: FIVE_MB,
  maxCount: 1
},

app1_photo_id: {
  applicationTypes: [
    "individual",
    "joint",
    "minor"
  ],
  category: "document",
  minSize: 1,
  maxSize: TEN_MB,
  maxCount: 1
},

app2_photo_id: {
  applicationTypes: ["joint"],
  category: "document",
  minSize: 1,
  maxSize: TEN_MB,
  maxCount: 1
},

proof_of_address: {
  applicationTypes: [
    "individual",
    "joint",
    "minor"
  ],
  category: "document",
  minSize: 1,
  maxSize: TEN_MB,
  maxCount: 1
},

minor_birth_certificate: {
  applicationTypes: ["minor"],
  category: "document",
  minSize: 1,
  maxSize: TEN_MB,
  maxCount: 1
},

personal_ips: {
  applicationTypes: [
    "individual",
    "joint",
    "minor"
  ],
  category: "document",
  minSize: 1,
  maxSize: TEN_MB,
  maxCount: 1
},

signed_fee_schedule: {
  applicationTypes: [
    "individual",
    "joint",
    "minor"
  ],
  category: "document",
  minSize: 1,
  maxSize: TEN_MB,
  maxCount: 1
}

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


function validStoragePath({
  path,
  application,
  fileType
}) {

  /*
   * A file belonging to this application MUST be
   * stored under:
   *
   * corporate/
   * <application UUID>/
   * <file type>/
   */

  const expectedPrefix =
    application.application_type +
    "/" +
    application.id +
    "/" +
    fileType +
    "/";


  return (
    path.startsWith(expectedPrefix) &&
    !path.includes("..") &&
    !path.includes("\\")
  );

}


async function removeRejectedObject(
  supabase,
  path
) {

  try {

    await supabase
      .storage
      .from(STORAGE_BUCKET)
      .remove([path]);

  } catch (error) {

    console.error(
      "Could not remove rejected Storage object:",
      error
    );

  }

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
        message: "Method not allowed."
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


  const storagePath =
    cleanString(
      body.path,
      1000
    );


  const originalName =
    cleanString(
      body.originalName,
      255
    );


  const expectedMimeType =
    cleanString(
      body.mimeType,
      100
    ).toLowerCase();


  const expectedSize =
    Number(
      body.sizeBytes
    );


  const rule =
    FILE_RULES[fileType];


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
    !storagePath ||
    !originalName
  ) {

    return jsonResponse(
      {
        ok: false,
        message:
          "File information is incomplete."
      },
      400
    );

  }


  if (
    !Number.isSafeInteger(
      expectedSize
    ) ||
    expectedSize < 1
  ) {

    return jsonResponse(
      {
        ok: false,
        message:
          "Invalid file size."
      },
      400
    );

  }


  try {

    const supabase =
      getSupabaseAdmin();


    /*
     * Verify customer application session.
     */
    const verification =
      await verifyApplicationSession({
        supabase,
        applicationId,
        submissionToken
      });


    if (!verification.ok) {

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
     * Ensure this file type belongs to this
     * application type.
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
     * Prevent one application from claiming
     * another application's private file.
     */
    if (
      !validStoragePath({
        path: storagePath,
        application,
        fileType
      })
    ) {

      return jsonResponse(
        {
          ok: false,
          message:
            "Invalid Storage path."
        },
        400
      );

    }


    /*
     * Ask Supabase about the ACTUAL object.
     */
    const {
      data: objectInfo,
      error: infoError
    } = await supabase
      .storage
      .from(STORAGE_BUCKET)
      .info(storagePath);


    if (
      infoError ||
      !objectInfo
    ) {

      return jsonResponse(
        {
          ok: false,
          message:
            "The uploaded file could not be found."
        },
        400
      );

    }


    const actualSize =
      Number(
        objectInfo.size
      );


    const actualMimeType =
      String(
        objectInfo.contentType || ""
      ).toLowerCase();


    /*
     * Check actual object size.
     */
    if (
      !Number.isSafeInteger(actualSize) ||
      actualSize < rule.minSize ||
      actualSize > rule.maxSize
    ) {

      await removeRejectedObject(
        supabase,
        storagePath
      );


      return jsonResponse(
        {
          ok: false,
          message:
            "The uploaded file does not meet the allowed size requirements."
        },
        400
      );

    }


    /*
     * Check actual Storage content type.
     */
    const allowedMimeTypes =
      CATEGORY_MIME_TYPES[
        rule.category
      ];


    if (
      !allowedMimeTypes ||
      !allowedMimeTypes.has(
        actualMimeType
      )
    ) {

      await removeRejectedObject(
        supabase,
        storagePath
      );


      return jsonResponse(
        {
          ok: false,
          message:
            "The uploaded file type is not allowed."
        },
        400
      );

    }


    /*
     * The browser's details should also match what
     * actually reached Storage.
     */
    if (
      actualSize !== expectedSize ||
      actualMimeType !== expectedMimeType
    ) {

      await removeRejectedObject(
        supabase,
        storagePath
      );


      return jsonResponse(
        {
          ok: false,
          message:
            "The uploaded file does not match the selected file."
        },
        400
      );

    }


    /*
     * Make this endpoint safe to retry.
     *
     * If this exact Storage path was already confirmed,
     * return success instead of creating another row.
     */
    const {
      data: existingFile,
      error: existingError
    } = await supabase
      .from("application_files")
      .select(`
        id,
        application_id,
        file_type,
        storage_path,
        original_name,
        mime_type,
        size_bytes
      `)
      .eq(
        "storage_path",
        storagePath
      )
      .maybeSingle();


    if (existingError) {

      console.error(
        "Existing file lookup failed:",
        existingError
      );


      return jsonResponse(
        {
          ok: false,
          message:
            "We could not confirm the uploaded file."
        },
        500
      );

    }


    if (existingFile) {

      if (
        existingFile.application_id !==
          application.id ||
        existingFile.file_type !==
          fileType
      ) {

        return jsonResponse(
          {
            ok: false,
            message:
              "The uploaded file is already assigned."
          },
          409
        );

      }


      return jsonResponse(
        {
          ok: true,
          file: {
            id:
              existingFile.id,

            fileType:
              existingFile.file_type,

            originalName:
              existingFile.original_name,

            mimeType:
              existingFile.mime_type,

            sizeBytes:
              Number(
                existingFile.size_bytes
              )
          }
        },
        200
      );

    }


    /*
     * Limit the number of confirmed files for
     * each logical upload type.
     */
    const {
      count,
      error: countError
    } = await supabase
      .from("application_files")
      .select(
        "id",
        {
          count: "exact",
          head: true
        }
      )
      .eq(
        "application_id",
        application.id
      )
      .eq(
        "file_type",
        fileType
      );


    if (countError) {

      console.error(
        "File count lookup failed:",
        countError
      );


      return jsonResponse(
        {
          ok: false,
          message:
            "We could not confirm the uploaded file."
        },
        500
      );

    }


    if (
      Number(count || 0) >=
      rule.maxCount
    ) {

      await removeRejectedObject(
        supabase,
        storagePath
      );


      return jsonResponse(
        {
          ok: false,
          message:
            "The maximum number of files for this upload type has been reached."
        },
        400
      );

    }


    /*
     * The object has now been verified.
     * Record it in our application_files table.
     */
    const {
      data: insertedFile,
      error: insertError
    } = await supabase
      .from("application_files")
      .insert({
        application_id:
          application.id,

        file_type:
          fileType,

        storage_path:
          storagePath,

        original_name:
          originalName,

        mime_type:
          actualMimeType,

        size_bytes:
          actualSize
      })
      .select(`
        id,
        file_type,
        original_name,
        mime_type,
        size_bytes
      `)
      .single();


    if (
      insertError ||
      !insertedFile
    ) {

      console.error(
        "Application file insert failed:",
        insertError
      );


      return jsonResponse(
        {
          ok: false,
          message:
            "We could not confirm the uploaded file."
        },
        500
      );

    }


    return jsonResponse(
      {
        ok: true,

        file: {
          id:
            insertedFile.id,

          fileType:
            insertedFile.file_type,

          originalName:
            insertedFile.original_name,

          mimeType:
            insertedFile.mime_type,

          sizeBytes:
            Number(
              insertedFile.size_bytes
            )
        }
      },
      201
    );


  } catch (error) {

    console.error(
      "Confirm upload error:",
      error
    );


    return jsonResponse(
      {
        ok: false,
        message:
          "We could not confirm the uploaded file."
      },
      500
    );

  }

}


export const config = {

  path:
    "/api/confirm-upload",

  rateLimit: {

    windowLimit: 60,

    windowSize: 60,

    aggregateBy: [
      "ip",
      "domain"
    ]

  }

};