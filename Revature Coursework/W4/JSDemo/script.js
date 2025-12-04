(() => {

    const elements = {
        input: document.getElementById('urlInput'),
        btn: document.getElementById('fetchBtn'),
        status: document.getElementById('statusContainer'),
        code: document.getElementById('output')
    };


    const myfetch = async () => {
        const url = elements.input.value.trim();
        if (!url) return;

        try {
            const response = await fetch(url);
            console.log(response);
            if (!response.ok) {
                console.log(response);
                console.log(response.status);
                throw new Error(`HTTP Error: ${response.status}`);
            }
            const data = await response.json();
            elements.code.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
            elements.status.classList.remove('hidden');
            elements.status.textContent = error.message;
        }
    }

    elements.btn.addEventListener('click', myfetch);

});