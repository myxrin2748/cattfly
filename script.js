const SHEETDB_URL = 'https://sheetdb.io/api/v1/3oxb43bnmmd8u'; 

async function fetchLinks() {
    const mainLoader = document.getElementById('mainLoader');
    const errorBox = document.getElementById('error-message');
    
    try {
        const response = await fetch(SHEETDB_URL);
        if (!response.ok) throw new Error("Gagal mengambil data");
        const data = await response.json();
        renderCards(data);
    } catch (error) {
        errorBox.style.display = 'block';
        errorBox.innerText = "Error: Pastikan URL API benar dan Sheet tidak kosong.";
    } finally {
        mainLoader.style.display = 'none';
    }
}

function renderCards(rows) {
    const container = document.getElementById('link-container');
    container.innerHTML = '';

    rows.forEach((row, index) => {
        const card = document.createElement('div');
        card.className = 'link-card';
        
        card.innerHTML = `
            <div class="menu-container">
                <button class="dots-btn" onclick="toggleMenu(event, ${index})">⋮</button>
                <div id="menu-${index}" class="dropdown-menu">
                    ${row.Link5MB ? `<button onclick="copyText('${row.Link5MB}')">📋 Salin Link 5MB</button>` : ''}
                    ${row.LinkDrive ? `<button onclick="copyText('${row.LinkDrive}')">📋 Salin Link .xml</button>` : ''}
                </div>
            </div>
            <div class="card-header">
                <span class="item-code">${row.Kode || 'FILE'}</span>
                <span class="item-name">${row.Nama || 'Tanpa Judul'}</span>
            </div>
            <div class="button-group">
                ${createBtn(row.Link5MB, 'btn-5mb', 'File 5MB')}
                ${createBtn(row.LinkDrive, 'btn-xml', '.xml')}
                ${createBtn(row.LinkTikTok, 'btn-tonton', 'Tonton')}
            </div>
        `;
        container.appendChild(card);
    });
}

function createBtn(url, css, label) {
    const valid = url && url.toString().trim().startsWith('http');
    return valid 
        ? `<a href="${url.trim()}" target="_blank" class="btn ${css}">${label}</a>` 
        : `<button class="btn disabled">${label}</button>`;
}

function toggleMenu(event, index) {
    event.stopPropagation();
    const menu = document.getElementById(`menu-${index}`);
    const isVisible = menu.style.display === 'block';
    
    // Sembunyikan semua menu dulu
    document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
    
    // Tampilkan yang diklik jika sebelumnya tersembunyi
    menu.style.display = isVisible ? 'none' : 'block';
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('toast');
        toast.style.display = 'block';
        setTimeout(() => { toast.style.display = 'none'; }, 2000);
    });
}

let searchTimer;
function filterLinks() {
    document.getElementById('searchLoader').style.display = 'block';
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
        const query = document.getElementById('searchInput').value.toLowerCase();
        document.querySelectorAll('.link-card').forEach(card => {
            const content = card.innerText.toLowerCase();
            card.style.display = content.includes(query) ? 'block' : 'none';
        });
        document.getElementById('searchLoader').style.display = 'none';
    }, 400);
}

// Tutup menu saat klik di mana saja
document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
});

fetchLinks();