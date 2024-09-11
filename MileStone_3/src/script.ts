document.addEventListener("DOMContentLoaded", () => {
   setupSectionToggle();
   setupPhotoUpload();
   setupExperienceSection();
   setupResumeGeneration();
});

function setupSectionToggle() {
   const sections = document.querySelectorAll('.form-section');
   sections.forEach(section => {
       const header = section.querySelector('h2');
       if (header) {
           const icon = header.querySelector('i') as HTMLElement;
           const contents = section.querySelectorAll('.input-group') as NodeListOf<HTMLElement>;
           if (icon && contents.length > 0) {
               icon.addEventListener('click', () => {
                   if (icon.classList.contains('fa-minus')) {
                       icon.classList.remove('fa-minus');
                       icon.classList.add('fa-plus');
                       contents.forEach(content => content.classList.add('hidden'));
                   } else {
                       icon.classList.remove('fa-plus');
                       icon.classList.add('fa-minus');
                       contents.forEach(content => content.classList.remove('hidden'));
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
   };

   photoInput.addEventListener("change", handlePhotoUpload);
   reuploadButton.addEventListener("click", handleReupload);
}

function setupExperienceSection() {
   const addExperienceButton = document.getElementById("add-experience") as HTMLButtonElement;
   const experienceEntries = document.getElementById("experience-entries") as HTMLDivElement;

   const addExperience = () => {
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
      experienceEntries.appendChild(newExperience);

      const removeButton = newExperience.querySelector(".remove-experience") as HTMLButtonElement;
      removeButton.addEventListener("click", () => {
         experienceEntries.removeChild(newExperience);
      });
   };

   addExperienceButton.addEventListener("click", addExperience);
}

function setupResumeGeneration() {
   const resumeForm = document.getElementById("resume") as HTMLFormElement;
   const resumeTemplate = document.getElementById("resume-template") as HTMLDivElement;

   resumeForm.addEventListener("submit", (event: Event) => {
      event.preventDefault();

      // Populate resume template with form data
      const name = (document.getElementById("name") as HTMLInputElement).value;
      const age = (document.getElementById("age") as HTMLInputElement).value;
      const email = (document.getElementById("email") as HTMLInputElement).value;
      const phone = (document.getElementById("phone") as HTMLInputElement).value;
      const education = (document.getElementById("education") as HTMLTextAreaElement).value;
      const skills = (document.getElementById("skills") as HTMLTextAreaElement).value;
      const about = (document.getElementById("about") as HTMLTextAreaElement).value;

      // Update resume template
      (document.getElementById("resume-name") as HTMLHeadingElement).textContent = name;
      (document.getElementById("resume-fullname") as HTMLSpanElement).textContent = name;
      (document.getElementById("resume-age") as HTMLSpanElement).textContent = age;
      (document.getElementById("resume-email") as HTMLSpanElement).textContent = email;
      (document.getElementById("resume-phone") as HTMLSpanElement).textContent = phone;
      (document.getElementById("resume-education") as HTMLDivElement).textContent = education;
      (document.getElementById("resume-about") as HTMLDivElement).textContent = about;

      // Populate skills
      const skillsList = document.getElementById("resume-skills") as HTMLUListElement;
      skillsList.innerHTML = "";
      skills.split(",").forEach((skill) => {
         const li = document.createElement("li");
         li.textContent = skill.trim();
         skillsList.appendChild(li);
      });

      // Populate experience
      const experienceEntries = document.querySelectorAll(".experience-entry");
      const resumeExperience = document.getElementById("resume-experience") as HTMLDivElement;
      resumeExperience.innerHTML = "";
      experienceEntries.forEach((entry: Element) => {
         const companyName = (entry.querySelector('[name="company-name[]"]') as HTMLInputElement).value;
         const jobTitle = (entry.querySelector('[name="job-title[]"]') as HTMLInputElement).value;
         const jobDuration = (entry.querySelector('[name="job-duration[]"]') as HTMLInputElement).value;
         const jobDescription = (entry.querySelector('[name="job-description[]"]') as HTMLTextAreaElement).value;

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

      // Show the resume template
      resumeTemplate.style.display = "block";
      resumeForm.style.display = "none";
   });
}
