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
            const icon = header.querySelector('i');
            const contents = section.querySelectorAll('.input-group');
            if (icon && contents.length > 0) {
                icon.addEventListener('click', () => {
                    if (icon.classList.contains('fa-minus')) {
                        icon.classList.remove('fa-minus');
                        icon.classList.add('fa-plus');
                        contents.forEach(content => content.classList.add('hidden'));
                    }
                    else {
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
    const photoInput = document.getElementById("photo");
    const photoPreviewContainer = document.getElementById("photo-preview-container");
    const photoPreview = document.getElementById("photo-preview");
    const reuploadButton = document.getElementById("reupload-photo");
    const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes
    const handlePhotoUpload = (event) => {
        const target = event.target;
        const file = target.files?.[0];
        if (file && file.size <= MAX_FILE_SIZE) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    photoPreview.src = e.target.result;
                    photoPreviewContainer.style.display = "block";
                    reuploadButton.style.display = "inline-block";
                }
            };
            reader.readAsDataURL(file);
        }
        else {
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
    const addExperienceButton = document.getElementById("add-experience");
    const experienceEntries = document.getElementById("experience-entries");
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
        const removeButton = newExperience.querySelector(".remove-experience");
        removeButton.addEventListener("click", () => {
            experienceEntries.removeChild(newExperience);
        });
    };
    addExperienceButton.addEventListener("click", addExperience);
}
function setupResumeGeneration() {
    const resumeForm = document.getElementById("resume");
    const resumeTemplate = document.getElementById("resume-template");
    resumeForm.addEventListener("submit", (event) => {
        event.preventDefault();
        // Populate resume template with form data
        const name = document.getElementById("name").value;
        const age = document.getElementById("age").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const education = document.getElementById("education").value;
        const skills = document.getElementById("skills").value;
        const about = document.getElementById("about").value;
        // Update resume template
        document.getElementById("resume-name").textContent = name;
        document.getElementById("resume-fullname").textContent = name;
        document.getElementById("resume-age").textContent = age;
        document.getElementById("resume-email").textContent = email;
        document.getElementById("resume-phone").textContent = phone;
        document.getElementById("resume-education").textContent = education;
        document.getElementById("resume-about").textContent = about;
        // Populate skills
        const skillsList = document.getElementById("resume-skills");
        skillsList.innerHTML = "";
        skills.split(",").forEach((skill) => {
            const li = document.createElement("li");
            li.textContent = skill.trim();
            skillsList.appendChild(li);
        });
        // Populate experience
        const experienceEntries = document.querySelectorAll(".experience-entry");
        const resumeExperience = document.getElementById("resume-experience");
        resumeExperience.innerHTML = "";
        experienceEntries.forEach((entry) => {
            const companyName = entry.querySelector('[name="company-name[]"]').value;
            const jobTitle = entry.querySelector('[name="job-title[]"]').value;
            const jobDuration = entry.querySelector('[name="job-duration[]"]').value;
            const jobDescription = entry.querySelector('[name="job-description[]"]').value;
            const experienceHTML = `
            <div class="experience-item">
               <h3>${jobTitle} at ${companyName}</h3>
               <p>${jobDuration}</p>
               <p>${jobDescription}</p>
            </div>
         `;
            resumeExperience.innerHTML += experienceHTML;
        });
        document.getElementById("resume-photo").src = document.getElementById("photo-preview").src;
        // Show the resume template
        resumeTemplate.style.display = "block";
        resumeForm.style.display = "none";
    });
}
export {};
