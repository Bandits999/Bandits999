document.addEventListener('DOMContentLoaded', function () {
  const addMaterialBtn = document.getElementById('addMaterialBtn');
  const materialsContainer = document.getElementById('materialsContainer');
  const emptyState = document.getElementById('emptyState');
  const resultsSection = document.getElementById('resultsSection');
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsPanel = document.getElementById('settingsPanel');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const currencySelect = document.getElementById('currencySelect');
  const defaultCategorySelect = document.getElementById('defaultCategorySelect');
  // Export buttons removed as per user request
  const saveBtn = document.getElementById('saveBtn');
  const loadSavedBtn = document.getElementById('loadSavedBtn');

  let materialCount = 0;
  let materialsData = [];

  // Load settings from localStorage
  loadSettings();

  // Add first material input by default
  addMaterialInput();

  // Event listeners
  addMaterialBtn.addEventListener('click', addMaterialInput);
  settingsBtn.addEventListener('click', toggleSettings);
  closeSettingsBtn.addEventListener('click', toggleSettings);
  currencySelect.addEventListener('change', updateCurrency);
  // Export event listeners removed as per user request
  saveBtn.addEventListener('click', saveMaterials);
  loadSavedBtn.addEventListener('click', loadMaterials);

  // Settings functions
  function toggleSettings() {
    settingsPanel.classList.toggle('hidden');
  }

  function loadSettings() {
    // Load currency setting
    const savedCurrency = localStorage.getItem('materialCalcCurrency');
    if (savedCurrency) {
      currencySelect.value = savedCurrency;
    }

    // Load default category
    const savedCategory = localStorage.getItem('materialCalcDefaultCategory');
    if (savedCategory) {
      defaultCategorySelect.value = savedCategory;
    }
  }

  function saveSettings() {
    localStorage.setItem('materialCalcCurrency', currencySelect.value);
    localStorage.setItem('materialCalcDefaultCategory', defaultCategorySelect.value);
  }

  function updateCurrency() {
    const currencySymbol = currencySelect.value;
    document.querySelectorAll('.currency-symbol').forEach(span => {
      span.textContent = currencySymbol;
    });
    saveSettings();
    calculateTotals();
  }

  function addMaterialInput() {
    materialCount++;
    emptyState.classList.add('hidden');

    const materialDiv = document.createElement('div');
    materialDiv.className = 'material-input mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50 fade-in';

    // Get the default category if set
    const defaultCategory = document.getElementById('defaultCategorySelect')?.value || '';

    // Get the current currency
    const currencySymbol = document.getElementById('currencySelect')?.value || 'g';

    materialDiv.innerHTML = `
            <div class="flex flex-col gap-4">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex-1">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Material Name</label>
                        <input type="text" class="material-name w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Banana">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select class="material-category w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option value="" ${defaultCategory === '' ? 'selected' : ''}>None</option>
                            <option value="Fabric" ${defaultCategory === 'Fabric' ? 'selected' : ''}>Fabric</option>
                            <option value="Metal" ${defaultCategory === 'Metal' ? 'selected' : ''}>Metal</option>
                            <option value="Wood" ${defaultCategory === 'Wood' ? 'selected' : ''}>Wood</option>
                            <option value="Leather" ${defaultCategory === 'Leather' ? 'selected' : ''}>Leather</option>
                            <option value="Gems" ${defaultCategory === 'Gems' ? 'selected' : ''}>Gems</option>
                            <option value="Other" ${defaultCategory === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="md:w-1/3">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input type="text" value="1" class="material-quantity w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                    </div>
                    <div class="md:w-1/3">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                        <div class="relative">
                            <input type="text" value="0,00" class="material-price w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <span class="currency-symbol absolute right-3 top-2 text-gray-500">${currencySymbol}</span>
                        </div>
                    </div>
                    <div class="md:w-1/3 flex items-end">
                        <button class="remove-material bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-md transition-all w-full">
                            <i class="fas fa-trash mr-2"></i> Remove
                        </button>
                    </div>
                </div>
            </div>
        `;

    materialsContainer.appendChild(materialDiv);

    // Add event to the remove button
    const removeBtn = materialDiv.querySelector('.remove-material');
    removeBtn.addEventListener('click', function () {
      materialDiv.classList.add('hidden');
      setTimeout(() => {
        materialDiv.remove();
        materialCount--;
        if (materialCount === 0) {
          emptyState.classList.remove('hidden');
          resultsSection.classList.add('hidden');
        } else {
          calculateTotals();
        }
      }, 300);
    });

    // Format number inputs
    const quantityInput = materialDiv.querySelector('.material-quantity');
    const priceInput = materialDiv.querySelector('.material-price');

    // Format quantity input
    quantityInput.addEventListener('blur', function () {
      // Replace comma with dot for parsing, then format back with comma
      const value = this.value.replace(',', '.');
      if (!isNaN(value) && value !== '') {
        this.value = formatNumber(parseFloat(value) || 0);
      }
      calculateTotals();
    });
    
    // Allow only numbers and comma in quantity input
    quantityInput.addEventListener('input', function(e) {
      const value = e.target.value;
      // Only allow digits, comma, and dot
      if (!/^\d*[,.]?\d*$/.test(value)) {
        // Remove any non-numeric characters except comma and dot
        this.value = value.replace(/[^\d,.]/g, '');
        // Ensure only one decimal separator
        this.value = this.value.replace(/([,.])[,.]+/g, '$1');
      }
    });

    // Format price input
    priceInput.addEventListener('blur', function () {
      // Replace comma with dot for parsing, then format back with comma
      const value = this.value.replace(',', '.');
      if (!isNaN(value) && value !== '') {
        this.value = formatNumber(parseFloat(value) || 0);
      }
      calculateTotals();
    });
    
    // Allow only numbers and comma in price input
    priceInput.addEventListener('input', function(e) {
      const value = e.target.value;
      // Only allow digits, comma, and dot
      if (!/^\d*[,.]?\d*$/.test(value)) {
        // Remove any non-numeric characters except comma and dot
        this.value = value.replace(/[^\d,.]/g, '');
        // Ensure only one decimal separator
        this.value = this.value.replace(/([,.])([,.]+)/g, '$1');
      }
      
      // Handle leading zeros for decimal values (like 032 -> 0,32)
      if (/^0\d+$/.test(this.value) && !this.value.includes(',') && !this.value.includes('.')) {
        // If input starts with 0 followed by digits (like 032) and doesn't already have a decimal separator
        // Convert to decimal format with comma (0,32)
        this.value = this.value.replace(/^0(\d+)$/, '0,$1');
      }
      
      // Also handle multi-digit numbers with leading zeros (like 00123)
      if (/^0{2,}\d+$/.test(this.value) && !this.value.includes(',') && !this.value.includes('.')) {
        // If input starts with multiple zeros followed by digits
        // Convert to decimal format with comma
        this.value = this.value.replace(/^(0+)(\d+)$/, '0,$2');
      }
    });

    // Add input event listeners for calculation
    const inputs = materialDiv.querySelectorAll('.material-quantity, .material-price');
    inputs.forEach(input => {
      input.addEventListener('input', calculateTotals);
    });

    // Focus on the new material name input
    materialDiv.querySelector('.material-name').focus();

    // Calculate totals if this isn't the first input
    if (materialCount > 1) {
      calculateTotals();
    }
  }

  function formatNumber(num) {
    // Format number with comma as decimal separator
    // First convert to string with 2 decimal places if it's a float
    let numStr = typeof num === 'number' && num % 1 !== 0 ? num.toFixed(2) : num.toString();
    // Replace dot with comma for decimal separator
    return numStr.replace('.', ',');
  }

  function parseInputValue(value) {
    // Replace comma with dot for proper float parsing
    return parseFloat(value.replace(',', '.')) || 0;
  }

  function calculateTotals() {
    const materialInputs = document.querySelectorAll('.material-input:not(.hidden)');
    let totalMaterials = 0;
    let totalCost = 0;
    materialsData = [];
    const currencySymbol = currencySelect.value;

    // Category totals
    const categoryTotals = {};
    const categoryQuantities = {};

    materialInputs.forEach(input => {
      const name = input.querySelector('.material-name').value || 'Unnamed Material';
      const category = input.querySelector('.material-category').value || 'Uncategorized';
      const quantity = parseInputValue(input.querySelector('.material-quantity').value);
      const price = parseInputValue(input.querySelector('.material-price').value);
      const materialTotal = quantity * price;

      totalMaterials += quantity;
      totalCost += materialTotal;

      // Update category totals
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
        categoryQuantities[category] = 0;
      }
      categoryTotals[category] += materialTotal;
      categoryQuantities[category] += quantity;

      materialsData.push({
        name,
        category,
        quantity,
        price,
        total: materialTotal
      });
    });

    // Update summary
    document.getElementById('totalMaterials').textContent = formatNumber(totalMaterials);
    document.getElementById('totalCost').textContent = formatNumber(totalCost.toFixed(2));
    document.getElementById('averageCost').textContent = totalMaterials > 0 ? formatNumber((totalCost / totalMaterials).toFixed(2)) : '0,00';

    // Update category breakdown
    updateCategoryBreakdown(categoryTotals, categoryQuantities, totalCost);

    // Update results table
    const resultsTable = document.getElementById('resultsTable');
    resultsTable.innerHTML = '';

    materialsData.forEach(material => {
      const row = document.createElement('tr');
      row.className = 'hover:bg-gray-50';
      row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${material.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${material.category}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatNumber(material.quantity)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatNumber(material.price.toFixed(2))} ${currencySymbol}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${formatNumber(material.total.toFixed(2))} ${currencySymbol}</td>
            `;
      resultsTable.appendChild(row);
    });

    // Show results section if there are materials
    if (materialCount > 0) {
      resultsSection.classList.remove('hidden');
      setTimeout(() => {
        resultsSection.classList.add('glow');
        setTimeout(() => {
          resultsSection.classList.remove('glow');
        }, 1000);
      }, 10);
    }
  }

  // Update category breakdown visualization
  function updateCategoryBreakdown(categoryTotals, categoryQuantities, totalCost) {
    const categoryBreakdown = document.getElementById('categoryBreakdown');
    const categoryCharts = document.getElementById('categoryCharts');

    // Only show if we have categories
    if (Object.keys(categoryTotals).length === 0) {
      categoryBreakdown.classList.add('hidden');
      return;
    }

    categoryBreakdown.classList.remove('hidden');
    categoryCharts.innerHTML = '';

    // Create cost breakdown
    const costBreakdownDiv = document.createElement('div');
    costBreakdownDiv.className = 'bg-white p-4 rounded-lg border border-gray-200';
    costBreakdownDiv.innerHTML = `<h4 class="text-sm font-medium text-gray-700 mb-3">Cost by Category</h4>`;

    const costChartDiv = document.createElement('div');
    costChartDiv.className = 'space-y-2';

    // Create quantity breakdown
    const quantityBreakdownDiv = document.createElement('div');
    quantityBreakdownDiv.className = 'bg-white p-4 rounded-lg border border-gray-200';
    quantityBreakdownDiv.innerHTML = `<h4 class="text-sm font-medium text-gray-700 mb-3">Quantity by Category</h4>`;

    const quantityChartDiv = document.createElement('div');
    quantityChartDiv.className = 'space-y-2';

    // Generate bar charts
    Object.keys(categoryTotals).forEach(category => {
      const costPercentage = (categoryTotals[category] / totalCost * 100).toFixed(1);
      const costBar = document.createElement('div');
      costBar.className = 'relative pt-1';
      costBar.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="text-xs font-semibold text-gray-700">${category}</div>
                    <div class="text-xs font-semibold text-gray-700">${formatNumber(categoryTotals[category].toFixed(2))} (${costPercentage}%)</div>
                </div>
                <div class="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                    <div style="width:${costPercentage}%" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
                </div>
            `;
      costChartDiv.appendChild(costBar);

      const totalQuantity = Object.values(categoryQuantities).reduce((a, b) => a + b, 0);
      const quantityPercentage = (categoryQuantities[category] / totalQuantity * 100).toFixed(1);
      const quantityBar = document.createElement('div');
      quantityBar.className = 'relative pt-1';
      quantityBar.innerHTML = `
                <div class="flex items-center justify-between">
                    <div class="text-xs font-semibold text-gray-700">${category}</div>
                    <div class="text-xs font-semibold text-gray-700">${formatNumber(categoryQuantities[category])} (${quantityPercentage}%)</div>
                </div>
                <div class="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                    <div style="width:${quantityPercentage}%" class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                </div>
            `;
      quantityChartDiv.appendChild(quantityBar);
    });

    costBreakdownDiv.appendChild(costChartDiv);
    quantityBreakdownDiv.appendChild(quantityChartDiv);

    categoryCharts.appendChild(costBreakdownDiv);
    categoryCharts.appendChild(quantityBreakdownDiv);
  }

  // Local Storage Functions
  function saveMaterials() {
    if (materialsData.length === 0) {
      alert('No materials to save!');
      return;
    }

    // Save materials data and currency setting
    const dataToSave = {
      materials: materialsData,
      currency: currencySelect.value,
      defaultCategory: defaultCategorySelect.value
    };

    localStorage.setItem('materialCalcData', JSON.stringify(dataToSave));

    // Show confirmation
    saveBtn.innerHTML = '<i class="fas fa-check mr-2"></i> Saved!';
    setTimeout(() => {
      saveBtn.innerHTML = '<i class="fas fa-save mr-2"></i> Save';
    }, 2000);
  }

  function loadMaterials() {
    const savedData = localStorage.getItem('materialCalcData');
    if (!savedData) {
      alert('No saved materials found!');
      return;
    }

    try {
      const savedDataObj = JSON.parse(savedData);
      const savedMaterials = savedDataObj.materials || savedDataObj; // Handle both new and old format

      // Restore settings if available in saved data
      if (savedDataObj.currency) {
        currencySelect.value = savedDataObj.currency;
        updateCurrency();
      }

      if (savedDataObj.defaultCategory) {
        defaultCategorySelect.value = savedDataObj.defaultCategory;
        saveSettings();
      }

      // Clear existing materials
      materialsContainer.innerHTML = '';
      materialCount = 0;

      // Add each saved material
      savedMaterials.forEach(material => {
        addMaterialInput();
        const materialDiv = materialsContainer.lastChild;

        materialDiv.querySelector('.material-name').value = material.name;
        materialDiv.querySelector('.material-category').value = material.category || '';
        materialDiv.querySelector('.material-quantity').value = formatNumber(material.quantity);
        materialDiv.querySelector('.material-price').value = formatNumber(material.price.toFixed(2));
      });

      calculateTotals();

      // Show confirmation
      loadSavedBtn.innerHTML = '<i class="fas fa-check mr-2"></i> Loaded!';
      setTimeout(() => {
        loadSavedBtn.innerHTML = '<i class="fas fa-folder-open mr-2"></i> Load Saved Materials';
      }, 2000);
    } catch (e) {
      console.error('Error loading saved materials:', e);
      alert('Error loading saved materials!');
    }
  }
}); // Close DOMContentLoaded event listener
