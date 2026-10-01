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
  // SUBMISSION
  // ============================================================

  var status =
    document.getElementById(
      "corporate-form-status"
    );


  form.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      validateServiceSelection();

      syncDiscretionaryIPS();

      syncSourceOther();

      syncSigningMandate();

      syncPEP();


      if (!form.checkValidity()) {

        form.reportValidity();

        if (status) {

          status.hidden = false;

          status.textContent =
            "Please complete the required fields before submitting the application.";

        }

        return;

      }


      /*
       * IMPORTANT:
       *
       * Corporate KYC data must not be sent through
       * Netlify Forms or directly to the database
       * from browser-side JavaScript.
       *
       * We will replace this block with the secure
       * backend/API submission when the database,
       * private storage and admin system are ready.
       */


      if (status) {

        status.hidden = false;

        status.innerHTML =
          "<strong>Form completed successfully.</strong> " +
          "Secure corporate application submission is being connected to the Starfetch onboarding system. " +
          "No sensitive information has been transmitted from this page yet.";

        status.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });

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