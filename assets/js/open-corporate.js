// Starfetch — Corporate Account Opening
(function () {
  "use strict";


  var form = document.getElementById("corporate-account-form");

  if (!form) return;



  // ============================================================
  // FILE LIMITS
  // ============================================================

  var signatureMinSize = 10 * 1024; // 10 KB
  var signatureMaxSize = 5 * 1024 * 1024; // 5 MB

  var documentMaxSize = 10 * 1024 * 1024; // 10 MB


  var signatureTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];


  var documentTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png"
  ];



  // ============================================================
  // HELPERS
  // ============================================================

  function showElement(element) {
    if (!element) return;

    element.hidden = false;
  }


  function hideElement(element) {
    if (!element) return;

    element.hidden = true;
  }


  function setConditionalInput(
    wrapper,
    input,
    show,
    required
  ) {

    if (!wrapper || !input) return;


    wrapper.hidden = !show;

    input.disabled = !show;

    input.required =
      show && required;


    if (!show) {
      input.value = "";
      input.setCustomValidity("");
    }

  }



  // ============================================================
  // SERVICE SELECTION
  // ============================================================

  var serviceCheckboxes =
    form.querySelectorAll(
      "[data-service-checkbox]"
    );


  function syncService(serviceCheckbox) {

    var amountId =
      serviceCheckbox.getAttribute(
        "data-amount-target"
      );


    var amountInput =
      document.getElementById(
        amountId
      );


    if (!amountInput) return;


    if (serviceCheckbox.checked) {

      amountInput.disabled = false;

      amountInput.required = true;

    } else {

      amountInput.disabled = true;

      amountInput.required = false;

      amountInput.value = "";

      amountInput.setCustomValidity("");

    }

  }


  Array.prototype.forEach.call(
    serviceCheckboxes,
    function (checkbox) {

      checkbox.addEventListener(
        "change",
        function () {

          syncService(checkbox);

          syncDiscretionaryIPS();

        }
      );


      syncService(checkbox);

    }
  );



  // ============================================================
  // REQUIRE AT LEAST ONE MANDATE
  // ============================================================

  function validateServiceSelection() {

    var anyChecked = false;


    Array.prototype.forEach.call(
      serviceCheckboxes,
      function (checkbox) {

        if (checkbox.checked) {
          anyChecked = true;
        }

      }
    );


    var firstService =
      serviceCheckboxes.length
        ? serviceCheckboxes[0]
        : null;


    if (!firstService) {
      return true;
    }


    if (!anyChecked) {

      firstService.setCustomValidity(
        "Please select at least one investment service."
      );

      return false;

    }


    firstService.setCustomValidity("");

    return true;

  }


  Array.prototype.forEach.call(
    serviceCheckboxes,
    function (checkbox) {

      checkbox.addEventListener(
        "change",
        validateServiceSelection
      );

    }
  );



  // ============================================================
  // DISCRETIONARY IPS
  // ============================================================

  var discretionaryCheckbox =
    document.getElementById(
      "corp_svc_discretionary"
    );


  var ipsInput =
    document.getElementById(
      "corporate_ips"
    );


  var ipsRequiredMarker =
    document.getElementById(
      "corporate_ips_required_marker"
    );


  function syncDiscretionaryIPS() {

    if (
      !discretionaryCheckbox ||
      !ipsInput
    ) {
      return;
    }


    var required =
      discretionaryCheckbox.checked;


    ipsInput.required = required;


    if (ipsRequiredMarker) {

      ipsRequiredMarker.innerHTML =
        required
          ? ' <span class="req">*</span>'
          : "";

    }

  }


  syncDiscretionaryIPS();



  // ============================================================
  // SOURCE OF FUNDS — OTHER
  // ============================================================

  var sourceOther =
    document.getElementById(
      "corporate_source_other"
    );


  var sourceOtherWrap =
    document.getElementById(
      "corporate_source_other_wrap"
    );


  var sourceOtherInput =
    document.getElementById(
      "corporate_source_other_specify"
    );


  function syncSourceOther() {

    if (!sourceOther) return;


    setConditionalInput(
      sourceOtherWrap,
      sourceOtherInput,
      sourceOther.checked,
      true
    );

  }


  if (sourceOther) {

    sourceOther.addEventListener(
      "change",
      syncSourceOther
    );

  }


  syncSourceOther();



  // ============================================================
  // SIGNING MANDATE — OTHER
  // ============================================================

  var signingMandateOther =
    document.getElementById(
      "signing_mandate_other"
    );


  var signingMandateOtherWrap =
    document.getElementById(
      "signing_mandate_other_wrap"
    );


  var signingMandateOtherInput =
    document.getElementById(
      "signing_mandate_other_specify"
    );


  function syncSigningMandate() {

    var checked =
      form.querySelector(
        'input[name="signing_mandate"]:checked'
      );


    var isOther =
      checked &&
      checked.value === "Other";


    setConditionalInput(
      signingMandateOtherWrap,
      signingMandateOtherInput,
      Boolean(isOther),
      true
    );

  }


  Array.prototype.forEach.call(
    form.querySelectorAll(
      'input[name="signing_mandate"]'
    ),
    function (radio) {

      radio.addEventListener(
        "change",
        syncSigningMandate
      );

    }
  );


  syncSigningMandate();



  // ============================================================
  // PEP DETAILS
  // ============================================================

  var pepYes =
    document.getElementById(
      "corporate_pep_yes"
    );


  var pepDetailsWrap =
    document.getElementById(
      "corporate_pep_details_wrap"
    );


  var pepDetails =
    document.getElementById(
      "corporate_pep_details"
    );


  function syncPEP() {

    var show =
      pepYes &&
      pepYes.checked;


    setConditionalInput(
      pepDetailsWrap,
      pepDetails,
      Boolean(show),
      true
    );

  }


  Array.prototype.forEach.call(
    form.querySelectorAll(
      'input[name="pep_status"]'
    ),
    function (radio) {

      radio.addEventListener(
        "change",
        syncPEP
      );

    }
  );


  syncPEP();



  // ============================================================
  // BENEFICIAL OWNER COMPLETENESS
  // ============================================================

  function setupBeneficialOwnerValidation(number) {

    var name =
      document.getElementById(
        "bo" + number + "_full_name"
      );


    var percentage =
      document.getElementById(
        "bo" + number + "_percentage"
      );


    var nationality =
      document.getElementById(
        "bo" + number + "_nationality"
      );


    var id =
      document.getElementById(
        "bo" + number + "_bvn_id"
      );


    var controls = [
      name,
      percentage,
      nationality,
      id
    ];


    function sync() {

      var anyFilled =
        controls.some(
          function (control) {
            return (
              control &&
              String(control.value).trim() !== ""
            );
          }
        );


      controls.forEach(
        function (control) {

          if (!control) return;

          control.required =
            anyFilled;

        }
      );

    }


    controls.forEach(
      function (control) {

        if (!control) return;

        control.addEventListener(
          "input",
          sync
        );

        control.addEventListener(
          "change",
          sync
        );

      }
    );


    sync();

  }


  setupBeneficialOwnerValidation(1);
  setupBeneficialOwnerValidation(2);
  setupBeneficialOwnerValidation(3);



  // ============================================================
  // SIGNATURE VALIDATION
  // ============================================================

  Array.prototype.forEach.call(
    form.querySelectorAll(
      "[data-signature-upload]"
    ),
    function (input) {

      input.addEventListener(
        "change",
        function () {

          input.setCustomValidity("");


          if (
            !input.files ||
            !input.files.length
          ) {
            return;
          }


          var file =
            input.files[0];


          if (
            signatureTypes.indexOf(
              file.type
            ) === -1
          ) {

            input.setCustomValidity(
              "Please upload the signature as a JPG, PNG or WEBP image."
            );

            input.reportValidity();

            return;

          }


          if (
            file.size <
            signatureMinSize
          ) {

            input.setCustomValidity(
              "The signature image is too small. Please upload an image of at least 10 KB."
            );

            input.reportValidity();

            return;

          }


          if (
            file.size >
            signatureMaxSize
          ) {

            input.setCustomValidity(
              "The signature image is too large. Please upload an image no larger than 5 MB."
            );

            input.reportValidity();

            return;

          }

        }
      );

    }
  );



  // ============================================================
  // GENERAL IMAGE VALIDATION
  // ============================================================

  Array.prototype.forEach.call(
    form.querySelectorAll(
      "[data-image-upload]"
    ),
    function (input) {

      input.addEventListener(
        "change",
        function () {

          input.setCustomValidity("");


          if (
            !input.files ||
            !input.files.length
          ) {
            return;
          }


          var file =
            input.files[0];


          if (
            signatureTypes.indexOf(
              file.type
            ) === -1
          ) {

            input.setCustomValidity(
              "Please upload a JPG, PNG or WEBP image."
            );

            input.reportValidity();

            return;

          }


          if (
            file.size >
            signatureMaxSize
          ) {

            input.setCustomValidity(
              "The image is too large. Please upload a file no larger than 5 MB."
            );

            input.reportValidity();

            return;

          }

        }
      );

    }
  );



  // ============================================================
  // CORPORATE DOCUMENT VALIDATION
  // ============================================================

  Array.prototype.forEach.call(
    form.querySelectorAll(
      "[data-document-upload]"
    ),
    function (input) {

      input.addEventListener(
        "change",
        function () {

          input.setCustomValidity("");


          if (
            !input.files ||
            !input.files.length
          ) {
            return;
          }


          for (
            var i = 0;
            i < input.files.length;
            i++
          ) {

            var file =
              input.files[i];


            if (
              documentTypes.indexOf(
                file.type
              ) === -1
            ) {

              input.setCustomValidity(
                "Please upload corporate documents as PDF, JPG or PNG files."
              );

              input.reportValidity();

              return;

            }


            if (
              file.size >
              documentMaxSize
            ) {

              input.setCustomValidity(
                "Each uploaded document must be no larger than 10 MB."
              );

              input.reportValidity();

              return;

            }

          }

        }
      );

    }
  );



  // ============================================================
  // COPY COMMON INFORMATION
  // ============================================================

  var institutionName =
    document.getElementById(
      "institution_name"
    );


  var indemnityAccountName =
    document.getElementById(
      "indemnity_account_name"
    );


  /*
   * Automatically suggest the institution name
   * as the portfolio / mandate account name.
   *
   * The user can still edit it manually.
   */

  if (
    institutionName &&
    indemnityAccountName
  ) {

    institutionName.addEventListener(
      "blur",
      function () {

        if (
          !indemnityAccountName.value.trim()
        ) {

          indemnityAccountName.value =
            institutionName.value.trim();

        }

      }
    );

  }



  // ============================================================
  // COPY DIRECTOR DETAILS TO DECLARATION / INDEMNITY NAMES
  // ============================================================

  function copyIfEmpty(
    sourceId,
    destinationIds
  ) {

    var source =
      document.getElementById(
        sourceId
      );


    if (!source) return;


    source.addEventListener(
      "blur",
      function () {

        destinationIds.forEach(
          function (destinationId) {

            var destination =
              document.getElementById(
                destinationId
              );


            if (
              destination &&
              !destination.value.trim()
            ) {

              destination.value =
                source.value.trim();

            }

          }
        );

      }
    );

  }


  copyIfEmpty(
    "director1_full_name",
    [
      "declaration_signatory1_name",
      "indemnity_signatory1_name"
    ]
  );


  copyIfEmpty(
    "director2_full_name",
    [
      "declaration_signatory2_name",
      "indemnity_signatory2_name"
    ]
  );


  copyIfEmpty(
    "director1_designation",
    [
      "declaration_signatory1_designation"
    ]
  );


  copyIfEmpty(
    "director2_designation",
    [
      "declaration_signatory2_designation"
    ]
  );



    // ============================================================
  // SECURE APPLICATION SUBMISSION
  // ============================================================

  var status =
    document.getElementById(
      "corporate-form-status"
    );


  var submitButton =
    form.querySelector(
      'button[type="submit"]'
    );


  /*
   * Kept only in browser memory.
   *
   * We deliberately do NOT store the application
   * submission token in localStorage, sessionStorage,
   * cookies or the URL.
   */
  var activeSubmission = null;


  /*
   * Keeps track of files successfully confirmed
   * during this page session.
   *
   * This allows a retry after a temporary network
   * failure without unnecessarily uploading files
   * that were already confirmed.
   */
  var confirmedUploads =
    Object.create(null);



  function setSubmissionStatus(
    message
  ) {

    if (!status) return;


    status.hidden = false;

    status.textContent =
      message;


    status.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }



  function setSubmitting(
    submitting
  ) {

    if (!submitButton) return;


    submitButton.disabled =
      submitting;


    submitButton.textContent =
      submitting
        ? "Submitting application..."
        : "Submit corporate application";

  }



  async function apiRequest(
    url,
    payload
  ) {

    var response;


    try {

      response =
        await fetch(
          url,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(
                payload
              )
          }
        );

    } catch (error) {

      var networkError =
        new Error(
          "A network error occurred. Please check your connection and try again."
        );

      networkError.status = 0;

      throw networkError;

    }


    var data = null;


    try {

      data =
        await response.json();

    } catch (error) {

      data = null;

    }


    if (
      !response.ok ||
      !data ||
      data.ok !== true
    ) {

      var requestError =
        new Error(
          data &&
          data.message
            ? data.message
            : "The request could not be completed."
        );


      requestError.status =
        response.status;


      requestError.data =
        data || {};


      throw requestError;

    }


    return data;

  }



  function getCheckboxValue(
    name
  ) {

    var input =
      form.querySelector(
        '[name="' +
        name +
        '"]'
      );


    return Boolean(
      input &&
      input.checked
    );

  }



  function buildCorporateFormData() {

    var result = {};

    var browserFormData =
      new FormData(form);


    browserFormData.forEach(
      function (
        value,
        key
      ) {

        /*
         * Actual files are stored in Supabase Storage.
         * They must not also be placed in form_data.
         */
        if (
          value instanceof File
        ) {
          return;
        }


        /*
         * Radio groups normally produce one value.
         * This also safely handles any repeated
         * non-file field names.
         */
        if (
          Object.prototype
            .hasOwnProperty
            .call(
              result,
              key
            )
        ) {

          if (
            !Array.isArray(
              result[key]
            )
          ) {

            result[key] = [
              result[key]
            ];

          }


          result[key].push(
            value
          );

          return;

        }


        result[key] =
          value;

      }
    );


    /*
     * Send explicit true / false values for
     * checkboxes so an unchecked box is not
     * confused with a missing field.
     */

    [
      "svc_fixed_note",
      "svc_discretionary",
      "svc_non_discretionary",

      "source_business",
      "source_asset_sale",
      "source_financing",
      "source_other",

      "declaration_accept",
      "indemnity_accept"

    ].forEach(
      function (name) {

        result[name] =
          getCheckboxValue(
            name
          );

      }
    );


    /*
     * The anti-bot field is only needed when
     * starting the application.
     */
    delete result.website;


    return result;

  }



  function collectSelectedFiles() {

    var files = [];


    Array.prototype.forEach.call(
      form.querySelectorAll(
        'input[type="file"][name]'
      ),
      function (input) {

        if (
          !input.files ||
          !input.files.length
        ) {
          return;
        }


        for (
          var i = 0;
          i < input.files.length;
          i++
        ) {

          files.push({
            input:
              input,

            file:
              input.files[i],

            index:
              i,

            fileType:
              input.name
          });

        }

      }
    );


    return files;

  }



  function createFileFingerprint(
    fileItem
  ) {

    return [
      fileItem.fileType,
      fileItem.index,
      fileItem.file.name,
      fileItem.file.size,
      fileItem.file.type,
      fileItem.file.lastModified
    ].join("::");

  }



  async function startCorporateApplication() {

    var institutionInput =
      form.querySelector(
        '[name="institution_name"]'
      );


    var contactEmailInput =
      form.querySelector(
        '[name="contact_email"]'
      );


    var contactPhoneInput =
      form.querySelector(
        '[name="contact_phone"]'
      );


    var honeypotInput =
      form.querySelector(
        '[name="website"]'
      );


    var response =
      await apiRequest(
        "/api/start-application",
        {
          applicationType:
            "corporate",

          applicantName:
            institutionInput
              ? institutionInput.value
              : "",

          contactEmail:
            contactEmailInput
              ? contactEmailInput.value
              : "",

          contactPhone:
            contactPhoneInput
              ? contactPhoneInput.value
              : "",

          website:
            honeypotInput
              ? honeypotInput.value
              : ""
        }
      );


    if (
      !response.application ||
      !response.application.id ||
      !response.application.reference ||
      !response.submissionToken
    ) {

      throw new Error(
        "The secure application session could not be created."
      );

    }


    return {
      id:
        response.application.id,

      reference:
        response.application.reference,

      submissionToken:
        response.submissionToken
    };

  }



  async function uploadFile(
    fileItem
  ) {

    var file =
      fileItem.file;


    /*
     * Browser MIME type is required because our
     * backend uses an explicit MIME allow-list.
     */
    if (!file.type) {

      throw new Error(
        "The browser could not determine the type of \"" +
        file.name +
        "\". Please choose the file again."
      );

    }



    var permission =
      await apiRequest(
        "/api/create-upload-url",
        {
          applicationId:
            activeSubmission.id,

          submissionToken:
            activeSubmission.submissionToken,

          fileType:
            fileItem.fileType,

          originalName:
            file.name,

          mimeType:
            file.type,

          sizeBytes:
            file.size
        }
      );



    if (
      !permission.upload ||
      !permission.upload.signedUrl ||
      !permission.upload.path
    ) {

      throw new Error(
        "Secure upload permission could not be created."
      );

    }



    /*
     * Upload the file DIRECTLY to private
     * Supabase Storage.
     *
     * The Supabase server secret is never exposed
     * to browser JavaScript.
     */
    var uploadResponse;


    try {

      uploadResponse =
        await fetch(
          permission.upload.signedUrl,
          {
            method:
              "PUT",

            headers: {
              "Content-Type":
                file.type,

              "Cache-Control":
                "max-age=3600",

              "x-upsert":
                "false"
            },

            body:
              file
          }
        );

    } catch (error) {

      throw new Error(
        "The file \"" +
        file.name +
        "\" could not be uploaded. Please check your connection and try again."
      );

    }



    if (
      !uploadResponse.ok
    ) {

      throw new Error(
        "The file \"" +
        file.name +
        "\" could not be uploaded securely."
      );

    }



    /*
     * Ask our backend to inspect the ACTUAL object
     * in private Storage before accepting it.
     */
    await apiRequest(
      "/api/confirm-upload",
      {
        applicationId:
          activeSubmission.id,

        submissionToken:
          activeSubmission.submissionToken,

        fileType:
          fileItem.fileType,

        path:
          permission.upload.path,

        originalName:
          file.name,

        mimeType:
          file.type,

        sizeBytes:
          file.size
      }
    );

  }



  function focusFirstServerInvalidField(
    fieldNames
  ) {

    if (
      !Array.isArray(
        fieldNames
      ) ||
      !fieldNames.length
    ) {
      return;
    }


    var field =
      form.querySelector(
        '[name="' +
        fieldNames[0] +
        '"]'
      );


    if (!field) return;


    field.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });


    try {

      field.focus({
        preventScroll: true
      });

    } catch (error) {

      field.focus();

    }

  }



  form.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      validateServiceSelection();

      syncDiscretionaryIPS();

      syncSourceOther();

      syncSigningMandate();

      syncPEP();



      if (!form.checkValidity()) {

        form.reportValidity();


        setSubmissionStatus(
          "Please complete the required fields before submitting the application."
        );


        return;

      }



      setSubmitting(true);


      try {

        /*
         * Only create a new application once during
         * this page session.
         *
         * If a temporary network failure occurs,
         * pressing Submit again reuses the same
         * application instead of creating duplicates.
         */
        if (!activeSubmission) {

          setSubmissionStatus(
            "Creating your secure Starfetch application..."
          );


          activeSubmission =
            await startCorporateApplication();

        }



        var files =
          collectSelectedFiles();


        for (
          var i = 0;
          i < files.length;
          i++
        ) {

          var fileItem =
            files[i];


          var fingerprint =
            createFileFingerprint(
              fileItem
            );


          /*
           * Skip a file that was already successfully
           * uploaded and confirmed during this page session.
           */
          if (
            confirmedUploads[
              fingerprint
            ]
          ) {
            continue;
          }



          setSubmissionStatus(
            "Securely uploading file " +
            (i + 1) +
            " of " +
            files.length +
            ": " +
            fileItem.file.name
          );



          await uploadFile(
            fileItem
          );


          confirmedUploads[
            fingerprint
          ] = true;

        }



        setSubmissionStatus(
          "Finalising your application. Please do not close this page."
        );



        var finalResult =
          await apiRequest(
            "/api/finalize-application",
            {
              applicationId:
                activeSubmission.id,

              submissionToken:
                activeSubmission.submissionToken,

              formData:
                buildCorporateFormData()
            }
          );



        if (
          !finalResult.application ||
          !finalResult.application.reference
        ) {

          throw new Error(
            "The final application reference could not be confirmed."
          );

        }



        var reference =
          finalResult.application.reference;


        /*
         * Token is no longer useful after finalisation
         * because the backend destroys its database hash.
         */
        activeSubmission =
          null;


        confirmedUploads =
          Object.create(null);



        /*
         * Only the harmless application reference goes
         * into the URL.
         *
         * No BVN, NIN, token, email or other KYC data
         * is placed in the query string.
         */
        window.location.assign(
          "application-submitted.html?ref=" +
          encodeURIComponent(
            reference
          )
        );


      } catch (error) {

        /*
         * A 401 means the temporary application session
         * is no longer usable.
         *
         * Clear browser-memory state so the next Submit
         * begins a fresh secure application.
         */
        if (
          error &&
          error.status === 401
        ) {

          activeSubmission =
            null;


          confirmedUploads =
            Object.create(null);


          setSubmissionStatus(
            "Your secure submission session expired or is no longer valid. Please press Submit again to start a fresh secure submission."
          );

        } else {

          if (
            error &&
            error.data &&
            Array.isArray(
              error.data.fields
            )
          ) {

            focusFirstServerInvalidField(
              error.data.fields
            );

          }


          setSubmissionStatus(
            error &&
            error.message
              ? error.message
              : "The application could not be submitted. Please try again."
          );

        }


        setSubmitting(false);

      }

    }
  );


  // ============================================================
  // INITIAL STATE
  // ============================================================

  validateServiceSelection();
  syncDiscretionaryIPS();
  syncSourceOther();
  syncSigningMandate();
  syncPEP();


})();