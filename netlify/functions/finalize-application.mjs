import {
  createHash
} from "node:crypto";

import {
  getSupabaseAdmin
} from "../lib/supabase.mjs";

import {
  verifyApplicationSession
} from "../lib/application-session.mjs";



const MAX_FORM_DATA_BYTES =
  256 * 1024;



const CHECKBOX_FIELDS = [

  "svc_fixed_note",
  "svc_discretionary",
  "svc_non_discretionary",

  "source_business",
  "source_asset_sale",
  "source_financing",
  "source_other",

  "declaration_accept",
  "indemnity_accept"

];



const NUMBER_FIELDS = [

  "svc_fixed_note_amount",
  "svc_discretionary_amount",
  "svc_non_discretionary_amount",

  "total_amount",
  "annual_turnover",

  "expected_withdrawals",
  "expected_annual_inflow",

  "bo1_percentage",
  "bo2_percentage",
  "bo3_percentage"

];



const STRING_FIELDS = [

  "funding_date",
  "investment_horizon",
  "base_currency",

  "institution_name",
  "registration_number",
  "incorporation_date",
  "incorporation_place",
  "legal_entity_type",
  "business_sector",
  "corporate_tin",
  "corporate_lei",
  "corporate_phone",
  "corporate_email",
  "corporate_website",
  "registered_address",
  "business_address",
  "corporate_city",
  "corporate_state",
  "corporate_country",
  "nature_of_business",
  "contact_person",
  "contact_designation",
  "contact_email",
  "contact_phone",

  "investment_objective",
  "risk_tolerance",
  "risk_horizon",
  "withdrawal_frequency",
  "investment_restrictions",

  "source_other_specify",
  "expected_transaction_frequency",

  "bank_name",
  "bank_account_number",
  "bank_account_name",
  "bank_account_type",
  "bank_branch",
  "bank_bvn",

  "director1_full_name",
  "director1_designation",
  "director1_id_type",
  "director1_id_number",
  "director1_id_issue",
  "director1_id_expiry",
  "director1_bvn",
  "director1_nin",
  "director1_dob",
  "director1_nationality",
  "director1_email",
  "director1_phone",

  "director2_full_name",
  "director2_designation",
  "director2_id_type",
  "director2_id_number",
  "director2_id_issue",
  "director2_id_expiry",
  "director2_bvn",
  "director2_nin",
  "director2_dob",
  "director2_nationality",
  "director2_email",
  "director2_phone",

  "signing_mandate",
  "signing_mandate_other_specify",

  "pep_status",
  "pep_details",

  "bo1_full_name",
  "bo1_nationality",
  "bo1_bvn_id",

  "bo2_full_name",
  "bo2_nationality",
  "bo2_bvn_id",

  "bo3_full_name",
  "bo3_nationality",
  "bo3_bvn_id",

  "heard_about_us",
  "referral_name",

  "declaration_signatory1_name",
  "declaration_signatory1_designation",
  "declaration_signatory1_date",

  "declaration_signatory2_name",
  "declaration_signatory2_designation",
  "declaration_signatory2_date",

  "indemnity_account_name",
  "indemnity_account_numbers",

  "indemnity_signatory1_name",
  "indemnity_signatory1_date",

  "indemnity_signatory2_name",
  "indemnity_signatory2_date",

  "witness_name",
  "witness_occupation",
  "witness_address",
  "witness_date"

];



const REQUIRED_TEXT_FIELDS = [

  "institution_name",
  "registration_number",
  "incorporation_date",

  "corporate_tin",
  "corporate_phone",
  "corporate_email",

  "registered_address",

  "contact_person",
  "contact_email",
  "contact_phone",

  "bank_name",
  "bank_account_number",
  "bank_account_name",
  "bank_bvn",

  "director1_full_name",
  "director1_designation",
  "director1_id_type",
  "director1_id_number",
  "director1_bvn",
  "director1_nin",
  "director1_dob",
  "director1_nationality",
  "director1_email",
  "director1_phone",

  "director2_full_name",
  "director2_designation",
  "director2_id_type",
  "director2_id_number",
  "director2_bvn",
  "director2_nin",
  "director2_dob",
  "director2_nationality",
  "director2_email",
  "director2_phone",

  "signing_mandate",
  "pep_status",

  "declaration_signatory1_name",
  "declaration_signatory1_designation",
  "declaration_signatory1_date",

  "declaration_signatory2_name",
  "declaration_signatory2_designation",
  "declaration_signatory2_date",

  "indemnity_signatory1_name",
  "indemnity_signatory1_date",

  "indemnity_signatory2_name",
  "indemnity_signatory2_date",

  "witness_name",
  "witness_occupation",
  "witness_address",
  "witness_date"

];



const EMAIL_FIELDS = [

  "corporate_email",
  "contact_email",
  "director1_email",
  "director2_email"

];



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



function isPlainObject(value) {

  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );

}



function cleanString(
  value,
  maxLength = 5000
) {

  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }


  if (
    typeof value !== "string" &&
    typeof value !== "number"
  ) {
    return "";
  }


  return String(value)
    .trim()
    .slice(0, maxLength);

}



function checkboxValue(value) {

  if (value === true) {
    return true;
  }


  if (
    value === false ||
    value === null ||
    value === undefined
  ) {
    return false;
  }


  if (
    typeof value === "string"
  ) {

    const normalised =
      value.trim().toLowerCase();


    if (
      !normalised ||
      normalised === "false" ||
      normalised === "no" ||
      normalised === "off" ||
      normalised === "0"
    ) {
      return false;
    }


    return true;

  }


  return Boolean(value);

}



function numberValue(value) {

  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return null;
  }


  const number =
    Number(value);


  if (
    !Number.isFinite(number) ||
    number < 0
  ) {
    return null;
  }


  return number;

}



function validEmail(value) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  );

}



function hasText(value) {

  return (
    typeof value === "string" &&
    value.trim().length > 0
  );

}



function hashSubmissionToken(token) {

  return createHash("sha256")
    .update(token)
    .digest("hex");

}



function sanitizeCorporateFormData(
  raw
) {

  if (!isPlainObject(raw)) {

    return {
      ok: false,
      errors: [
        "formData"
      ]
    };

  }


  const clean = {

    schema_version:
      "corporate-v1"

  };


  STRING_FIELDS.forEach(
    function (field) {

      clean[field] =
        cleanString(
          raw[field]
        );

    }
  );


  CHECKBOX_FIELDS.forEach(
    function (field) {

      clean[field] =
        checkboxValue(
          raw[field]
        );

    }
  );


  NUMBER_FIELDS.forEach(
    function (field) {

      clean[field] =
        numberValue(
          raw[field]
        );

    }
  );



  const errors = [];



  REQUIRED_TEXT_FIELDS.forEach(
    function (field) {

      if (
        !hasText(
          clean[field]
        )
      ) {

        errors.push(field);

      }

    }
  );



  /*
   * At least one investment service.
   */

  const serviceFields = [

    [
      "svc_fixed_note",
      "svc_fixed_note_amount"
    ],

    [
      "svc_discretionary",
      "svc_discretionary_amount"
    ],

    [
      "svc_non_discretionary",
      "svc_non_discretionary_amount"
    ]

  ];


  const anyService =
    serviceFields.some(
      function (service) {

        return clean[
          service[0]
        ] === true;

      }
    );


  if (!anyService) {

    errors.push(
      "investment_service"
    );

  }



  serviceFields.forEach(
    function (service) {

      const selectedField =
        service[0];

      const amountField =
        service[1];


      if (
        clean[selectedField] === true &&
        clean[amountField] === null
      ) {

        errors.push(
          amountField
        );

      }

    }
  );



  if (
    clean.total_amount === null
  ) {

    errors.push(
      "total_amount"
    );

  }



  if (
    clean.declaration_accept !== true
  ) {

    errors.push(
      "declaration_accept"
    );

  }



  if (
    clean.indemnity_accept !== true
  ) {

    errors.push(
      "indemnity_accept"
    );

  }



  /*
   * Conditional form rules already used by
   * open-corporate.js, now repeated server-side.
   */

  if (
    clean.source_other === true &&
    !hasText(
      clean.source_other_specify
    )
  ) {

    errors.push(
      "source_other_specify"
    );

  }



  if (
    clean.signing_mandate ===
      "Other" &&
    !hasText(
      clean.signing_mandate_other_specify
    )
  ) {

    errors.push(
      "signing_mandate_other_specify"
    );

  }



  if (
    clean.pep_status ===
      "Yes" &&
    !hasText(
      clean.pep_details
    )
  ) {

    errors.push(
      "pep_details"
    );

  }



  /*
   * Validate email fields.
   */

  EMAIL_FIELDS.forEach(
    function (field) {

      if (
        hasText(
          clean[field]
        ) &&
        !validEmail(
          clean[field]
        )
      ) {

        errors.push(field);

      }

    }
  );



  /*
   * Match the numeric patterns already present
   * in the current Corporate form.
   */

  if (
    hasText(
      clean.bank_account_number
    ) &&
    !/^\d{10}$/.test(
      clean.bank_account_number
    )
  ) {

    errors.push(
      "bank_account_number"
    );

  }



  [
    "bank_bvn",
    "director1_bvn",
    "director1_nin",
    "director2_bvn",
    "director2_nin"
  ].forEach(
    function (field) {

      if (
        hasText(
          clean[field]
        ) &&
        !/^\d{11}$/.test(
          clean[field]
        )
      ) {

        errors.push(field);

      }

    }
  );



  /*
   * Beneficial-owner blocks work like the existing
   * browser validation:
   *
   * if any field in the block is started,
   * the whole block must be complete.
   */

  [1, 2, 3].forEach(
    function (number) {

      const nameField =
        "bo" +
        number +
        "_full_name";

      const percentageField =
        "bo" +
        number +
        "_percentage";

      const nationalityField =
        "bo" +
        number +
        "_nationality";

      const idField =
        "bo" +
        number +
        "_bvn_id";


      const started =
        hasText(
          clean[nameField]
        ) ||
        clean[
          percentageField
        ] !== null ||
        hasText(
          clean[nationalityField]
        ) ||
        hasText(
          clean[idField]
        );


      if (!started) {
        return;
      }


      if (
        !hasText(
          clean[nameField]
        )
      ) {
        errors.push(nameField);
      }


      if (
        clean[
          percentageField
        ] === null
      ) {
        errors.push(
          percentageField
        );
      }


      if (
        !hasText(
          clean[nationalityField]
        )
      ) {
        errors.push(
          nationalityField
        );
      }


      if (
        !hasText(
          clean[idField]
        )
      ) {
        errors.push(idField);
      }

    }
  );



  /*
   * Remove duplicates from the error list.
   */

  const uniqueErrors =
    Array.from(
      new Set(errors)
    );


  return {
    ok:
      uniqueErrors.length === 0,

    data:
      clean,

    errors:
      uniqueErrors
  };

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



  if (
    !isPlainObject(
      body.formData
    )
  ) {

    return jsonResponse(
      {
        ok: false,
        message:
          "Application form data is missing."
      },
      400
    );

  }



  let approximateSize;


  try {

    approximateSize =
      Buffer.byteLength(
        JSON.stringify(
          body.formData
        ),
        "utf8"
      );

  } catch {

    return jsonResponse(
      {
        ok: false,
        message:
          "Invalid application form data."
      },
      400
    );

  }



  if (
    approximateSize >
    MAX_FORM_DATA_BYTES
  ) {

    return jsonResponse(
      {
        ok: false,
        message:
          "Application form data is too large."
      },
      413
    );

  }



  try {

    const supabase =
      getSupabaseAdmin();



    /*
     * Authenticate before processing the
     * customer's application data.
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



    if (
      verification.application
        .application_type !==
      "corporate"
    ) {

      return jsonResponse(
        {
          ok: false,
          message:
            "This endpoint is only for corporate applications."
        },
        400
      );

    }



    const validation =
      sanitizeCorporateFormData(
        body.formData
      );



    if (!validation.ok) {

      return jsonResponse(
        {
          ok: false,

          message:
            "Some required application fields are incomplete or invalid.",

          fields:
            validation.errors
        },
        400
      );

    }



    const submissionTokenHash =
      hashSubmissionToken(
        submissionToken
      );



    /*
     * PostgreSQL performs:
     *
     * - required file check
     * - status update
     * - form_data storage
     * - submitted timestamp
     * - token destruction
     * - status-history insert
     *
     * inside one transaction.
     */

    const {
      data,
      error
    } = await supabase
      .rpc(
        "finalize_corporate_application",
        {
          p_application_id:
            applicationId,

          p_submission_token_hash:
            submissionTokenHash,

          p_form_data:
            validation.data
        }
      );



    if (error) {

      const message =
        String(
          error.message || ""
        );


      if (
        message.startsWith(
          "missing_required_files:"
        )
      ) {

        const missingFiles =
          message
            .slice(
              "missing_required_files:"
                .length
            )
            .split(",")
            .map(
              function (item) {
                return item.trim();
              }
            )
            .filter(Boolean);


        return jsonResponse(
          {
            ok: false,

            message:
              "Required uploads are still missing.",

            missingFiles
          },
          400
        );

      }



      if (
        message.includes(
          "invalid_or_expired_session"
        ) ||
        message.includes(
          "application_not_open"
        )
      ) {

        return jsonResponse(
          {
            ok: false,
            message:
              "Application session is invalid, expired or already submitted."
          },
          401
        );

      }



      console.error(
        "Finalize application RPC failed:",
        {
          code:
            error.code,

          message:
            error.message
        }
      );


      return jsonResponse(
        {
          ok: false,
          message:
            "We could not submit the application. Please try again."
        },
        500
      );

    }



    const result =
      Array.isArray(data)
        ? data[0]
        : null;



    if (!result) {

      return jsonResponse(
        {
          ok: false,
          message:
            "We could not confirm the final application status."
        },
        500
      );

    }



    return jsonResponse(
      {
        ok: true,

        application: {

          id:
            result.application_id,

          reference:
            result.application_reference,

          status:
            result.application_status,

          submittedAt:
            result.application_submitted_at
        }
      },
      200
    );


  } catch (error) {

    console.error(
      "Finalize application error:",
      {
        message:
          error instanceof Error
            ? error.message
            : "Unknown error"
      }
    );


    return jsonResponse(
      {
        ok: false,
        message:
          "We could not submit the application. Please try again."
      },
      500
    );

  }

}



export const config = {

  path:
    "/api/finalize-application",

  rateLimit: {

    windowLimit: 10,

    windowSize: 60,

    aggregateBy: [
      "ip",
      "domain"
    ]

  }

};