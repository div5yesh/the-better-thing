// Find and inline all of the remote scripts in the document
// only available in hosted mode
// If they have absolute URL's, then they may work even after detachment

(async function() {
  const scripts = document.querySelectorAll("script[src]");
  for (const script of scripts) {
    const new_script = document.createElement("script");
    new_script.setAttribute("data-source", script.src);
    const response = await fetch(script.src);
    new_script.innerHTML = await response.text();
    script.parentNode.replaceChild(new_script, script);
  }
})();
