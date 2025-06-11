const galleryImages = [
    'img/bandits999-1.jpg',
    'img/bandits999-3.jpg',
    'img/bandits999-2.jpg'
  ];
  const galleryGrid = document.getElementById('galleryGrid');
  galleryImages.forEach(src => {
    const div = document.createElement('div');
    div.className = 'post aspect-square overflow-hidden rounded-lg cursor-pointer relative group';

    // Create the actual image element, initially blurred
    const img = document.createElement('img');
    img.src = src;
    img.className = 'w-full h-full object-cover blurred-image'; // Apply blurred-image class
    img.loading = 'lazy';

    // Append image to the div
    div.appendChild(img);

    // Add click event listener to the div
    div.onclick = () => {
      // Toggle the revealed class to remove blur
      img.classList.toggle('revealed');
      // Open the preview modal after showing the image
      openPreview(src);
    };

    galleryGrid.appendChild(div);
  });

  function openPreview(src) {
    document.getElementById('previewImg').src = src;
    document.getElementById('imagePreviewModal').classList.remove('hidden');
  }

  function closePreview() {
    document.getElementById('imagePreviewModal').classList.add('hidden');
    document.getElementById('previewImg').src = '';
    // Re-apply blur to all images when modal is closed
    document.querySelectorAll('.blurred-image').forEach(img => {
      img.classList.remove('revealed');
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closePreview();
  });