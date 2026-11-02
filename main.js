const translations = {
  "en-US": {
    skip: "Skip to content", workflowNav: "Workflow", privacyNav: "Local-first", detailsNav: "Image details", releaseNav: "Preview releases",
    eyebrow: "LOCAL INDEX · TECHNICAL PREVIEW", headline: "Find the screenshot by what it shows.", intro: "ShotDesk reads your chosen screenshots on your device, then lets you search the words, image details, and colors you remember.", primaryCta: "Explore preview releases", secondaryCta: "Trace one image", proofOne: "Chosen folders only", proofTwo: "SQLite FTS5", proofThree: "No image uploads",
    pipelineTitle: "A screenshot, indexed locally", syntheticLabel: "Illustrative sample", localFile: "Original stays in its folder", stepOneTitle: "Image facts", stepOneBody: "1919 × 1031 · ratio · embedded EXIF", stepTwoTitle: "Color palette", stepTwoBody: "Blue · gray · white", stepThreeTitle: "Text recognition", stepThreeBody: "PP-OCRv6 · ONNX · on demand", resultLabel: "SEARCH RESULT", resultText: "“Q4 review” finds this capture", pipelineFoot: "After model setup, indexing works offline.",
    workflowEyebrow: "THE INDEXING PATH", workflowTitle: "A useful index, not another place to upload.", workflowIntro: "ShotDesk keeps a reference to each original file and builds a separate local index for the things you want to find.", workflowA: "Choose folders", workflowABody: "Only folders you select enter the library. Originals stay where they are.", workflowB: "Analyze images", workflowBBody: "Dimensions, available EXIF fields, and dominant colors are read locally. GPS is not stored.", workflowC: "Search what you recall", workflowCBody: "Find captures by filename, folder, OCR text, or color names in English and French.",
    detailsEyebrow: "WHAT THE LOCAL INDEX STORES", detailsTitle: "Useful facts, kept close to the image.", detailsNote: "EXIF fields are optional; many screenshots have none.", tableField: "Field", tableSource: "Source", tableUse: "Useful for", rowDimensions: "Dimensions & ratio", rowDimensionsUse: "Identifying screen size and orientation", rowExifUse: "Camera facts and resolution, when present", rowColors: "Dominant colors", rowColorsUse: "Searchable color names and palette chips", rowText: "Recognized text", rowTextUse: "Search text within the screenshot", rowSearch: "Search index", rowSearchUse: "Names, paths, text, and color aliases",
    privacyStamp: "LOCAL BY DESIGN", privacyEyebrow: "YOUR SCREENSHOTS STAY YOURS", privacyTitle: "No account. No upload. No moved originals.", privacyBody: "The SQLite library, thumbnails, collection membership, and OCR results are stored on this device. OCR models download only when you enable text search; after setup, recognition can run offline.", privacyOne: "Images are never sent to a cloud service.", privacyTwo: "GPS coordinates are not stored.", privacyThree: "Remove a folder from the index without deleting its files.",
    releaseEyebrow: "EARLY PREVIEW", releaseTitle: "Follow the build as ShotDesk grows.", releaseBody: "Check the release page for installers, platform notes, known issues, and the changelog for each preview.", releaseCta: "View preview releases", sourceCta: "Read the source", footer: "A local-first screenshot library · Windows and Linux targets",
  },
  "fr-FR": {
    skip: "Aller au contenu", workflowNav: "Fonctionnement", privacyNav: "Traitement local", detailsNav: "Détails des images", releaseNav: "Préversions",
    eyebrow: "INDEX LOCAL · APERÇU TECHNIQUE", headline: "Retrouvez une capture par ce qu’elle montre.", intro: "ShotDesk analyse les captures choisies sur votre appareil, puis permet de chercher les mots, détails et couleurs dont vous vous souvenez.", primaryCta: "Voir les préversions", secondaryCta: "Suivre une image", proofOne: "Dossiers choisis", proofTwo: "SQLite FTS5", proofThree: "Aucun envoi d’image",
    pipelineTitle: "Une capture, indexée localement", syntheticLabel: "Exemple illustratif", localFile: "L’original reste dans son dossier", stepOneTitle: "Détails de l’image", stepOneBody: "1919 × 1031 · ratio · EXIF intégré", stepTwoTitle: "Palette de couleurs", stepTwoBody: "Bleu · gris · blanc", stepThreeTitle: "Reconnaissance de texte", stepThreeBody: "PP-OCRv6 · ONNX · à la demande", resultLabel: "RÉSULTAT DE RECHERCHE", resultText: "« revue Q4 » retrouve cette capture", pipelineFoot: "Après installation des modèles, l’indexation fonctionne hors ligne.",
    workflowEyebrow: "ÉTAPES DE L’INDEXATION", workflowTitle: "Un index utile, pas un nouvel endroit où envoyer vos images.", workflowIntro: "ShotDesk conserve une référence vers chaque original et crée un index local distinct pour retrouver ce que vous cherchez.", workflowA: "Choisissez vos dossiers", workflowABody: "Seuls les dossiers sélectionnés entrent dans la bibliothèque. Les originaux restent à leur place.", workflowB: "Analysez les images", workflowBBody: "Dimensions, EXIF disponibles et couleurs dominantes sont lus localement. Les coordonnées GPS ne sont pas stockées.", workflowC: "Cherchez ce dont vous vous souvenez", workflowCBody: "Retrouvez une capture par son nom, son dossier, son texte OCR ou ses couleurs, en français et en anglais.",
    detailsEyebrow: "DONNÉES DE L’INDEX LOCAL", detailsTitle: "Des informations utiles, près de l’image.", detailsNote: "Les champs EXIF sont facultatifs ; beaucoup de captures n’en contiennent pas.", tableField: "Donnée", tableSource: "Source", tableUse: "Utilité", rowDimensions: "Dimensions et ratio", rowDimensionsUse: "Repérer la taille et l’orientation de l’image", rowExifUse: "Appareil et résolution, si les données existent", rowColors: "Couleurs dominantes", rowColorsUse: "Noms de couleurs recherchables et palette", rowText: "Texte reconnu", rowTextUse: "Chercher du texte visible dans la capture", rowSearch: "Index de recherche", rowSearchUse: "Noms, chemins, texte et alias de couleurs",
    privacyStamp: "LOCAL PAR CONCEPTION", privacyEyebrow: "VOS CAPTURES RESTENT LES VÔTRES", privacyTitle: "Pas de compte. Pas d’envoi. Aucun original déplacé.", privacyBody: "La bibliothèque SQLite, les miniatures, les collections et les résultats OCR sont stockés sur cet appareil. Les modèles OCR sont téléchargés uniquement si vous activez la recherche par texte ; après leur installation, la reconnaissance fonctionne hors ligne.", privacyOne: "Aucune image n’est envoyée dans le cloud.", privacyTwo: "Les coordonnées GPS ne sont pas stockées.", privacyThree: "Retirez un dossier de l’index sans supprimer ses fichiers.",
    releaseEyebrow: "PRÉVERSION", releaseTitle: "Suivez l’évolution de ShotDesk.", releaseBody: "La page des versions présente les installateurs, les plateformes, les problèmes connus et le changelog de chaque préversion.", releaseCta: "Voir les préversions", sourceCta: "Consulter le code", footer: "Une bibliothèque de captures locale · cibles Windows et Linux",
  },
};

const languageButton = document.querySelector("#languageToggle");
let locale = "en-US";
try {
  locale = localStorage.getItem("shotdesk-site-locale") || "en-US";
} catch {
  // The language toggle remains usable if browser storage is disabled.
}

function applyLocale(nextLocale) {
  locale = nextLocale;
  try {
    localStorage.setItem("shotdesk-site-locale", locale);
  } catch {
    // Translation still changes for the current visit.
  }
  document.documentElement.lang = locale;
  for (const element of document.querySelectorAll("[data-copy]")) {
    const key = element.dataset.copy;
    if (translations[locale][key]) element.textContent = translations[locale][key];
  }
  languageButton.textContent = locale === "en-US" ? "FR" : "EN";
  languageButton.setAttribute("aria-label", locale === "en-US" ? "Passer en français" : "Switch to English");
}

languageButton.addEventListener("click", () => applyLocale(locale === "en-US" ? "fr-FR" : "en-US"));
applyLocale(locale);
