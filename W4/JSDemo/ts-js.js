/**
 * api_inspector.ts
 * * This is the TypeScript source code.
 * In a modern setup (Vite/Webpack), this would be compiled to 'app.js'.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
// 2. Application Logic
(function () {
    // Type Assertion: We promise TS that these elements exist and match these specific HTML types.
    // If they were null, this would throw at runtime, so in production code we might add null checks.
    var elements = {
        input: document.getElementById('urlInput'),
        btn: document.getElementById('fetchBtn'),
        btnIcon: document.getElementById('btnIcon'),
        output: document.getElementById('jsonOutput'),
        status: document.getElementById('statusContainer'),
        copyBtn: document.getElementById('copyBtn'),
        quickLinks: document.querySelectorAll('.quick-link')
    };
    // State Management Helper
    var uiState = {
        setLoading: function (isLoading) {
            elements.btn.disabled = isLoading;
            elements.input.disabled = isLoading;
            if (isLoading) {
                elements.btnIcon.innerHTML = '⟳';
                elements.btnIcon.classList.add('spin');
                // We can safely modify textContent because we know btn is a Button
                elements.btn.textContent = ' Loading...';
                elements.btn.prepend(elements.btnIcon);
                this.updateStatus('info', 'Fetching data...');
            }
            else {
                elements.btnIcon.innerHTML = '➤';
                elements.btnIcon.classList.remove('spin');
                elements.btn.textContent = ' Fetch';
                elements.btn.prepend(elements.btnIcon);
            }
        },
        updateStatus: function (type, message) {
            elements.status.classList.remove('hidden');
            // Reset classes
            elements.status.className = 'status-box';
            // Add specific type class (Type safety ensures 'type' matches our CSS classes)
            elements.status.classList.add("status-".concat(type));
            elements.status.textContent = message;
        },
        displayData: function (data) {
            // 'unknown' is safer than 'any' - it forces us to handle it carefully,
            // though JSON.stringify accepts anything.
            elements.output.textContent = JSON.stringify(data, null, 2);
        }
    };
    // Core Logic
    var handleFetch = function () { return __awaiter(_this, void 0, void 0, function () {
        var url, response, data, error_1, msg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = elements.input.value.trim();
                    if (!url)
                        return [2 /*return*/];
                    uiState.setLoading(true);
                    elements.output.textContent = '// Fetching...';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch(url)];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP Error: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    uiState.displayData(data);
                    uiState.updateStatus('success', "Success: ".concat(response.status, " OK"));
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    msg = 'Unknown error occurred';
                    if (error_1 instanceof Error) {
                        msg = error_1.message;
                    }
                    else if (typeof error_1 === 'string') {
                        msg = error_1;
                    }
                    if (msg.includes('Failed to fetch')) {
                        msg += ' (Likely CORS issue)';
                    }
                    uiState.updateStatus('error', msg);
                    elements.output.textContent = '// Request Failed';
                    return [3 /*break*/, 6];
                case 5:
                    uiState.setLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // Event Listeners
    elements.btn.addEventListener('click', handleFetch);
    // TypeScript knows 'e' is a KeyboardEvent here
    elements.input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter')
            handleFetch();
    });
    elements.quickLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            // We need to cast the target to access dataset safely
            var target = e.target;
            // Optional chaining in case dataset.url is missing
            var newUrl = target.dataset.url;
            if (newUrl) {
                elements.input.value = newUrl;
                handleFetch();
            }
        });
    });
    elements.copyBtn.addEventListener('click', function () {
        // Null check for textContent
        var content = elements.output.textContent || '';
        if (content.includes('//'))
            return;
        navigator.clipboard.writeText(content);
        var original = elements.copyBtn.textContent;
        elements.copyBtn.textContent = 'Copied!';
        setTimeout(function () {
            if (original)
                elements.copyBtn.textContent = original;
        }, 1500);
    });
})();
