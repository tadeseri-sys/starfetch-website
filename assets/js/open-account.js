// Starfetch — account opening page (open-account.html)
(function () {
  "use strict";
  var form = document.querySelector('form[name="account-individual"]');
  if (!form) return;

  // 1. Account type from the menu link (?type=individual / ?type=joint)
  var qs = new URLSearchParams(location.search);
  var t = (qs.get("type") || "").toLowerCase();
  if (t === "joint") {
    var joint = form.querySelector('input[name="account_type"][value="Joint account"]');
    if (joint) joint.checked = true;
  } else if (t === "minor") {
    var minor = form.querySelector('input[name="account_type"][value^="Account for a minor"]');
    if (minor) minor.checked = true;
  }

  // 2. Conditional sections (joint blocks, minor section, "other, specify")
  function accountType() {
    var checked = form.querySelector('input[name="account_type"]:checked');
    return checked ? checked.value : "Individual account";
  }
  function applyType() {
    var type = accountType();
    var isJoint = type === "Joint account";
    var isMinor = type.indexOf("minor") !== -1;
    Array.prototype.forEach.call(form.querySelectorAll("[data-when]"), function (el) {
      var want = el.getAttribute("data-when");
      var show = (want === "joint" && isJoint) || (want === "minor" && isMinor);
      el.hidden = !show;
      Array.prototype.forEach.call(el.querySelectorAll("input, select, textarea"), function (c) {
        if (show) { if (c.dataset.wasRequired === "1") { c.required = true; } }
        else { if (c.required) { c.dataset.wasRequired = "1"; c.required = false; } }
      });
    });
  }
  Array.prototype.forEach.call(form.querySelectorAll('input[name="account_type"]'), function (r) {
    r.addEventListener("change", applyType);
  });
  Array.prototype.forEach.call(form.querySelectorAll("[data-show-when-checked]"), function (box) {
    var trigger = document.getElementById(box.getAttribute("data-show-when-checked"));
    if (!trigger) return;
    var sync = function () {
      box.hidden = !trigger.checked;
      if (!trigger.checked) {
        var inp = box.querySelector("input");
        if (inp) inp.value = "";
      }
    };
    trigger.addEventListener("change", sync);
    sync();
  });

  // 3. Print the filled form (for signing sections 13–14 in ink)
  var printBtn = document.getElementById("btn-print");
  if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

  applyType();
})();