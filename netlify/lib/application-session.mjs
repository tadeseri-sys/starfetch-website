import {
  createHash,
  timingSafeEqual
} from "node:crypto";


function hashSubmissionToken(token) {

  return createHash("sha256")
    .update(token)
    .digest("hex");

}


function safeHashCompare(
  suppliedHash,
  storedHash
) {

  if (
    typeof suppliedHash !== "string" ||
    typeof storedHash !== "string"
  ) {
    return false;
  }


  const supplied =
    Buffer.from(suppliedHash, "hex");

  const stored =
    Buffer.from(storedHash, "hex");


  if (
    supplied.length === 0 ||
    supplied.length !== stored.length
  ) {
    return false;
  }


  return timingSafeEqual(
    supplied,
    stored
  );

}


function looksLikeUuid(value) {

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );

}


export async function verifyApplicationSession({
  supabase,
  applicationId,
  submissionToken
}) {

  if (
    typeof applicationId !== "string" ||
    !looksLikeUuid(applicationId)
  ) {

    return {
      ok: false,
      reason: "invalid"
    };

  }


  if (
    typeof submissionToken !== "string" ||
    submissionToken.length < 32 ||
    submissionToken.length > 500
  ) {

    return {
      ok: false,
      reason: "invalid"
    };

  }


  const {
    data,
    error
  } = await supabase
    .from("applications")
    .select(`
      id,
      reference,
      application_type,
      status,
      submission_token_hash,
      submission_token_expires_at
    `)
    .eq("id", applicationId)
    .maybeSingle();


  if (
    error ||
    !data
  ) {

    return {
      ok: false,
      reason: "invalid"
    };

  }


  if (
    data.status !== "uploading"
  ) {

    return {
      ok: false,
      reason: "invalid"
    };

  }


  if (
    !data.submission_token_hash ||
    !data.submission_token_expires_at
  ) {

    return {
      ok: false,
      reason: "invalid"
    };

  }


  const expiresAt =
    new Date(
      data.submission_token_expires_at
    );


  if (
    Number.isNaN(expiresAt.getTime()) ||
    expiresAt.getTime() <= Date.now()
  ) {

    return {
      ok: false,
      reason: "expired"
    };

  }


  const suppliedHash =
    hashSubmissionToken(
      submissionToken
    );


  if (
    !safeHashCompare(
      suppliedHash,
      data.submission_token_hash
    )
  ) {

    return {
      ok: false,
      reason: "invalid"
    };

  }


  return {
    ok: true,
    application: data
  };

}