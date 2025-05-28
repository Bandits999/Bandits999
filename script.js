const galleryImages = [
    'https://scontent.fbdo1-3.fna.fbcdn.net/v/t1.6435-9/50272085_231588334386149_127582506038853632_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Ea1huilQe4YQ7kNvwGU_HL-&_nc_oc=AdlntqgV207_maLBBMqeMiI_dugbjyetuNBvwBWy8BbfeMBMP1-jSosvaPHVr8rEIQg&_nc_zt=23&_nc_ht=scontent.fbdo1-3.fna&_nc_gid=9BbvIT0kyRlV2XeLHVz2hA&oh=00_AfJtGeuE7zN0Q7JjDUqniTfl5AG25XwXqs86OqEkrN3AmQ&oe=685EBA9E',
    'https://scontent.fbdo1-2.fna.fbcdn.net/v/t1.6435-9/128403320_675927873285524_4260834285451954765_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=fAJXGuLgmqgQ7kNvwEf6sqI&_nc_oc=AdnbeZ1GUr_GF7Z10zEii0RsCgTkm8FNYX73fRpjJSe4cvFKy37C5jOeqATeyX-wmKc&_nc_zt=23&_nc_ht=scontent.fbdo1-2.fna&_nc_gid=posl3_dluZincyjD9n0rCw&oh=00_AfKWKp9umy6jcglZWzW_6TQVxwZmuy-XUWKUc32sGMvA3A&oe=685E9F21',
    'https://scontent.fbdo1-2.fna.fbcdn.net/v/t39.30808-6/468859233_1551492555729047_2674250358305419302_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=jGZQ-mZO9pcQ7kNvwH6MeQQ&_nc_oc=AdlnWEwLFLtb3Cyrg9VpKI2Ic47B-lgYh9WU2SLYxIUjtKuZaXvXl_bUUPApxlSzXp0&_nc_zt=23&_nc_ht=scontent.fbdo1-2.fna&_nc_gid=NbtvGb8nRtIe6Fw4D4GQ1w&oh=00_AfLPlLlxjo9rd7Q3V7e1EIWO5ft2Kn9xGnZtbWnBEJqcVg&oe=683CF8C6',
    'https://scontent.fbdo1-2.fna.fbcdn.net/v/t39.30808-6/489459145_1636075817270720_1776919158681055060_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=HpDdEDih7IsQ7kNvwEKFXbl&_nc_oc=AdlMed94uSxmzua73t0cxZSZtsqtxHllpU12cJ5VPxDQ-HbMNfgDM_OSz7JLb7mYPNc&_nc_zt=23&_nc_ht=scontent.fbdo1-2.fna&_nc_gid=Pv6DbIDMxsE_XKXYUA6rfw&oh=00_AfJuUVMYJn7bsK8SGqKvjBc1nk9rwsZoE6vw62ky6vrG6Q&oe=683CF814',
    'https://scontent.fbdo1-1.fna.fbcdn.net/v/t39.30808-6/469524002_1552405532304416_419858932601563702_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=lWXnDnQ4ApUQ7kNvwGmQuxo&_nc_oc=Adn8ma8GhmLxaDTKZv-OhwHYst5PVgYuDWTndww-0fSODyg1pN5owgbXxjxfqHYzj3o&_nc_zt=23&_nc_ht=scontent.fbdo1-1.fna&_nc_gid=qiLF6oZ30GHtuFD4TRrCeg&oh=00_AfKDKcjpswbWkEbkgm3hIicuGbFGhaPgBHWNUntCzxLbog&oe=683D2D88',
    'https://scontent.fbdo1-1.fna.fbcdn.net/v/t39.30808-6/435156200_1397608564450781_5655354968877659183_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=lOuSYLp9i1UQ7kNvwF8Unsn&_nc_oc=AdlPhLNc9uktg0Quoriu-wUINonDOn5MWvcdqMp9vvNQhxVnXpeF4jyr-ZLEqtHo64Y&_nc_zt=23&_nc_ht=scontent.fbdo1-1.fna&_nc_gid=mEGISyU_-aV_TZkgiHwPSQ&oh=00_AfIYwqEJBaDqH0sTcgL9ZBJG9dJcN0_91Rb0no67XcFwrA&oe=683D206B'
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