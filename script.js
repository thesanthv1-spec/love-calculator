// Add your deployed Apps Script URL here later.
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzIm0sutCnPdngt2IilAvITNkzOIzDz1Zxt21-Pls04DjIjgyOvsTO2UDMfMpPa_Zs/exec";

const form = document.getElementById("loveForm");
const button = document.getElementById("calculate");
const result = document.getElementById("result");

function calculateLove(name1, name2) {
  const names = [name1, name2]
    .map(n => n.trim().toLowerCase())
    .sort();

  const combined = names.join("|love|");
  let hash = 0;

  for (const char of combined) {
    hash = (hash * 31 + char.codePointAt(0)) % 1000003;
  }

  return hash % 101;
}

function getMessage(score) {
  if (score >= 80) return "💕 A lovely match!";
  if (score >= 60) return "💖 A sweet connection!";
  if (score >= 40) return "💗 Friendship could blossom!";
  if (score >= 20) return "✨ An unexpected possibility!";
  return "❤️ Every story is different!";
}

form.addEventListener("submit", async event => {
  event.preventDefault();

  const boy = document.getElementById("boy").value.trim();
  const girl = document.getElementById("girl").value.trim();

  if (!boy || !girl) {
    form.reportValidity();
    return;
  }

  const score = calculateLove(boy, girl);

  document.getElementById("percentage").textContent = score + "%";
  document.getElementById("message").textContent = getMessage(score);
  document.getElementById("status").textContent = "Calculating...";
  result.style.display = "block";

  if (!SCRIPT_URL.startsWith("https://script.google.com/macros/s/") ||
      !SCRIPT_URL.endsWith("/exec")) {
    document.getElementById("status").textContent =
      "Score calculated! Connect Google Apps Script to save entries.";
    return;
  }

  button.disabled = true;
  button.textContent = "Submitting...";

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify({ boy, girl })
    });

    document.getElementById("status").textContent =
      "Submission sent. Check the spreadsheet to confirm saving.";
  } catch (error) {
    document.getElementById("status").textContent =
      "Submission may have failed. Check your connection and spreadsheet.";
  } finally {
    button.disabled = false;
    button.textContent = "Calculate Love 💕";
  }
});

document.getElementById("again").addEventListener("click", () => {
  form.reset();
  result.style.display = "none";
  document.getElementById("boy").focus();
});