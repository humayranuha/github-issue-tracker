const API_BASE = 'https://phi-lab-server.vercel.app/api/v1/lab';
let allIssues = [];
let currentFilter = 'all';

// ===== SIGN IN =====
const loadHomePage = () => {
    const name = document.getElementById("name-input").value;
    const pass = document.getElementById("pass-input").value;

    if (name === "admin" && pass === "admin123") {
        window.location.hash = "signedIn";
        document.getElementById("sign-in").classList.add("hidden");
        document.getElementById("main-page").classList.remove("hidden");
        fetchAllIssues();
    } else {
        alert("Invalid credentials! Use admin/admin123");
        document.getElementById("name-input").value = "";
        document.getElementById("pass-input").value = "";
    }
};

// ===== FETCH ISSUES =====
const fetchAllIssues = async () => {
    showLoading();
    try {
        const response = await fetch(`${API_BASE}/issues`);
        const data = await response.json();
        if (data.status === "success") {
            allIssues = data.data;
            displayIssuesByFilter();
        }
    } catch (error) {
        showError();
    }
}

const searchIssues = async () => {
    const searchText = document.getElementById("search-input").value.trim();

    if (!searchText) {
        fetchAllIssues();
        return;
    }

    showLoading();
    try {
        const response = await fetch(`${API_BASE}/issues/search?q=${encodeURIComponent(searchText)}`);
        const data = await response.json();
        if (data.status === "success") {
            allIssues = data.data;
            displayIssuesByFilter();
        }
    } catch (error) {
        showError();
    }
};

// ===== DISPLAY =====
const displayIssuesByFilter = () => {
    let filtered = allIssues;
    if (currentFilter === 'all') {
        document.getElementById("all-status").classList.remove("hidden");
        document.getElementById("open-status").classList.add("hidden");
        document.getElementById("closed-status").classList.add("hidden");
    }
    if (currentFilter === 'open') {
        filtered = allIssues.filter(i => i.status === 'open');
        document.getElementById("all-status").classList.add("hidden");
        document.getElementById("open-status").classList.remove("hidden");
        document.getElementById("closed-status").classList.add("hidden");
    }
    if (currentFilter === 'closed') {
        filtered = allIssues.filter(i => i.status === 'closed');
        document.getElementById("all-status").classList.add("hidden");
        document.getElementById("open-status").classList.add("hidden");
        document.getElementById("closed-status").classList.remove("hidden");
    }

    document.getElementById("issue-count").innerHTML = `${filtered.length} Issues`;
    displayIssues(filtered);
};

const displayIssues = (issues) => {
    const container = document.getElementById("issues-container");

    if (!issues.length) {
        container.innerHTML = `<div class="col-span-full text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">No issues found</div>`;
        return;
    }

    container.innerHTML = issues.map(issue => `
                <div class="card bg-base-100 shadow-md hover:shadow-lg transition-all cursor-pointer border-t-4 ${issue.status === 'open' ? 'border-t-green-500' : 'border-t-purple-500'}" onclick="viewIssue(${issue.id})">
                    <div class="card-body p-3 sm:p-4">
                        <div class="flex justify-between items-start mb-2">
                            <span class="badge ${issue.status === 'open' ? 'badge-success' : 'badge-ghost'} text-xs">${issue.status}</span>
                            <span class="badge badge-outline text-xs">
                                <i class="fa-regular fa-flag text-xs"></i> ${issue.priority}
                            </span>
                        </div>
                        
                        <h3 class="font-bold text-sm sm:text-md">${issue.title}</h3>
                        <p class="text-gray-500 text-xs sm:text-sm">${issue.description.substring(0, 100)}${issue.description.length > 100 ? '...' : ''}</p>
                        
                        <div class="flex flex-wrap gap-1 mt-2">
                            ${issue.labels.slice(0, 2).map(l => `<span class="badge badge-sm bg-gray-100 text-gray-600 text-xs">${l}</span>`).join('')}
                            ${issue.labels.length > 2 ? `<span class="badge badge-sm text-xs">+${issue.labels.length - 2}</span>` : ''}
                        </div>
                        
                        <div class="flex justify-between items-center text-xs text-gray-500 mt-3 pt-2 border-t">
                            <span><i class="fas fa-user mr-1 text-xs"></i>${issue.author}</span>
                            <span><i class="fas fa-calendar mr-1 text-xs"></i>${new Date(issue.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            `).join('');
};

const viewIssue = async (id) => {
    try {
        const response = await fetch(`${API_BASE}/issue/${id}`);
        const data = await response.json();
        if (data.status === "success") {
            const issue = data.data;
            document.getElementById("modal-content").innerHTML = `
                        <h2 class="text-lg sm:text-xl font-bold mb-3">${issue.title}</h2>
                        <div class="flex flex-wrap gap-2 mb-4">
                            <span class="badge ${issue.status === 'open' ? 'badge-success' : 'badge-ghost'}">${issue.status}</span>
                            <span class="badge badge-outline">${issue.priority}</span>
                        </div>
                        <p class="text-gray-600 mb-4 text-sm sm:text-base">${issue.description}</p>
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${issue.labels.map(l => `<span class="badge bg-gray-100 text-xs sm:text-sm">${l}</span>`).join('')}
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm border-t pt-3">
                            <div><span class="text-gray-500">Author:</span> ${issue.author}</div>
                            <div><span class="text-gray-500">Assignee:</span> ${issue.assignee || 'None'}</div>
                            <div><span class="text-gray-500">Created:</span> ${new Date(issue.createdAt).toLocaleDateString()}</div>
                            <div><span class="text-gray-500">Updated:</span> ${new Date(issue.updatedAt).toLocaleDateString()}</div>
                        </div>
                    `;
            document.getElementById("issue-modal").showModal();
        }
    } catch (error) {
        alert("Failed to load issue details");
    }
};

// ===== UI =====
const switchTab = (filter) => {
    currentFilter = filter;
    const allBtn = document.getElementById("all-tab-btn");
    const openBtn = document.getElementById("open-tab-btn");
    const closedBtn = document.getElementById("closed-tab-btn");

    [allBtn, openBtn, closedBtn].forEach(btn => btn.classList.remove("tab-active"));
    if (filter === 'all') allBtn.classList.add("tab-active");
    if (filter === 'open') openBtn.classList.add("tab-active");
    if (filter === 'closed') closedBtn.classList.add("tab-active");

    displayIssuesByFilter();
}

const showLoading = () => {
    document.getElementById("issues-container").innerHTML = `
                <div class="col-span-full flex justify-center py-8 sm:py-12">
                    <span class="loading loading-spinner loading-md sm:loading-lg text-primary"></span>
                </div>
            `;
};

const showError = () => {
    document.getElementById("issues-container").innerHTML = `
                <div class="col-span-full text-center py-8 sm:py-12">
                    <p class="text-red-500 text-sm sm:text-base">Failed to load issues</p>
                    <button onclick="fetchAllIssues()" class="btn btn-sm btn-primary mt-3">Retry</button>
                </div>
            `;
};

// ========== INIT ==========
if (window.location.hash === "#signedIn") {
    document.getElementById("sign-in").classList.add("hidden");
    document.getElementById("main-page").classList.remove("hidden");
    fetchAllIssues();
}