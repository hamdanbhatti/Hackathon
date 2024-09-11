declare global {
   interface Window {
      jspdf: any;
   }
}

document.addEventListener("DOMContentLoaded", () => {
   setupSectionToggle();
   setupPhotoUpload();
   setupExperienceSection();
   setupResumeGeneration();
   setupPDFDownload();
});

function setupSectionToggle() {
   const sections = document.querySelectorAll(".form-section");
   sections.forEach((section) => {
      const header = section.querySelector("h2");
      if (header) {
         const icon = header.querySelector("i") as HTMLElement;
         const contents = section.querySelectorAll(
            ".input-group",
         ) as NodeListOf<HTMLElement>;
         if (icon && contents.length > 0) {
            icon.addEventListener("click", () => {
               if (icon.classList.contains("fa-minus")) {
                  icon.classList.remove("fa-minus");
                  icon.classList.add("fa-plus");
                  contents.forEach((content) =>
                     content.classList.add("hidden"),
                  );
               } else {
                  icon.classList.remove("fa-plus");
                  icon.classList.add("fa-minus");
                  contents.forEach((content) =>
                     content.classList.remove("hidden"),
                  );
               }
            });
         }
      }
   });
}

function setupPhotoUpload() {
   const photoInput = document.getElementById("photo") as HTMLInputElement;
   const photoPreviewContainer = document.getElementById("photo-preview-container") as HTMLDivElement;
   const photoPreview = document.getElementById("photo-preview") as HTMLImageElement;
   const reuploadButton = document.getElementById("reupload-photo") as HTMLButtonElement;
   const fileLabel = document.querySelector('.custom-file-upload') as HTMLLabelElement;

   const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes

   const handlePhotoUpload = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file && file.size <= MAX_FILE_SIZE) {
         const reader = new FileReader();
         reader.onload = (e: ProgressEvent<FileReader>) => {
            if (e.target?.result) {
               photoPreview.src = e.target.result as string;
               photoPreviewContainer.style.display = "block";
               reuploadButton.style.display = "inline-block";
               fileLabel.style.display = "none"; // Hide the upload button
            }
         };
         reader.readAsDataURL(file);
      } else {
         alert("Please upload an image file of 1MB or less in size.");
         target.value = "";
      }
   };

   const handleReupload = () => {
      photoInput.click();
      // Remove this line to prevent showing the upload button again
      // fileLabel.style.display = "inline-block";
   };

   photoInput.addEventListener("change", handlePhotoUpload);
   reuploadButton.addEventListener("click", handleReupload);

   fileLabel.addEventListener('click', (event) => {
       event.preventDefault();
       photoInput.click();
   });
}




function setupExperienceSection() {
   const addExperienceButton = document.getElementById(
      "add-experience",
   ) as HTMLButtonElement;
   const experienceEntries = document.getElementById(
      "experience-entries",
   ) as HTMLDivElement;

   const addExperience = () => {
      const newExperience = createExperienceEntry();
      experienceEntries.appendChild(newExperience);
   };

   addExperienceButton.addEventListener("click", addExperience);
}

function createExperienceEntry(): HTMLDivElement {
   const newExperience = document.createElement("div");
   newExperience.className = "experience-entry";
   newExperience.innerHTML = `
       <div class="input-group">
          <label for="company-name">Company Name</label>
          <input type="text" name="company-name[]" required>
       </div>
       <div class="input-group">
          <label for="job-title">Position</label>
          <input type="text" name="job-title[]" required>
       </div>
       <div class="input-group">
          <label for="job-duration">Duration</label>
          <input type="text" name="job-duration[]" required>
       </div>
       <div class="input-group">
          <label for="job-description">Job Description</label>
          <textarea name="job-description[]" rows="4" required></textarea>
       </div>
       <button type="button" class="remove-experience">Remove</button>
    `;

   const removeButton = newExperience.querySelector(
      ".remove-experience",
   ) as HTMLButtonElement;
   removeButton.addEventListener("click", () => {
      newExperience.remove();
   });

   return newExperience;
}

function setupResumeGeneration() {
   const resumeForm = document.getElementById("resume") as HTMLFormElement;
   const resumeTemplate = document.getElementById(
      "resume-template",
   ) as HTMLDivElement;
   const editResumeButton = document.getElementById(
      "edit-resume",
   ) as HTMLButtonElement;

   resumeForm.addEventListener("submit", (event: Event) => {
      event.preventDefault();
      updateResumeTemplate();
      showResumeTemplate();
   });

   editResumeButton.addEventListener("click", () => {
      populateFormWithResumeData();
      showResumeForm();
   });
}

function updateResumeTemplate() {
   const name = (document.getElementById("name") as HTMLInputElement).value;
   const age = (document.getElementById("age") as HTMLInputElement).value;
   const email = (document.getElementById("email") as HTMLInputElement).value;
   const phone = (document.getElementById("phone") as HTMLInputElement).value;
   const education = (
      document.getElementById("education") as HTMLTextAreaElement
   ).value;
   const skills = (document.getElementById("skills") as HTMLTextAreaElement)
      .value;
   const about = (document.getElementById("about") as HTMLTextAreaElement)
      .value;

   (document.getElementById("resume-name") as HTMLHeadingElement).textContent =
      name;
   (document.getElementById("resume-fullname") as HTMLSpanElement).textContent =
      name;
   (document.getElementById("resume-age") as HTMLSpanElement).textContent = age;
   (document.getElementById("resume-email") as HTMLSpanElement).textContent =
      email;
   (document.getElementById("resume-phone") as HTMLSpanElement).textContent =
      phone;
   (document.getElementById("resume-education") as HTMLDivElement).textContent =
      education;
   (document.getElementById("resume-about") as HTMLDivElement).textContent =
      about;

   const skillsList = document.getElementById(
      "resume-skills",
   ) as HTMLUListElement;
   skillsList.innerHTML = "";
   skills.split(",").forEach((skill) => {
      const li = document.createElement("li");
      li.textContent = skill.trim();
      skillsList.appendChild(li);
   });

   const experienceEntries = document.querySelectorAll(".experience-entry");
   const resumeExperience = document.getElementById(
      "resume-experience",
   ) as HTMLDivElement;
   resumeExperience.innerHTML = "";
   experienceEntries.forEach((entry: Element) => {
      const companyName = (
         entry.querySelector('[name="company-name[]"]') as HTMLInputElement
      ).value;
      const jobTitle = (
         entry.querySelector('[name="job-title[]"]') as HTMLInputElement
      ).value;
      const jobDuration = (
         entry.querySelector('[name="job-duration[]"]') as HTMLInputElement
      ).value;
      const jobDescription = (
         entry.querySelector(
            '[name="job-description[]"]',
         ) as HTMLTextAreaElement
      ).value;

      const experienceHTML = `
          <div class="experience-item">
             <h3>${jobTitle} at ${companyName}</h3>
             <p>${jobDuration}</p>
             <p>${jobDescription}</p>
          </div>
       `;
      resumeExperience.innerHTML += experienceHTML;
   });

   (document.getElementById("resume-photo") as HTMLImageElement).src = (
      document.getElementById("photo-preview") as HTMLImageElement
   ).src;
}

function showResumeTemplate() {
   const resumeTemplate = document.getElementById(
      "resume-template",
   ) as HTMLDivElement;
   const resumeForm = document.getElementById("resume") as HTMLFormElement;
   resumeTemplate.style.display = "block";
   resumeForm.style.display = "none";
}

function showResumeForm() {
   const resumeTemplate = document.getElementById(
      "resume-template",
   ) as HTMLDivElement;
   const resumeForm = document.getElementById("resume") as HTMLFormElement;
   resumeTemplate.style.display = "none";
   resumeForm.style.display = "block";
}

function populateFormWithResumeData() {
   (document.getElementById("name") as HTMLInputElement).value =
      (document.getElementById("resume-name") as HTMLHeadingElement)
         .textContent || "";
   (document.getElementById("age") as HTMLInputElement).value =
      (document.getElementById("resume-age") as HTMLSpanElement).textContent ||
      "";
   (document.getElementById("email") as HTMLInputElement).value =
      (document.getElementById("resume-email") as HTMLSpanElement)
         .textContent || "";
   (document.getElementById("phone") as HTMLInputElement).value =
      (document.getElementById("resume-phone") as HTMLSpanElement)
         .textContent || "";
   (document.getElementById("education") as HTMLTextAreaElement).value =
      (document.getElementById("resume-education") as HTMLDivElement)
         .textContent || "";
   (document.getElementById("about") as HTMLTextAreaElement).value =
      (document.getElementById("resume-about") as HTMLDivElement).textContent ||
      "";

   const skillsList = document.getElementById(
      "resume-skills",
   ) as HTMLUListElement;
   const skills = Array.from(skillsList.children)
      .map((li) => li.textContent)
      .join(", ");
   (document.getElementById("skills") as HTMLTextAreaElement).value = skills;

   const experienceEntries = document.getElementById(
      "experience-entries",
   ) as HTMLDivElement;
   experienceEntries.innerHTML = "";
   const resumeExperience = document.getElementById(
      "resume-experience",
   ) as HTMLDivElement;
   Array.from(resumeExperience.children).forEach((expItem: Element) => {
      const newExperience = createExperienceEntry();
      const [company, title] = (
         expItem.querySelector("h3") as HTMLHeadingElement
      ).textContent?.split(" at ") || ["", ""];
      const duration =
         (expItem.querySelector("p:first-of-type") as HTMLParagraphElement)
            .textContent || "";
      const description =
         (expItem.querySelector("p:last-of-type") as HTMLParagraphElement)
            .textContent || "";

      (
         newExperience.querySelector(
            '[name="company-name[]"]',
         ) as HTMLInputElement
      ).value = company;
      (
         newExperience.querySelector('[name="job-title[]"]') as HTMLInputElement
      ).value = title;
      (
         newExperience.querySelector(
            '[name="job-duration[]"]',
         ) as HTMLInputElement
      ).value = duration;
      (
         newExperience.querySelector(
            '[name="job-description[]"]',
         ) as HTMLTextAreaElement
      ).value = description;

      experienceEntries.appendChild(newExperience);
   });
}

function setupPDFDownload() {
   const downloadPDFButton = document.getElementById('download-pdf') as HTMLButtonElement;
   
   downloadPDFButton.addEventListener('click', () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('p', 'mm', 'a4');
      
      const resumeTemplate = document.getElementById('resume-template') as HTMLDivElement;
      const buttons = resumeTemplate.querySelectorAll('button');
      
      // Hide buttons before generating PDF
      buttons.forEach(button => button.style.display = 'none');
      
      doc.html(resumeTemplate, {
         callback: function (doc:any) {
            doc.save('resume.pdf');
            // Show buttons again after PDF generation
            buttons.forEach(button => button.style.display = '');
         },
         x: 15,
         y: 15,
         width: 180,
         windowWidth: 1000
      });
   });
}

