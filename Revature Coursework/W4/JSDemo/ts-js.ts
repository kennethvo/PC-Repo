/**
 * api_inspector.ts
 * * This is the TypeScript source code. 
 * In a modern setup (Vite/Webpack), this would be compiled to 'app.js'.
 */

// 1. Define Interfaces for Type Safety

// Shape of the DOM elements we need to interact with
interface DOMElements {
    input: HTMLInputElement;
    btn: HTMLButtonElement;
    btnIcon: HTMLElement;
    output: HTMLElement;
    status: HTMLElement;
    copyBtn: HTMLButtonElement;
    quickLinks: NodeListOf<HTMLAnchorElement>; // More specific than just NodeList
}

// Allowed status types for our UI state
type StatusType = 'error' | 'success' | 'info';

// Shape of the UI State manager
interface UIState {
    setLoading: (isLoading: boolean) => void;
    updateStatus: (type: StatusType, message: string) => void;
    displayData: (data: unknown) => void;
}

// 2. Application Logic
(() => {
    // Type Assertion: We promise TS that these elements exist and match these specific HTML types.
    // If they were null, this would throw at runtime, so in production code we might add null checks.
    const elements: DOMElements = {
        input: document.getElementById('urlInput') as HTMLInputElement,
        btn: document.getElementById('fetchBtn') as HTMLButtonElement,
        btnIcon: document.getElementById('btnIcon') as HTMLElement,
        output: document.getElementById('jsonOutput') as HTMLElement,
        status: document.getElementById('statusContainer') as HTMLElement,
        copyBtn: document.getElementById('copyBtn') as HTMLButtonElement,
        quickLinks: document.querySelectorAll('.quick-link') as NodeListOf<HTMLAnchorElement>
    };

    // State Management Helper
    const uiState: UIState = {
        setLoading(isLoading: boolean): void {
            elements.btn.disabled = isLoading;
            elements.input.disabled = isLoading;

            if (isLoading) {
                elements.btnIcon.innerHTML = '⟳';
                elements.btnIcon.classList.add('spin');
                // We can safely modify textContent because we know btn is a Button
                elements.btn.textContent = ' Loading...';
                elements.btn.prepend(elements.btnIcon);
                this.updateStatus('info', 'Fetching data...');
            } else {
                elements.btnIcon.innerHTML = '➤';
                elements.btnIcon.classList.remove('spin');
                elements.btn.textContent = ' Fetch';
                elements.btn.prepend(elements.btnIcon);
            }
        },

        updateStatus(type: StatusType, message: string): void {
            elements.status.classList.remove('hidden');
            // Reset classes
            elements.status.className = 'status-box';
            // Add specific type class (Type safety ensures 'type' matches our CSS classes)
            elements.status.classList.add(`status-${type}`);
            elements.status.textContent = message;
        },

        displayData(data: unknown): void {
            // 'unknown' is safer than 'any' - it forces us to handle it carefully,
            // though JSON.stringify accepts anything.
            elements.output.textContent = JSON.stringify(data, null, 2);
        }
    };

    // Core Logic
    const handleFetch = async (): Promise<void> => {
        const url: string = elements.input.value.trim();

        if (!url) return;

        uiState.setLoading(true);
        elements.output.textContent = '// Fetching...';

        try {
            // Native Fetch API types are built into TypeScript
            const response: Response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            // We assume the response is JSON, but strictly it's 'any' or 'unknown'
            const data: unknown = await response.json();

            uiState.displayData(data);
            uiState.updateStatus('success', `Success: ${response.status} OK`);

        } catch (error) {
            // Error handling in TS requires casting because 'error' is of type 'unknown'
            let msg: string = 'Unknown error occurred';

            if (error instanceof Error) {
                msg = error.message;
            } else if (typeof error === 'string') {
                msg = error;
            }

            if (msg.includes('Failed to fetch')) {
                msg += ' (Likely CORS issue)';
            }

            uiState.updateStatus('error', msg);
            elements.output.textContent = '// Request Failed';
        } finally {
            uiState.setLoading(false);
        }
    };

    // Event Listeners
    elements.btn.addEventListener('click', handleFetch);

    // TypeScript knows 'e' is a KeyboardEvent here
    elements.input.addEventListener('keypress', (e: KeyboardEvent) => {
        if (e.key === 'Enter') handleFetch();
    });

    elements.quickLinks.forEach(link => {
        link.addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();
            // We need to cast the target to access dataset safely
            const target = e.target as HTMLElement;
            // Optional chaining in case dataset.url is missing
            const newUrl = target.dataset.url;

            if (newUrl) {
                elements.input.value = newUrl;
                handleFetch();
            }
        });
    });

    elements.copyBtn.addEventListener('click', () => {
        // Null check for textContent
        const content = elements.output.textContent || '';
        if (content.includes('//')) return;

        navigator.clipboard.writeText(content);
        const original = elements.copyBtn.textContent;
        elements.copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            if (original) elements.copyBtn.textContent = original;
        }, 1500);
    });

})();