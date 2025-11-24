// Global variables
let participants = [];
let responsable = '';
let currentDraw = null;

// Initialize Lucide icons
lucide.createIcons();

// DOM Elements
const nameInput = document.getElementById('nameInput');
const participantsContainer = document.getElementById('participants');
const responsableSelect = document.getElementById('responsableSelect');
const drawBtn = document.getElementById('drawBtn');
const drawStatus = document.getElementById('drawStatus');
const readingsToggle = document.getElementById('readingsToggle');
const readingsPanel = document.getElementById('readingsPanel');
const chevron = document.getElementById('chevron');
const resultSection = document.getElementById('resultSection');
const resultList = document.getElementById('resultList');
const loadingOverlay = document.getElementById('loadingOverlay');
const saveImageBtn = document.getElementById('saveImageBtn');
const newDrawBtn = document.getElementById('newDrawBtn');

// Event Listeners
nameInput.addEventListener('keydown', handleNameInput);
drawBtn.addEventListener('click', performDraw);
readingsToggle.addEventListener('click', toggleReadingsPanel);
saveImageBtn.addEventListener('click', saveResultAsImage);
newDrawBtn.addEventListener('click', resetApp);
responsableSelect.addEventListener('change', handleResponsableChange);

// Reading inputs change handlers
const readingInputs = [
    ['reading1-book', 'reading1-chapter', 'reading1-verse'],
    ['reading2-book', 'reading2-chapter', 'reading2-verse'],
    ['reading3-book', 'reading3-chapter', 'reading3-verse'],
    ['reading4-book', 'reading4-chapter', 'reading4-verse']
];

readingInputs.forEach((group, index) => {
    group.forEach(inputId => {
        document.getElementById(inputId).addEventListener('input', updateDrawButton);
    });
});

function handleNameInput(event) {
    if (event.key === 'Enter' || event.key === ',') {
        event.preventDefault();
        const name = nameInput.value.trim();
        if (name && participants.length < 7) {
            addParticipant(name);
            nameInput.value = '';
        } else if (participants.length >= 7) {
            showStatus('Máximo de 7 participantes atingido!', 'error');
        }
    }
}

function addParticipant(name) {
    if (!participants.includes(name) && participants.length < 7) {
        participants.push(name);
        renderParticipants();
        updateResponsableSelect();
        updateDrawButton();
        
        // Add remove functionality to chips
        updateRemoveButtons();
    }
}

function removeParticipant(name) {
    participants = participants.filter(p => p !== name);
    
    // If the removed person was the responsable, clear the responsable
    if (responsable === name) {
        responsable = '';
        responsableSelect.value = '';
    }
    
    renderParticipants();
    updateResponsableSelect();
    updateDrawButton();
}

function renderParticipants() {
    participantsContainer.innerHTML = '';
    
    participants.forEach(name => {
        const chip = document.createElement('div');
        chip.className = 'chip bg-primary-100 text-primary-700 px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium';
        chip.innerHTML = `
            <span>${name}</span>
            <button class="chip-remove" onclick="removeParticipant('${name}')">
                <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        `;
        participantsContainer.appendChild(chip);
    });
    
    // Re-initialize icons
    lucide.createIcons();
}

function updateRemoveButtons() {
    const removeButtons = document.querySelectorAll('.chip-remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const name = this.parentElement.querySelector('span').textContent;
            removeParticipant(name);
        });
    });
}

function updateResponsableSelect() {
    responsableSelect.innerHTML = '<option value="">Selecione o responsável</option>';
    
    participants.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        responsableSelect.appendChild(option);
    });
    
    // Restore selected value if still valid
    if (responsable && participants.includes(responsable)) {
        responsableSelect.value = responsable;
    }
}

function handleResponsableChange() {
    responsable = responsableSelect.value;
    updateDrawButton();
}

function toggleReadingsPanel() {
    const isExpanded = !readingsPanel.classList.contains('hidden');
    
    if (isExpanded) {
        readingsPanel.classList.add('hidden');
        chevron.style.transform = 'rotate(0deg)';
        readingsPanel.style.maxHeight = '0px';
    } else {
        readingsPanel.classList.remove('hidden');
        chevron.style.transform = 'rotate(180deg)';
        readingsPanel.style.maxHeight = readingsPanel.scrollHeight + 'px';
    }
}

function updateDrawButton() {
    const canDrawBasic = participants.length >= 2 && participants.length <= 7;
    const hasResponsable = !!responsable;
    const canDraw = canDrawBasic && hasResponsable;
    
    drawBtn.disabled = !canDraw;
    drawBtn.classList.toggle('opacity-50', !canDraw);
    drawBtn.classList.toggle('cursor-not-allowed', !canDraw);
    
    if (participants.length < 2) {
        drawStatus.textContent = 'Adicione pelo menos 2 participantes';
        drawStatus.className = 'text-sm text-error mt-3';
    } else if (participants.length > 7) {
        drawStatus.textContent = 'Máximo de 7 participantes permitido';
        drawStatus.className = 'text-sm text-error mt-3';
    } else if (!hasResponsable) {
        drawStatus.textContent = 'Selecione o responsável pelo Evangelho';
        drawStatus.className = 'text-sm text-warning mt-3';
    } else {
        const availableForRaffle = participants.filter(p => p !== responsable).length;
        drawStatus.textContent = `Pronto! ${availableForRaffle} pessoas para sortear (leituras + monições). ${responsable} apenas para o Evangelho`;
        drawStatus.className = 'text-sm text-success mt-3';
    }
}

async function performDraw() {
    console.log('Starting performDraw');
    
    if (participants.length < 2 || participants.length > 7) {
        showStatus('Número de participantes inválido! Mínimo 2, máximo 7 pessoas.', 'error');
        return;
    }
    
    if (!responsable) {
        showStatus('Selecione o responsável pelo Evangelho!', 'error');
        return;
    }
    
    const availableParticipants = participants.filter(p => p !== responsable);
    if (availableParticipants.length < 1) {
        showStatus('Você precisa de pelo menos 2 pessoas: 1 responsável e 1 para sortear as leituras/monições!', 'error');
        return;
    }
    
    // Show loading
    showLoading(true);
    
    try {
        console.log('Loading started, performing fair draw...');
        // Simulate loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const assignment = performFairDraw();
        console.log('Fair draw completed, assignment:', assignment);
        currentDraw = assignment;
        await displayResults(assignment);
        
        showLoading(false);
        resultSection.classList.remove('hidden');
        
        // Force the section to be visible with inline styles
        resultSection.style.display = 'block';
        resultSection.style.visibility = 'visible';
        resultSection.style.opacity = '1';
        
        // Scroll to results
        setTimeout(() => {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        console.log('Draw completed successfully');
        console.log('Result section visible:', !resultSection.classList.contains('hidden'));
        console.log('Result section display style:', window.getComputedStyle(resultSection).display);
        console.log('Result section visibility style:', window.getComputedStyle(resultSection).visibility);
        
    } catch (error) {
        showLoading(false);
        console.error('Draw error:', error);
        showStatus(`Erro ao realizar o sorteio: ${error.message}`, 'error');
    }
}

function performFairDraw() {
    console.log('Performing fair draw with participants:', participants, 'responsible:', responsable); // Debug log
    
    // ONLY participants (excluding responsible) participate in the raffle
    const participantsForRaffle = participants.filter(p => p !== responsable);
    console.log('Participants for raffle:', participantsForRaffle); // Debug log
    
    // Validate we have participants to draw from
    if (participantsForRaffle.length === 0) {
        throw new Error('No participants available for raffle');
    }
    
    // Shuffle participants for fair distribution
    const shuffled = [...participantsForRaffle].sort(() => Math.random() - 0.5);
    
    const result = [];
    
    // Assign leituras (only to participants, not responsible)
    const leituras = [
        { position: '1ª Leitura', type: 'reading', readingIndex: 0 },
        { position: '2ª Leitura', type: 'reading', readingIndex: 1 },
        { position: '3ª Leitura', type: 'reading', readingIndex: 2 }
    ];
    
    leituras.forEach((assignment, index) => {
        const participant = shuffled[index % participantsForRaffle.length];
        const reading = getReadingDetails(assignment.readingIndex);
        
        result.push({
            ...assignment,
            participant: participant,
            reading: reading
        });
    });
    
    // Assign Evangelho to responsible ONLY
    const gospelReading = getReadingDetails(3); // 4th reading (index 3)
    result.push({
        position: 'Evangelho',
        type: 'gospel',
        participant: responsable,
        reading: gospelReading
    });
    
    // Assign monições (only to participants, not responsible)
    const monicoes = [
        { position: 'Monição 1ª Leitura', type: 'monition', readingIndex: 0 },
        { position: 'Monição 2ª Leitura', type: 'monition', readingIndex: 1 },
        { position: 'Monição 3ª Leitura', type: 'monition', readingIndex: 2 },
        { position: 'Monição do Evangelho', type: 'monition', readingIndex: 3 }
    ];
    
    monicoes.forEach((assignment, index) => {
        const participant = shuffled[index % participantsForRaffle.length];
        const reading = getReadingDetails(assignment.readingIndex);
        
        result.push({
            ...assignment,
            participant: participant,
            reading: reading
        });
    });
    
    // Ensure fair distribution - every participant gets at least one assignment
    result.sort((a, b) => {
        // First sort by participation count, then randomly
        const aCount = result.filter(item => item.participant === a.participant).length;
        const bCount = result.filter(item => item.participant === b.participant).length;
        
        if (aCount !== bCount) {
            return aCount - bCount; // Prioritize those with fewer assignments
        }
        return Math.random() - 0.5; // Random tie-breaker
    });
    
    console.log('Draw completed with result:', result); // Debug log
    return result;
}

function getReadingDetails(index) {
    try {
        console.log(`Getting reading details for index: ${index}`); // Debug log
        
        const itemIndex = index % 4;
        const readingTypes = ['leitura1', 'leitura2', 'leitura3', 'evangelho'];
        const readingType = readingTypes[itemIndex] || `leitura${itemIndex + 1}`;
        
        const bookId = `reading${itemIndex + 1}-book`;
        const chapterId = `reading${itemIndex + 1}-chapter`;
        const verseId = `reading${itemIndex + 1}-verse`;
        
        const book = document.getElementById(bookId)?.value?.trim() || '';
        const chapter = document.getElementById(chapterId)?.value?.trim() || '';
        const verse = document.getElementById(verseId)?.value?.trim() || '';
        
        const hasData = book || chapter || verse;
        
        if (hasData) {
            const reference = formatReference(book, chapter, verse);
            const result = {
                type: readingType,
                reference: reference,
                fullReference: `${readingType}: ${reference}`
            };
            console.log('Reading details with data:', result); // Debug log
            return result;
        }
        
        const result = {
            type: readingType,
            reference: null,
            fullReference: null
        };
        console.log('Reading details without data:', result); // Debug log
        return result;
    } catch (error) {
        console.error('Error getting reading details for index:', index, error);
        return {
            type: `leitura${index}`,
            reference: null,
            fullReference: null
        };
    }
}

function formatReference(book, chapter, verse) {
    const parts = [];
    if (book) parts.push(book);
    if (chapter) parts.push(chapter);
    if (verse) parts.push(verse);
    
    return parts.join(' ');
}

async function displayResults(assignments) {
    console.log('Displaying results:', assignments);
    
    // Force clear and show the resultList
    resultList.innerHTML = '';
    resultList.style.display = 'block';
    resultList.style.visibility = 'visible';
    resultList.style.opacity = '1';
    
    // Validate assignments
    if (!assignments || !Array.isArray(assignments) || assignments.length === 0) {
        console.error('No assignments to display');
        resultList.innerHTML = '<div style="text-align: center; color: #6b7280; padding: 2rem; display: block; visibility: visible;">Nenhum resultado para exibir</div>';
        return;
    }
    
    console.log('Creating', assignments.length, 'result items');
    
    // Create items without animation first to debug
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < assignments.length; i++) {
        try {
            const assignment = assignments[i];
            console.log(`Creating item ${i + 1}/${assignments.length} for assignment:`, assignment);
            
            const resultItem = createResultItem(assignment, i);
            if (resultItem) {
                // Force styles to ensure visibility
                resultItem.style.display = 'flex';
                resultItem.style.visibility = 'visible';
                resultItem.style.opacity = '1';
                resultItem.style.marginBottom = '1rem';
                resultItem.style.maxWidth = '100%';
                
                fragment.appendChild(resultItem);
                console.log(`Item ${i + 1} created and added to fragment`);
            } else {
                console.error(`Failed to create result item for assignment:`, assignment);
            }
        } catch (error) {
            console.error('Error creating assignment:', assignment, error);
        }
    }
    
    // Append all items at once
    resultList.appendChild(fragment);
    console.log('All items appended to resultList');
    console.log('ResultList children count:', resultList.children.length);
    
    // Debug DOM state immediately
    console.log('ResultList innerHTML length:', resultList.innerHTML.length);
    
    // Debug DOM state after a brief delay
    setTimeout(() => {
        console.log('After timeout - ResultList children:', resultList.children.length);
        console.log('ResultList display style:', window.getComputedStyle(resultList).display);
        console.log('ResultList visibility style:', window.getComputedStyle(resultList).visibility);
        
        // Check individual items
        for (let i = 0; i < resultList.children.length; i++) {
            const child = resultList.children[i];
            console.log(`Child ${i + 1} display:`, window.getComputedStyle(child).display);
            console.log(`Child ${i + 1} visibility:`, window.getComputedStyle(child).visibility);
        }
    }, 100);
    
    // Re-initialize Lucide icons for the new content
    try {
        lucide.createIcons();
        console.log('Lucide icons initialized');
    } catch (e) {
        console.warn('Lucide initialization failed:', e);
    }
    
    console.log('Results display completed');
}

function createResultItem(assignment, index) {
    try {
        // Validate assignment data
        if (!assignment || !assignment.position || !assignment.participant) {
            console.error('Invalid assignment data:', assignment);
            return null;
        }
        
        const item = document.createElement('div');
        item.className = 'result-item flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200';
        
        const isMonition = assignment.type === 'monition';
        const positionIcon = isMonition ? 'message-circle' : 'book-open';
        const positionColor = isMonition ? 'text-accent-gold' : 'text-primary-700';
        
        // Safely get reading data
        const reading = assignment.reading || {};
        const reference = reading.reference || '';
        
        item.innerHTML = `
            <div class="flex items-center gap-3 flex-1">
                <i data-lucide="${positionIcon}" class="w-5 h-5 ${positionColor}"></i>
                <div class="flex-1">
                    <div class="font-semibold text-neutral-900 text-lg">
                        ${assignment.position}
                    </div>
                    <div class="text-primary-700 font-medium text-base">
                        ${assignment.participant}
                    </div>
                    ${reference ? `
                        <div class="text-neutral-600 text-sm mt-1">
                            ${reference}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        return item;
    } catch (error) {
        console.error('Error creating result item:', error, assignment);
        return null;
    }
}

function showLoading(show) {
    if (show) {
        loadingOverlay.classList.remove('hidden');
    } else {
        loadingOverlay.classList.add('hidden');
    }
}

function showStatus(message, type = 'info') {
    drawStatus.textContent = message;
    drawStatus.className = `text-sm mt-3 ${type === 'error' ? 'text-error' : type === 'success' ? 'text-success' : 'text-neutral-400'}`;
}

async function saveResultAsImage() {
    const resultCard = document.getElementById('resultCard');
    
    // Show loading
    saveImageBtn.innerHTML = '<div class="loading-spinner w-4 h-4 mr-2"></div>Salvando...';
    saveImageBtn.disabled = true;
    
    try {
        // Add watermark and styling for image
        const originalBackground = resultCard.style.background;
        const originalMargin = resultCard.style.margin;
        
        resultCard.style.background = 'white';
        resultCard.style.margin = '0';
        
        const canvas = await html2canvas(resultCard, {
            backgroundColor: '#ffffff',
            scale: 2, // Higher quality
            width: resultCard.offsetWidth,
            height: resultCard.offsetHeight,
            allowTaint: true,
            foreignObjectRendering: true
        });
        
        // Create download link
        const link = document.createElement('a');
        link.download = `sorteio-liturgico-${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Restore original styles
        resultCard.style.background = originalBackground;
        resultCard.style.margin = originalMargin;
        
        showStatus('Imagem salva com sucesso!', 'success');
        
    } catch (error) {
        console.error('Error saving image:', error);
        showStatus('Erro ao salvar imagem. Tente novamente.', 'error');
    } finally {
        // Restore button
        saveImageBtn.innerHTML = '<i data-lucide="download" class="w-4 h-4 mr-2"></i>Salvar Imagem';
        saveImageBtn.disabled = false;
        lucide.createIcons();
    }
}

function resetApp() {
    // Clear all data
    participants = [];
    responsable = '';
    currentDraw = null;
    
    // Reset UI
    participantsContainer.innerHTML = '';
    responsableSelect.value = '';
    nameInput.value = '';
    resultSection.classList.add('hidden');
    
    // Clear reading inputs
    readingInputs.forEach((group) => {
        group.forEach(inputId => {
            document.getElementById(inputId).value = '';
        });
    });
    
    // Collapse readings panel
    readingsPanel.classList.add('hidden');
    chevron.style.transform = 'rotate(0deg)';
    readingsPanel.style.maxHeight = '0px';
    
    updateDrawButton();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Focus on name input
    nameInput.focus();
    
    showStatus('Aplicação resetada. Adicione novos participantes para um novo sorteio.', 'success');
}

// Auto-focus name input when page loads
document.addEventListener('DOMContentLoaded', () => {
    nameInput.focus();
});

// Prevent form submission
document.addEventListener('submit', (e) => {
    e.preventDefault();
});

// Handle escape key to close modals/overlays
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (!loadingOverlay.classList.contains('hidden')) {
            showLoading(false);
        }
    }
});

// Handle paste events for name input
nameInput.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text');
    const names = text.split('\n').map(name => name.trim()).filter(name => name);
    
    names.forEach(name => {
        if (name && participants.length < 7) {
            addParticipant(name);
        }
    });
});

// Prevent clicking on disabled button
drawBtn.addEventListener('click', (e) => {
    if (drawBtn.disabled) {
        e.preventDefault();
        const participantCount = participants.length;
        if (participantCount < 2) {
            showStatus('Adicione pelo menos 2 participantes para realizar o sorteio!', 'error');
        } else if (participantCount > 7) {
            showStatus('Máximo de 7 participantes permitido!', 'error');
        }
    }
});

// API Integration for Bible verses (bonus feature)
async function fetchBibleVerse(book, chapter, verse) {
    // Using bible-api.com (free)
    try {
        const reference = encodeURIComponent(`${book} ${chapter}:${verse}`);
        const response = await fetch(`https://bible-api.com/${reference}`);
        const data = await response.json();
        
        if (data.text) {
            return data.text;
        }
    } catch (error) {
        console.warn('Could not fetch Bible verse:', error);
        return null;
    }
    
    return null;
}

// Analytics (simple console logging for demo)
function trackDrawEvent(participantCount) {
    console.log(`Draw performed with ${participantCount} participants`);
    // Here you could send to analytics service
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to perform draw
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !drawBtn.disabled) {
        performDraw();
    }
    
    // Ctrl/Cmd + R to reset
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        if (confirm('Tem certeza que deseja resetar o sorteio?')) {
            resetApp();
        }
    }
});