/**
 * Modern JS Application Structure
 */
(() => {
    // 1. Select DOM Elements
    const elements = {
        input: document.getElementById('urlInput'),
        btn: document.getElementById('fetchBtn'),
        btnIcon: document.getElementById('btnIcon'),
        output: document.getElementById('jsonOutput'),
        status: document.getElementById('statusContainer'),
        copyBtn: document.getElementById('copyBtn'),
        quickLinks: document.querySelectorAll('.quick-link')
    };

    // 2. State Management Helpers
    const uiState = {
        setLoading(isLoading) {
            elements.btn.disabled = isLoading;
            elements.input.disabled = isLoading;
            
            if (isLoading) {
                elements.btn.classList.add('opacity-75', 'cursor-wait');
                elements.btnIcon.innerHTML = `<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>`;
                elements.btnIcon.classList.add('animate-spin');
                this.updateStatus('info', 'Establishing connection...');
            } else {
                elements.btn.classList.remove('opacity-75', 'cursor-wait');
                elements.btnIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>`;
                elements.btnIcon.classList.remove('animate-spin');
            }
        },

        updateStatus(type, message, details = '') {
            elements.status.classList.remove('hidden');
            
            const styles = {
                error: 'bg-red-500/10 border-red-500/20 text-red-400',
                success: 'bg-green-500/10 border-green-500/20 text-green-400',
                info: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
            };

            const icons = {
                error: `<svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
                success: `<svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
                info: `<svg class="w-6 h-6 mr-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
            };

            elements.status.innerHTML = `
                <div class="rounded-lg p-4 border flex items-start ${styles[type]}">
                    ${icons[type]}
                    <div>
                        <h3 class="font-semibold">${message}</h3>
                        ${details ? `<p class="text-sm mt-1 opacity-80">${details}</p>` : ''}
                    </div>
                </div>
            `;
        },

        displayData(data) {
            const formatted = JSON.stringify(data, null, 2);
            elements.output.textContent = formatted;
            Prism.highlightElement(elements.output);
            elements.output.classList.remove('items-center', 'justify-center', 'flex');
        }
    };

    // 3. Core Logic: Async Fetch
    const handleFetch = async () => {
        const url = elements.input.value.trim();
        
        if (!url) {
            uiState.updateStatus('error', 'Input Required', 'Please enter a valid URL.');
            return;
        }

        uiState.setLoading(true);
        elements.output.textContent = '// Fetching data...';

        try {
            const startTime = performance.now();
            const response = await fetch(url);
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(0);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            uiState.displayData(data);
            uiState.updateStatus('success', 'Request Successful', `Loaded in ${duration}ms • Status ${response.status}`);

        } catch (error) {
            console.error("Fetch error:", error);

            let errorMsg = error.message;
            let hint = "Check the URL and try again.";

            if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
                hint = "This is likely a <strong>CORS (Cross-Origin)</strong> error. <br>Browsers block requests to servers that don't explicitly allow your origin. Try a public API like '[https://jsonplaceholder.typicode.com/todos/1](https://jsonplaceholder.typicode.com/todos/1)'.";
            }

            uiState.updateStatus('error', 'Request Failed', `${errorMsg}<br><br>${hint}`);
            elements.output.textContent = `// Error details logged to console\n\n{\n  "error": "${errorMsg}"\n}`;
            Prism.highlightElement(elements.output);
        } finally {
            uiState.setLoading(false);
        }
    };

    // 4. Event Listeners
    elements.btn.addEventListener('click', handleFetch);
    
    elements.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleFetch();
    });

    elements.quickLinks.forEach(btn => {
        btn.addEventListener('click', (e) => {
            elements.input.value = e.target.dataset.url;
            handleFetch();
        });
    });

    elements.copyBtn.addEventListener('click', () => {
        const text = elements.output.textContent;
        if (text.includes('//')) return; 

        navigator.clipboard.writeText(text).then(() => {
            const originalText = elements.copyBtn.innerHTML;
            elements.copyBtn.innerHTML = `<span class="text-green-400">Copied!</span>`;
            setTimeout(() => {
                elements.copyBtn.innerHTML = originalText;
            }, 2000);
        });
    });
})();
