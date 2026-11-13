/* BMW Explorer — in-page video player.
   Videos remain on their official publisher's video platform and are NOT
   downloaded or copied. The video's button never navigates away from the site.
   To use a licensed, verified BMW-hosted short clip, set story.officialMp4Url
   to its permitted https:// MP4 URL; the HTML5 player will be used instead.
   Without that URL, an official BMW-channel film is embedded inside this page.
*/
"use strict";
window.BMWFilmPlayer = {
  init({stage, play, close, error, retry, mount, story, model}) {
    if (!stage || !play || !mount || !story) return;
    const poster = stage.querySelector(".bmw-film-poster");
    if (poster) {
      poster.addEventListener("error", () => {
        const fallback = poster.dataset.fallback || model.image;
        // Also try the smaller YouTube thumbnail before reverting to the car.
        if (poster.dataset.triedSmall !== "yes" && poster.src.includes("maxresdefault")) {
          poster.dataset.triedSmall = "yes";
          poster.src = `https://i.ytimg.com/vi/${story.video}/hqdefault.jpg`;
        } else if (poster.getAttribute("src") !== fallback) poster.src = fallback;
      });
    }
    const isValidMp4 = typeof story.officialMp4Url === "string" &&
      /^https:\/\//i.test(story.officialMp4Url) && /\.(mp4|webm)(\?|$)/i.test(story.officialMp4Url);
    let player = null;
    let statusTimeout = null;
    const hideError = () => { error.hidden = true; };
    const showError = (message) => {
      const paragraph = error.querySelector("p");
      if (paragraph && message) paragraph.textContent = message;
      error.hidden = false;
    };
    const stop = () => {
      clearTimeout(statusTimeout);
      if (player && player.tagName === "VIDEO") player.pause();
      mount.replaceChildren();
      player = null;
      mount.hidden = true;
      close.hidden = true;
      stage.classList.remove("is-playing");
      play.hidden = false;
      hideError();
    };
    const launch = () => {
      hideError();
      if (location.protocol === "file:") {
        showError("This site is open as a file (file://). Close this tab, extract the website ZIP, and double-click START_WEBSITE_WINDOWS.bat. It opens the site at http://127.0.0.1:8000 without installing Python. Then play the film here.");
        return;
      }
      if (!navigator.onLine) {
        showError("Your browser appears offline. Connect to the internet, then select Retry here.");
        return;
      }
      if (player) stop();
      mount.hidden = false;
      close.hidden = false;
      play.hidden = true;
      stage.classList.add("is-playing");
      if (isValidMp4) {
        const video = document.createElement("video");
        video.controls = true;
        video.playsInline = true;
        video.autoplay = true;
        video.preload = "metadata";
        video.src = story.officialMp4Url;
        video.setAttribute("aria-label", `BMW ${model.name} official video`);
        video.addEventListener("error", () => showError("The BMW-hosted clip could not be streamed here. Its source may prohibit playback on other sites."));
        mount.append(video);
        player = video;
        video.play().catch(() => { video.autoplay = false; });
      } else {
        const iframe = document.createElement("iframe");
        const videoId = String(story.video || "");
        if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
          stop();
          showError("The official video reference has an invalid ID.");
          return;
        }
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&controls=1&rel=0&modestbranding=1`;
        iframe.title = `Watch BMW ${model.name} – ${story.videoTitle} inside BMW Explorer`;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        iframe.loading = "eager";
        iframe.referrerPolicy = "strict-origin-when-cross-origin";
        iframe.addEventListener("error", () => showError("This video provider did not allow the embed to load. Use Live Server or GitHub Pages and check your browser's privacy settings."));
        mount.append(iframe);
        player = iframe;
      }
    };
    play.addEventListener("click", launch);
    close.addEventListener("click", stop);
    retry.addEventListener("click", launch);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && player && player.tagName === "VIDEO") player.pause();
    });
  }
};
