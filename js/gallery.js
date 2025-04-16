// Improved gallery.js
document.addEventListener("DOMContentLoaded", function () {
    const galleryContainer = document.getElementById("viz-gallery");
    const modal = document.getElementById("viz-modal");
    const modalImg = document.getElementById("modal-image");
    const modalCaption = document.getElementById("modal-caption");
    const closeModal = document.querySelector(".close");
    const filterButtons = document.querySelectorAll("#viz-filter-container button");
  
    // Fetch gallery data
    fetch("data/data_gallery_info.json")
      .then(response => response.json())
      .then(data => {
        renderGallery(data);
  
        // Setup filter functionality
        filterButtons.forEach(btn => {
          btn.addEventListener("click", function () {
            const selectedType = this.getAttribute("data-type");
            
            // Update active button state
            filterButtons.forEach(b => b.classList.remove("active-filter"));
            this.classList.add("active-filter");
  
            // Filter and re-render the gallery
            const filtered = selectedType === "All"
              ? data
              : data.filter(d => d.visualization_type === selectedType);
            
            renderGallery(filtered);
          });
        });
      })
      .catch(error => {
        console.error("❌ Error loading gallery data:", error);
        galleryContainer.innerHTML = "<p class='error-message'>⚠️ Failed to load gallery data.</p>";
      });
  
    function renderGallery(data) {
      // Clear previous content
      galleryContainer.innerHTML = "";
  
      if (data.length === 0) {
        galleryContainer.innerHTML = "<p class='no-results'>No visualizations match the selected filter.</p>";
        return;
      }
  
      // Create gallery items
      data.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("viz-card");
        
        // Build card HTML
        card.innerHTML = `
          <div class="viz-thumb-container">
            <img src="${item.path}" class="viz-thumb" alt="${item.title || 'Gallery image'}">
          </div>
          <div class="viz-info">
            <h3 class="viz-title">${item.title}</h3>
            <div class="viz-type">${item.visualization_type}</div>
          </div>
        `;
  
        // Setup modal interaction
        card.addEventListener("click", () => {
          openModal(item);
        });
  
        galleryContainer.appendChild(card);
      });
    }
  
    function openModal(item) {
      modal.style.display = "block";
      modalImg.src = item.path;
      modalImg.alt = item.title || "Enlarged visualization";
  
      // Set modal content
      modalCaption.innerHTML = `
        <h3 class="modal-title">${item.title}</h3>
        <div class="modal-metadata">
          <p><strong>Type:</strong> ${item.visualization_type}</p>
          <p><strong>Summary:</strong> ${item.summary}</p>
          <p><strong>Interpretation:</strong> ${item.interpretation}</p>
        </div>
        <div class="modal-actions">
          <a href="${item.path}" download class="download-btn">
            ⬇️ Download Image
          </a>
        </div>
      `;
  
      document.body.style.overflow = "hidden";
    }
  
    // Close modal handlers
    closeModal.onclick = function () {
      closeModalDialog();
    };
  
    window.onclick = function (event) {
      if (event.target === modal) {
        closeModalDialog();
      }
    };
  
    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.style.display === "block") {
        closeModalDialog();
      }
    });
  
    function closeModalDialog() {
      modal.style.display = "none";
      modalImg.src = "";
      modalCaption.innerHTML = "";
      document.body.style.overflow = "auto";
    }
  });