type Theme = "light" | "dark";

const themeStorageKey = "resume-hub-theme";
const themeButton = document.createElement("button");
themeButton.className = "theme-toggle no-print";
themeButton.type = "button";
themeButton.setAttribute("aria-label", "Switch to light theme");
themeButton.title = "Switch to light theme";
document.body.append(themeButton);

function readSavedTheme(): Theme | null {
  try {
    const savedTheme = window.localStorage.getItem(themeStorageKey);
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : null;
  } catch {
    return null;
  }
}

function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  const targetTheme = theme === "dark" ? "light" : "dark";
  themeButton.textContent = theme === "dark" ? "☀️" : "🌙";
  themeButton.setAttribute("aria-label", `Switch to ${targetTheme} theme`);
  themeButton.title = `Switch to ${targetTheme} theme`;
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute(
    "content",
    theme === "dark" ? "#0d1117" : "#f6f8fa",
  );

  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Theme switching still works for the current page if storage is unavailable.
  }
}

const initialTheme = readSavedTheme() ?? document.documentElement.dataset.theme;
setTheme(initialTheme === "dark" ? "dark" : "light");
themeButton.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});
