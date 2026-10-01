// Starfetch — Individual / Joint / Minor account opening page
(function () {
  "use strict";

  var form = document.querySelector('form[name="account-individual"]');

  if (!form) return;


  // ------------------------------------------------------------
  // 1. ACCOUNT TYPE FROM URL
  // ------------------------------------------------------------

  var qs = new URLSearchParams(window.location.search);
  var requestedType = (qs.get("type") || "").toLowerCase();


  if (requestedType === "joint") {

    var joint = form.querySelector(
      'input[name="account_type"][value="Joint account"]'
    );

    if (joint) {
      joint.checked = true;
    }

  } else if (requestedType === "minor") {

    var minor = form.querySelector(
      'input[name="account_type"][value^="Account for a minor"]'
    );

    if (minor) {
      minor.checked = true;
    }

  }


  // ------------------------------------------------------------
  // 2. GET CURRENT ACCOUNT TYPE
  // ------------------------------------------------------------

  function accountType() {

    var checked = form.querySelector(
      'input[name="account_type"]:checked'
    );

    return checked
      ? checked.value
      : "Individual account";

  }


  // ------------------------------------------------------------
  // 3. SHOW / HIDE JOINT AND MINOR SECTIONS
  // ------------------------------------------------------------

  function applyType() {

    var type = accountType();

    var isJoint =
      type === "Joint account";

    var isMinor =
      type.indexOf("minor") !== -1;


    Array.prototype.forEach.call(
      form.querySelectorAll("[data-when]"),
      function (el) {

        var requiredType =
          el.getAttribute("data-when");


        var show =
          (requiredType === "joint" && isJoint) ||
          (requiredType === "minor" && isMinor);


        // Show or hide the whole block.
        el.hidden = !show;


        // Handle all controls inside the block.
        Array.prototype.forEach.call(
          el.querySelectorAll(
            "input, select, textarea"
          ),
          function (control) {

            /*
             * Hidden fields are disabled.
             *
             * This prevents hidden Joint or Minor information
             * from being validated or accidentally submitted.
             */
            control.disabled = !show;


            /*
             * Fields marked with
             * data-required-when-visible
             * are compulsory only while their section
             * is visible.
             */
            if (
              control.hasAttribute(
                "data-required-when-visible"
              )
            ) {

              control.required = show;

            } else if (!show) {

              control.required = false;

            }

          }
        );

      }
    );

  }


  // ------------------------------------------------------------
  // 4. ACCOUNT TYPE CHANGE LISTENER
  // ------------------------------------------------------------

  Array.prototype.forEach.call(
    form.querySelectorAll(
      'input[name="account_type"]'
    ),
    function (radio) {

      radio.addEventListener(
        "change",
        applyType
      );

    }
  );


  // ------------------------------------------------------------
  // 5. "OTHER — SPECIFY" CONDITIONAL FIELDS
  // ------------------------------------------------------------

  Array.prototype.forEach.call(
    form.querySelectorAll(
      "[data-show-when-checked]"
    ),
    function (box) {

      var triggerId =
        box.getAttribute(
          "data-show-when-checked"
        );


      var trigger =
        document.getElementById(
          triggerId
        );


      if (!trigger) return;


      var sync = function () {

        var show =
          trigger.checked;


        box.hidden = !show;


        Array.prototype.forEach.call(
          box.querySelectorAll(
            "input, select, textarea"
          ),
          function (control) {

            control.disabled = !show;

            if (!show) {
              control.value = "";
            }

          }
        );

      };


      trigger.addEventListener(
        "change",
        sync
      );


      sync();

    }
  );


  // ------------------------------------------------------------
  // 6. PRINT BUTTON
  // ------------------------------------------------------------

  var printBtn =
    document.getElementById(
      "btn-print"
    );


  if (printBtn) {

    printBtn.addEventListener(
      "click",
      function () {
        window.print();
      }
    );

  }


  // ------------------------------------------------------------
  // 7. INITIAL STATE
  // ------------------------------------------------------------

  applyType();

})();