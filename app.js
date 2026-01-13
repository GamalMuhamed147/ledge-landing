window.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn");
  const out = document.getElementById("out");

  if (!btn || !out) {
    console.error("Missing elements:", { btn, out });
    return;
  }

  btn.addEventListener("click", () => {
    out.textContent = "JavaScript is working ✅";
    console.log("Button clicked");
  });

  console.log("JS loaded ✅");
});
