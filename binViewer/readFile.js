// Arquivo: readFile.js
window.addEventListener('load', initializeVisibility);
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(event) {
        const arrayBuffer = event.target.result;
        currentBytes = new Uint8Array(arrayBuffer);
        display(currentBytes);
        displayHistograms(currentBytes);
    };

    reader.readAsArrayBuffer(file);
});

document.getElementById('lineLengthInput').addEventListener('change', function() {
    if (currentBytes) {
        displayHistograms(currentBytes);
    }
});

document.getElementById('filterEqual').addEventListener('change', function() {
    applyFilters();
});

document.getElementById('filterLess').addEventListener('change', function() {
    applyFilters();
});

document.getElementById('filterGreater').addEventListener('change', function() {
    applyFilters();
});
document.getElementById('filterInput').addEventListener('change', function() {
    applyFilters();
});
// Adiciona eventos de alteração aos checkboxes para ocultar/exibir containers
document.getElementById('toggleHexContainer').addEventListener('change', function() {
    toggleContainerVisibility('hexContainer', this.checked);
});

document.getElementById('toggleDecContainer').addEventListener('change', function() {
    toggleContainerVisibility('decContainer', this.checked);
});

document.getElementById('toggleHexContainerRotated').addEventListener('change', function() {
    toggleContainerVisibility('hexContainerRotated', this.checked);
});

document.getElementById('toggleDecContainerRotated').addEventListener('change', function() {
    toggleContainerVisibility('decContainerRotated', this.checked);
});

document.getElementById('toggleHistogramsContainer').addEventListener('change', function() {
    toggleContainerVisibility('histogramsContainer', this.checked);
});

document.getElementById('toggleHistogramsContainerRotated').addEventListener('change', function() {
    toggleContainerVisibility('histogramsContainerRotated', this.checked);
});

// Função para ocultar/exibir um container
function toggleContainerVisibility(containerId, isVisible) {
    const container = document.getElementById(containerId);
    if (isVisible) {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}
function initializeVisibility() {
    toggleContainerVisibility('hexContainer', document.getElementById('toggleHexContainer').checked);
    toggleContainerVisibility('decContainer', document.getElementById('toggleDecContainer').checked);
    toggleContainerVisibility('hexContainerRotated', document.getElementById('toggleHexContainerRotated').checked);
    toggleContainerVisibility('decContainerRotated', document.getElementById('toggleDecContainerRotated').checked);
    toggleContainerVisibility('histogramsContainer', document.getElementById('toggleHistogramsContainer').checked);
    toggleContainerVisibility('histogramsContainerRotated', document.getElementById('toggleHistogramsContainerRotated').checked);
}
let currentBytes = null; // Mantém os bytes atuais do arquivo
let currentFilters = [];

function applyFilters() {
    currentFilters = [];
    if (document.getElementById('filterEqual').checked) {
        currentFilters.push('equal');
    }
    if (document.getElementById('filterLess').checked) {
        currentFilters.push('less');
    }
    if (document.getElementById('filterGreater').checked) {
        currentFilters.push('greater');
    }
    display(currentBytes);
}

function display(byteArray) {
    displayHex(byteArray);
    displayDec(byteArray);
    displayHexRotated(byteArray);
    displayDecRotated(byteArray);
}

function displayHex(byteArray) {
    const container = document.getElementById('hexContainer');
    updateDisplay(byteArray, container, 2, 'hex');
}

function displayDec(byteArray) {
    const container = document.getElementById('decContainer');
    updateDisplay(byteArray, container, 3, 'dec');
}

function displayHexRotated(byteArray) {
    const container = document.getElementById('hexContainerRotated');
    updateRotatedDisplay(byteArray, container, 2, 'hex');
}

function displayDecRotated(byteArray) {
    const container = document.getElementById('decContainerRotated');
    updateRotatedDisplay(byteArray, container, 3, 'dec');
}

function updateDisplay(byteArray, container, padLength, type) {
    const lineLength = parseInt(document.getElementById('lineLengthInput').value) || 32;
    let result = '';
    byteArray.forEach((byte, index) => {
        let value = type === 'hex' ? byte.toString(16).padStart(padLength, '0').toUpperCase() : byte.toString().padStart(padLength, '0');
        result += formatByte(value, byte) + ' ';
        if ((index + 1) % lineLength === 0) {
            result += '\n';
        }
    });
    container.innerHTML = result.trim();
}

function updateRotatedDisplay(byteArray, container, padLength, type) {
    const lineLength = parseInt(document.getElementById('lineLengthInput').value) || 32;
    let lines = Array.from({length: lineLength}, () => '');
    byteArray.forEach((byte, index) => {
        let value = type === 'hex' ? byte.toString(16).padStart(padLength, '0').toUpperCase() : byte.toString().padStart(padLength, '0');
        lines[index % lineLength] += formatByte(value, byte) + ' ';
    });
    container.innerHTML = lines.join('\n').trim();
}

function formatByte(value, byte) {
    if (currentFilters.length === 0) {
        return `<span class="highlight-none">${value}</span>`;
    }
    let classes = [];
    currentFilters.forEach(filter => {
        if (filter === 'equal' && byte === parseInt(document.getElementById('filterInput').value)) {
            classes.push('highlight-equal');
        } else if (filter === 'less' && byte < parseInt(document.getElementById('filterInput').value)) {
            classes.push('highlight-less');
        } else if (filter === 'greater' && byte > parseInt(document.getElementById('filterInput').value)) {
            classes.push('highlight-greater');
        }
    });
    if (classes.length === 0) {
        return `<span class="highlight-none">${value}</span>`;
    }
    return `<span class="${classes.join(' ')}">${value}</span>`;
}

function displayHistograms(byteArray) {
    const lineLength = parseInt(document.getElementById('lineLengthInput').value) || 32;
    const histogramsContainer = document.getElementById('histogramsContainer');
    const histogramsContainerRotated = document.getElementById('histogramsContainerRotated');
    
    histogramsContainer.innerHTML = '';
    histogramsContainerRotated.innerHTML = '';

    createHistograms(histogramsContainer, byteArray, lineLength);
    createHistogramsRotated(histogramsContainerRotated, byteArray, lineLength);
}

function createHistograms(container, byteArray, lineLength) {
    const barWidth = 1; // Largura da barra
    const barSpacing = 1; // Espaçamento entre as barras
    const canvasHeight = 50; // Altura do canvas
    const canvasWidth = (barWidth + barSpacing) * lineLength; // Largura total do canvas
    
    for (let i = 0; i < byteArray.length; i += lineLength) {
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.classList.add('histogramCanvas');
        
        const ctx = canvas.getContext('2d');
        const maxValue = 255;
        
        for (let j = 0; j < lineLength; j++) {
            const byteValue = byteArray[i + j];
            const barHeight = (byteValue / maxValue) * canvasHeight;
            const x = j * (barWidth + barSpacing);
            const y = canvasHeight - barHeight;
            ctx.fillStyle = 'white';
            ctx.fillRect(x, y, barWidth, barHeight);
        }
        
        const histogramDiv = document.createElement('div');
        histogramDiv.classList.add('histogramContainer');
        histogramDiv.appendChild(canvas);
        
        container.appendChild(histogramDiv);
    }
}
function createHistogramsRotated(container, byteArray, lineLength) {
    const barWidth = 1; // Largura da barra
    const barSpacing = 1; // Espaçamento entre as barras
    const canvasHeight = 100; // Altura do canvas
    const canvasWidth = (barWidth + barSpacing) * Math.ceil(byteArray.length / lineLength);
    for (let i = 0; i < lineLength; i++) {
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.classList.add('histogramCanvas');
        
        const ctx = canvas.getContext('2d');
        const maxValue = 255;

        // Desenha as barras no canvas para esta linha
        let k=0;
        for (let j = i; j < byteArray.length; j += lineLength) {
            console.log(j);
            const byteValue = byteArray[j];
            const barHeight = (byteValue / maxValue) * canvasHeight;
            const x = k * (barWidth + barSpacing);
            const y = canvasHeight - barHeight;
            ctx.fillStyle = 'yellow';
            ctx.fillRect(x, y, barWidth, barHeight);
            k++;
        }
        
        // Adiciona o canvas ao container
        const histogramDiv = document.createElement('div');
        histogramDiv.classList.add('histogramContainer');
        histogramDiv.appendChild(canvas);
        
        container.appendChild(histogramDiv);
    }
}


