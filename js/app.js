const $ = (id) => document.getElementById(id);
const data = PORTFOLIO;
const pad = (number) => String(number).padStart(2, "0");

// Use textContent for your text so punctuation and HTML-like words are safe.
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Accept ordinary website links and local asset paths, not script URLs.
function safeLink(value) {
  if (!value || !value.trim()) return "";
  const link = value.trim();
  if (/^(https?:|mailto:|tel:)/i.test(link)) return link;
  if (/^[a-z][a-z0-9+.-]*:/i.test(link) || link.startsWith("//")) return "";
  return link;
}

function setLink(node, url) {
  const link = safeLink(url);
  node.hidden = !link;
  if (link) node.href = link;
  else node.removeAttribute("href");
}

function addTags(container, tags) {
  container.replaceChildren(...tags.map((tag) => element("span", "tag", tag)));
}

// Personal details
document.title = `${data.shortName} Raflores | Portfolio · Alt`;
$("brand-name").textContent = data.shortName.toUpperCase();
document.querySelector(".brand").setAttribute("aria-label", `${data.shortName}, home`);
$("hero-location").textContent = data.location.toUpperCase();
$("intro").textContent = data.intro;
$("profile-name").textContent = `${data.shortName.toUpperCase()}.`;
$("profile-role").textContent = data.role;
$("portrait").src = safeLink(data.photo) || "assets/photos/1x1.jpg";
$("portrait").alt = data.name;
$("portrait").addEventListener("error", function () {
  this.hidden = true;
  this.parentElement.append(element("span", "portrait-fallback", data.shortName));
});
$("full-name").textContent = data.name;
$("about-role").textContent = data.role;
$("status").textContent = data.status;
$("contact-status").textContent = data.status;
$("about-text").replaceChildren(...data.about.map((paragraph) => element("p", "", paragraph)));
$("focus-strip").replaceChildren(...data.focus.map((focus) => element("span", "", focus)));
setLink($("resume-link"), data.resume);
if (data.resume) $("resume-link").setAttribute("download", "");
$("copyright").textContent = `© ${new Date().getFullYear()} ${data.name}`;

// Education and availability match the internship résumé.
$("education-title").textContent = data.education.school;
$("education-degree").textContent = data.education.degree;
$("education-specialization").textContent = data.education.specialization;
$("education-period").textContent = `${data.education.period} · ${data.education.graduation}`;
addTags($("education-courses"), data.education.coursework);
$("availability-details").textContent = data.availability;

// Mobile menu: closes after navigation, on Escape, or after an outside click.
const menuButton = $("menu-button");
const menu = $("main-nav");
function closeMenu() {
  menu.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
}
menuButton.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});
menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.classList.contains("is-open")) {
    closeMenu();
    menuButton.focus();
  }
});

// Native dialog handles keyboard focus, Escape, and focus return.
const dialog = $("detail-dialog");
function openDialog(title, label) {
  $("dialog-title").textContent = title;
  $("dialog-label").textContent = label;
  $("dialog-body").replaceChildren();
  document.body.classList.add("dialog-open");
  dialog.showModal();
  dialog.scrollTop = 0;
  $("dialog-close").focus();
}
$("dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
dialog.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});

function dialogLink(label, url, container) {
  if (!safeLink(url)) return;
  const link = element("a", "text-link", `${label} ↗`);
  link.href = safeLink(url);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  container.append(link);
}

// Manual project slider. It never moves while someone is reading.
let projectIndex = 0;
function makeCover(project, index) {
  const cover = $("project-cover");
  cover.classList.remove("has-image");
  cover.replaceChildren();
  const top = element("div", "cover-top");
  top.append(element("span", "", "SELECTED WORK"), element("span", "", `PROJECT / ${pad(index + 1)}`));
  const center = element("div", "cover-center");
  const artwork = element("div", "cover-artwork");
  artwork.setAttribute("aria-hidden", "true");
  if (project.coverStyle === "wave") {
    artwork.classList.add("cover-wave");
    [18, 35, 58, 30, 72, 50, 85, 42, 68, 92, 55, 75, 38, 60, 27, 16].forEach((height, i) => {
      const bar = element("span", "wave-bar");
      bar.style.setProperty("--bar-height", `${height}%`);
      bar.style.setProperty("--bar-delay", `${i * -45}ms`);
      artwork.append(bar);
    });
  } else if (project.coverStyle === "chat") {
    artwork.classList.add("cover-chat");
    const bubble = element("span", "chat-bubble");
    for (let i = 0; i < 3; i++) bubble.append(element("i"));
    artwork.append(bubble, element("span", "chat-reply", "↗"));
  } else {
    artwork.append(element("span", "cover-symbol", project.coverStyle === "terminal" ? ">_" : "{ / }"));
  }
  center.append(artwork, element("span", "cover-title", project.coverLabel || project.title), element("span", "cover-subtitle", project.coverSubtitle || project.category));
  if (project.coverCode) {
    const sample = element("pre", "cover-code");
    sample.append(element("code", "", project.coverCode));
    center.append(sample);
  }
  const bottom = element("div", "cover-bottom");
  const bars = element("span", "cover-bars");
  bars.setAttribute("aria-hidden", "true");
  bottom.append(element("span", "", "PROJECT OVERVIEW"), bars);
  cover.append(top, center, bottom);
}

function showProject(index) {
  const previousIndex = projectIndex;
  projectIndex = (index + data.projects.length) % data.projects.length;
  const project = data.projects[projectIndex];
  $("project-category").textContent = `${pad(projectIndex + 1)} / ${project.category}`;
  $("project-title").textContent = project.title;
  $("project-summary").textContent = project.summary;
  $("project-role").textContent = project.role;
  $("project-role-label").textContent = project.roleLabel || "MY ROLE";
  addTags($("project-tags"), project.tags || []);
  setLink($("project-demo"), project.demo);
  setLink($("project-code"), project.code);
  makeCover(project, projectIndex);
  if (safeLink(project.image)) {
    const imageIndex = projectIndex;
    const image = element("img");
    image.alt = `${project.title} screenshot`;
    image.addEventListener("error", () => {
      if (imageIndex === projectIndex) makeCover(project, imageIndex);
    });
    image.src = safeLink(project.image);
    $("project-cover").classList.add("has-image");
    $("project-cover").replaceChildren(image);
  }
  $("project-count").textContent = `${pad(projectIndex + 1)} / ${pad(data.projects.length)}`;
  document.querySelectorAll(".project-selector").forEach((button, i) => button.setAttribute("aria-pressed", String(i === projectIndex)));
  document.dispatchEvent(new CustomEvent("portfolio:project-change", { detail: { direction: index >= previousIndex ? 1 : -1 } }));
}

data.projects.forEach((project, index) => {
  const button = element("button", "project-selector", pad(index + 1));
  button.setAttribute("aria-label", `Show ${project.title}`);
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => showProject(index));
  $("project-selectors").append(button);
});
if (data.projects.length) {
  showProject(0);
  $("project-prev").disabled = data.projects.length === 1;
  $("project-next").disabled = data.projects.length === 1;
} else {
  $("project-title").textContent = "More work to come.";
  $("project-summary").textContent = "New projects will appear here.";
  $("project-detail").hidden = true;
  document.querySelector(".project-controls").hidden = true;
}
$("project-prev").addEventListener("click", () => showProject(projectIndex - 1));
$("project-next").addEventListener("click", () => showProject(projectIndex + 1));
$("project-detail").addEventListener("click", () => {
  const project = data.projects[projectIndex];
  openDialog(project.title, project.category);
  const body = $("dialog-body");
  body.append(element("p", "", project.details || project.summary));
  const items = project.features || project.contributions;
  if (items?.length) {
    body.append(element("h3", "dialog-subheading", project.features ? "Project features" : "My contributions"));
    const list = element("ul");
    items.forEach((item) => list.append(element("li", "", item)));
    body.append(list);
  }
  const tags = element("div", "tags");
  addTags(tags, project.tags || []);
  body.append(tags);
  const links = element("div", "dialog-links");
  dialogLink("Live site", project.demo, links);
  dialogLink("Source code", project.code, links);
  body.append(links);
});

// Skills: each item becomes a column, or a row on small screens.
data.skills.forEach((skill, index) => {
  const card = element("article", "skill-card");
  card.append(element("span", "skill-number", pad(index + 1)), element("p", "eyebrow", skill.label), element("h3", "", skill.title));
  const tags = element("div", "tags");
  addTags(tags, skill.items);
  card.append(tags, element("p", "", skill.note));
  $("skills-grid").append(card);
});

// Certificates without uploaded files are text cards, not broken preview buttons.
data.certificates.forEach((certificate, index) => {
  const canOpen = Boolean(safeLink(certificate.image) || safeLink(certificate.pdf));
  const card = element(canOpen ? "button" : "article", "certificate-card");
  if (canOpen) {
    card.setAttribute("aria-label", `View certificate: ${certificate.title}`);
    card.setAttribute("aria-haspopup", "dialog");
  }
  const preview = element("div", "certificate-image");
  if (safeLink(certificate.image)) {
    const image = element("img");
    image.src = safeLink(certificate.image);
    image.alt = "";
    image.loading = "lazy";
    image.addEventListener("error", () => {
      preview.replaceChildren(element("span", "mono", certificate.title));
    });
    preview.append(image);
  } else {
    preview.classList.add("certificate-text-cover");
    preview.append(element("span", "mono", "CERTIFICATION"), element("span", "certificate-initial", certificate.title.replace("IT Specialist - ", "").toUpperCase()), element("span", "mono", certificate.issuer));
  }
  const info = element("div", "certificate-info");
  const text = element("div");
  text.append(element("span", "mono", certificate.date), element("h3", "", certificate.title), element("p", "", certificate.issuer));
  info.append(text);
  if (canOpen) {
    const arrow = element("span", "cert-arrow", "↗");
    arrow.setAttribute("aria-hidden", "true");
    info.append(arrow);
  }
  card.append(preview, info);
  if (canOpen) card.addEventListener("click", () => {
    openDialog(certificate.title, "CERTIFICATE");
    if (safeLink(certificate.image)) {
      const full = element("img", "dialog-image");
      full.alt = certificate.title;
      full.src = safeLink(certificate.image);
      full.addEventListener("error", () => {
        full.replaceWith(element("p", "", "The image could not load."));
      });
      $("dialog-body").append(full);
    }
    $("dialog-body").append(element("p", "", `${certificate.issuer} · ${certificate.date}`));
    dialogLink("Open original PDF", certificate.pdf, $("dialog-body"));
  });
  $("certificate-grid").append(card);
});

// Small inline SVGs have transparent backgrounds and inherit the accent color.
function contactIcon(kind) {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("class", "contact-icon");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  const shapes = {
    email: [{ d: "M3 5h18v14H3ZM3 6l9 7 9-7" }],
    phone: [{ d: "M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2C9.6 21 3 14.4 3 5a2 2 0 0 1 2-2Z" }],
    location: [{ d: "M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" }, { d: "M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" }],
    linkedin: [{ d: "M5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM3.5 9h3v11h-3ZM10 9h3v1.5c1-2 7-2.8 7 3.5v6h-3v-5.5c0-3-4-2.8-4 .2V20h-3Z", fill: true }],
    github: [{ d: "M12 .5a12 12 0 0 0-3.79 23.38c.6.11.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.3c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z", fill: true }]
  };
  (shapes[kind] || shapes.email).forEach((shape) => {
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", shape.d);
    path.setAttribute("fill", shape.fill ? "currentColor" : "none");
    path.setAttribute("stroke", shape.fill ? "none" : "currentColor");
    path.setAttribute("stroke-width", "1.6");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.append(path);
  });
  return svg;
}

// Contact details, including the LinkedIn profile supplied in the original files.
$("contact-message").textContent = data.contact.message;
const contactOptions = [
  ["Email", data.contact.email ? `mailto:${data.contact.email}` : "", data.contact.email, "email"],
  ["Phone", data.contact.phone ? `tel:${data.contact.phone.replace(/[^+0-9]/g, "")}` : "", data.contact.phone, "phone"],
  ["GitHub", data.contact.github, data.contact.github?.replace(/^https?:\/\//, ""), "github"],
  ["LinkedIn", data.contact.linkedin, "Kristoffer Reiken Raflores", "linkedin"]
];
function makeContactCard(label, detail, kind, url) {
  const link = element(url ? "a" : "div", "contact-link spotlight-card");
  if (url) {
    link.href = safeLink(url);
    if (/^https?:/i.test(url)) { link.target = "_blank"; link.rel = "noopener noreferrer"; }
  }
  const text = element("span", "contact-link-text");
  const words = element("span", "contact-link-words");
  words.append(element("span", "contact-label", label), element("span", "contact-detail", detail));
  text.append(contactIcon(kind), words);
  link.append(text);
  if (url) {
    const arrow = element("span", "contact-arrow", "↗");
    arrow.setAttribute("aria-hidden", "true");
    link.append(arrow);
  }
  $("contact-links").append(link);
}
contactOptions.forEach(([label, url, detail, kind]) => {
  if (safeLink(url)) makeContactCard(label, detail, kind, url);
});
if (data.location) makeContactCard("Location", data.location, "location", "");

// Section indicators. Animation behavior lives separately in motion.js.
if ("IntersectionObserver" in window) {
  const navLinks = document.querySelectorAll('.section-rail a, .main-nav a');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }
    });
  }, { rootMargin: "-20% 0px -55% 0px", threshold: 0 });
  document.querySelectorAll("main > section").forEach((section) => sectionObserver.observe(section));
}
