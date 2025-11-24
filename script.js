// Global variables
let participants = []; // Só participantes do sorteio (excluindo responsável)
let responsible = null; // Responsável separado
let currentDraw = null;

// DOM elements
const participantInput = document.getElementById('participantInput');
const participantsList = document.getElementById('participantsList');
const participantCount = document.getElementById('participantCount');
const responsibleInput = document.getElementById('responsibleInput');
const currentResponsible = document.getElementById('currentResponsible');
const responsibleName = document.getElementById('responsibleName');
const drawBtn = document.getElementById('drawBtn');
const resultList = document.getElementById('resultList');

// Initialize app
function initApp() {
    updateUI();
    lucide.createIcons();
}

// Handle participant input
function handleParticipantInput(event) {
    if (event.key === 'Enter') {
        addParticipant();
    }
}

// Set responsible
function setResponsible() {
    const name = responsibleInput.value.trim();
    
    if (!name) {
        showStatus('Digite o nome do responsável', 'error');
        return;
    }
    
    if (participants.includes(name)) {
        showStatus('Este nome já foi adicionado como participante. Use nome diferente!', 'error');
        return;
    }
    
    if (responsible === name) {
        showStatus('Este já é o responsável atual', 'error');
        return;
    }
    
    responsible = name;
    responsibleName.textContent = name;
    currentResponsible.classList.remove('hidden');
    responsibleInput.value = '';
    updateUI();
    showStatus('Responsável definido!', 'success');
}

// Clear responsible
function clearResponsible() {
    responsible = null;
    currentResponsible.classList.add('hidden');
    responsibleInput.value = '';
    updateUI();
    showStatus('Responsável removido', 'success');
}

// Add participant (apenas do sorteio)
function addParticipant() {
    const name = participantInput.value.trim();
    
    if (!name) {
        showStatus('Digite o nome do participante', 'error');
        return;
    }
    
    if (participants.includes(name)) {
        showStatus('Este nome já foi adicionado', 'error');
        return;
    }
    
    if (responsible === name) {
        showStatus('Este é o responsável. Use nome diferente!', 'error');
        return;
    }
    
    if (participants.length >= 7) {
        showStatus('Máximo de 7 participantes atingido', 'error');
        return;
    }
    
    participants.push(name);
    participantInput.value = '';
    updateUI();
    showStatus('Participante adicionado!', 'success');
}

// Remove participant
function removeParticipant(name) {
    participants = participants.filter(p => p !== name);
    updateUI();
    showStatus('Participante removido', 'success');
}

// Get readings data (manual, opcional)
function getReadingsData() {
    const reading1 = document.getElementById('reading1').value.trim();
    const reading2 = document.getElementById('reading2').value.trim();
    const reading3 = document.getElementById('reading3').value.trim();
    
    return [
        reading1 ? { name: '1ª Leitura', reference: reading1 } : null,
        reading2 ? { name: '2ª Leitura', reference: reading2 } : null,
        reading3 ? { name: '3ª Leitura', reference: reading3 } : null,
        { name: 'Evangelho', reference: '' } // Responsável sempre participa
    ].filter(reading => reading !== null);
}

// Update UI
function updateUI() {
    updateParticipantList();
    updateDrawButton();
    participantCount.textContent = participants.length;
}

// Update participant list
function updateParticipantList() {
    participantsList.innerHTML = '';
    
    if (participants.length === 0) {
        participantsList.innerHTML = '<div class="text-center text-neutral-400 py-4"><i data-lucide="users"></i><p>Nenhum participante adicionado</p></div>';
        return;
    }
    
    participants.forEach((name, index) => {
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between p-3 rounded-lg border bg-neutral-50 border-neutral-200 animate-slide-in-left';
        item.style.animationDelay = `${index * 100}ms`;
        
        item.innerHTML = `
            <div class="flex items-center gap-3">
                <i data-lucide="user" class="w-4 h-4 text-neutral-400"></i>
                <span class="text-neutral-800">${name}</span>
            </div>
            <button onclick="removeParticipant('${name}')" class="text-neutral-400 hover:text-red-600 transition-colors">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
        `;
        
        participantsList.appendChild(item);
    });
}

// Update draw button
function updateDrawButton() {
    const canDraw = participants.length >= 1 && responsible;
    drawBtn.disabled = !canDraw;
}

// ** VERSÃO FINAL COM REGRAS DE CONFLITO **
function performFairDraw() {
    console.log('Realizando sorteio justo com regras de conflito:', participants, 'responsável:', responsible);
    
    // Validar responsável
    if (!responsible) {
        throw new Error('Nenhum responsável definido');
    }
    
    // Validar participantes
    if (participants.length === 0) {
        throw new Error('Nenhum participante disponível para o sorteio');
    }
    
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    const result = [];
    const readings = getReadingsData();
    
    console.log('Leituras configuradas:', readings);
    console.log('Participantes embaralhados:', shuffled);
    
    // 1. Atribuir leituras (se existirem)
    const readingAssignments = readings.filter(r => r.name !== 'Evangelho');
    const assignedParticipants = {}; // Para controlar quem já foi atribuído
    
    readingAssignments.forEach((reading, index) => {
        if (reading.reference.trim()) { // Só se preenchido
            let participant = shuffled[index % shuffled.length];
            
            // Garantir que não conflitos: se o participante já foi usado nesta leitura específica, tentar outro
            let attempts = 0;
            while (assignedParticipants[`reading${index}`] === participant && attempts < shuffled.length) {
                const alternativeIndex = (index + 1 + attempts) % shuffled.length;
                participant = shuffled[alternativeIndex];
                attempts++;
            }
            
            assignedParticipants[`reading${index}`] = participant;
            
            result.push({
                position: reading.name,
                participant: participant,
                reading: { reference: reading.reference },
                type: 'reading'
            });
            
            console.log(`${reading.name} atribuída a ${participant}`);
        }
    });
    
    // 2. Atribuir Evangelho APENAS para responsável
    result.push({
        position: 'Evangelho',
        participant: responsible,
        reading: { reference: '' },
        type: 'gospel'
    });
    
    console.log('Evangelho atribuído a responsável:', responsible);
    
    // 3. Atribuir monições com controle de conflitos
    const numberOfMonitions = readingAssignments.length + 1; // +1 para o evangelho
    
    for (let i = 0; i < numberOfMonitions; i++) {
        let participant = shuffled[i % shuffled.length];
        let attempts = 0;
        let monitionName = '';
        
        // Definir nome da monição
        if (i < readingAssignments.length) {
            // Monições das leituras
            monitionName = `${i + 1}ª Monição`;
            
            // Evitar conflito com leitura correspondente
            while (assignedParticipants[`reading${i}`] === participant && attempts < shuffled.length) {
                const alternativeIndex = (i + 1 + attempts) % shuffled.length;
                participant = shuffled[alternativeIndex];
                attempts++;
            }
        } else {
            // Monição do Evangelho
            monitionName = 'Monição do Evangelho';
            
            // Evitar conflito com Evangelho
            while (responsible === participant && attempts < shuffled.length) {
                const alternativeIndex = (i + 1 + attempts) % shuffled.length;
                participant = shuffled[alternativeIndex];
                attempts++;
            }
        }
        
        result.push({
            position: monitionName,
            participant: participant,
            type: 'monition'
        });
        
        console.log(`${monitionName} atribuída a ${participant}`);
    }
    
    // NÃO faz sort aleatório - mantém ordem litúrgica
    console.log('Sorteio concluído com resultado:', result);
    return result;
}

// Display results (New Grid Layout)
function displayResults(assignments) {
    resultList.innerHTML = '';
    resultList.className = 'grid grid-cols-1 md:grid-cols-2 gap-6'; // Adiciona classes de grid

    if (!assignments || assignments.length === 0) {
        resultList.innerHTML = '<div class="col-span-2 text-center text-neutral-500 py-8"><i data-lucide="calendar"></i><p>Nenhum resultado para exibir.</p></div>';
        return;
    }

    const gospel = assignments.find(a => a.type === 'gospel');
    const readings = assignments.filter(a => a.type === 'reading');
    const monitions = assignments.filter(a => a.type === 'monition');

    const fragment = document.createDocumentFragment();

    // 1. Render Gospel (full width)
    if (gospel) {
        const gospelCard = createResultItem(gospel, 0);
        gospelCard.classList.add('md:col-span-2'); // Ocupa duas colunas em telas médias ou maiores
        fragment.appendChild(gospelCard);
    }

    // 2. Render Readings Column
    const readingsContainer = document.createElement('div');
    readingsContainer.className = 'space-y-4';
    if (readings.length > 0) {
        const readingTitle = document.createElement('h3');
        readingTitle.className = 'text-lg font-semibold text-azul-real border-b-2 border-azul-celeste pb-2';
        readingTitle.textContent = 'Leituras';
        readingsContainer.appendChild(readingTitle);
        readings.forEach((item, index) => readingsContainer.appendChild(createResultItem(item, index)));
    }
    fragment.appendChild(readingsContainer);

    // 3. Render Monitions Column
    const monitionsContainer = document.createElement('div');
    monitionsContainer.className = 'space-y-4';
    if (monitions.length > 0) {
        const monitionTitle = document.createElement('h3');
        monitionTitle.className = 'text-lg font-semibold text-marrom-terroso border-b-2 border-bege-claro pb-2';
        monitionTitle.textContent = 'Monições';
        monitionsContainer.appendChild(monitionTitle);
        monitions.forEach((item, index) => monitionsContainer.appendChild(createResultItem(item, index)));
    }
    fragment.appendChild(monitionsContainer);

    resultList.appendChild(fragment);
    lucide.createIcons();
}

// Create Result Item (New Card Style)
function createResultItem(assignment, index) {
    const { type, position, participant, reading } = assignment;
    const reference = reading?.reference || '';

    let cardClasses = 'p-4 rounded-lg shadow-md border-l-4 transition-transform transform hover:scale-[1.02]';
    let iconName, iconClasses, titleColor, participantColor;

    switch (type) {
        case 'gospel':
            cardClasses += ' bg-dourado/10 border-dourado';
            iconName = 'crown';
            iconClasses = 'text-dourado';
            titleColor = 'text-dourado';
            participantColor = 'text-marrom-terroso';
            break;
        case 'reading':
            cardClasses += ' bg-azul-celeste/10 border-azul-celeste';
            iconName = 'book-open';
            iconClasses = 'text-azul-celeste';
            titleColor = 'text-azul-real';
            participantColor = 'text-azul-real';
            break;
        case 'monition':
            cardClasses += ' bg-bege-claro border-marrom-terroso';
            iconName = 'message-circle';
            iconClasses = 'text-marrom-terroso';
            titleColor = 'text-marrom-terroso';
            participantColor = 'text-marrom-terroso';
            break;
    }

    const item = document.createElement('div');
    item.className = cardClasses;
    item.style.animationDelay = `${index * 100}ms`;
    item.style.animation = 'fadeInUp 0.5s ease-out forwards';


    item.innerHTML = `
        <div class="flex items-start gap-4">
            <div class="flex-shrink-0">
                <i data-lucide="${iconName}" class="w-6 h-6 ${iconClasses}"></i>
            </div>
            <div class="flex-grow">
                <p class="font-bold text-lg ${titleColor}">${position}</p>
                <p class="font-semibold text-md ${participantColor}">${participant}</p>
                ${reference ? `<p class="text-sm text-gray-500 mt-1 italic">"${reference}"</p>` : ''}
            </div>
        </div>
    `;

    return item;
}

// Perform draw
function performDraw() {
    console.log('Iniciando performDraw com regras de conflito');
    
    if (!responsible) {
        showStatus('Defina o responsável pelo Evangelho!', 'error');
        return;
    }
    
    if (participants.length < 1) {
        showStatus('Adicione pelo menos 1 participante para o sorteio!', 'error');
        return;
    }
    
    try {
        // Usar a função com regras de conflito
        const assignment = performFairDraw();
        currentDraw = assignment;
        displayResults(assignment);
        
        showStatus('Sorteio realizado com sucesso! Regras de conflito aplicadas.', 'success');
    } catch (error) {
        console.error('Erro no sorteio:', error);
        showStatus(`Erro no sorteio: ${error.message}`, 'error');
    }
}

// Utility functions
function showStatus(message, type) {
    const statusMessage = document.getElementById('statusMessage');
    const statusText = document.getElementById('statusText');
    
    statusText.textContent = message;
    statusMessage.className = `fixed bottom-4 right-4 z-50 ${
        type === 'error' ? 'bg-red-600' : 'bg-azul-real'
    } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`;
    
    statusMessage.classList.remove('hidden');
    
    setTimeout(() => {
        statusMessage.classList.add('hidden');
    }, 3000);
}

function saveScreenshot() {
    if (!currentDraw) {
        showStatus('Realize um sorteio primeiro!', 'error');
        return;
    }
    
    const resultsSection = document.getElementById('results-section');
    if (!resultsSection) {
        showStatus('Não foi possível encontrar a seção de resultados.', 'error');
        return;
    }
    
    html2canvas(resultsSection).then(canvas => {
        const link = document.createElement('a');
        link.download = `sorteio_liturgico_${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL();
        link.click();
        showStatus('Screenshot salvo!', 'success');
    });
}

function clearAll() {
    participants = [];
    responsible = null;
    currentDraw = null;
    
    // Limpar campos de leitura
    document.getElementById('reading1').value = '';
    document.getElementById('reading2').value = '';
    document.getElementById('reading3').value = '';
    
    participantInput.value = '';
    responsibleInput.value = '';
    participantsList.innerHTML = '';
    currentResponsible.classList.add('hidden');
    resultList.innerHTML = '<div class="text-center text-neutral-500 py-8"><i data-lucide="calendar"></i><p>Aguardando sorteio...</p></div>';
    
    updateUI();
    lucide.createIcons();
    showStatus('Tudo limpo!', 'success');
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);