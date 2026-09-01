const AppState = {
  currentPage: 'home',
  currentStep: 1,
  currentUser: null,
  uploadedFiles: [],
  grievances: [
    { id: 'GZL/JS/2026/GAZOLE-I/0001', title: 'Water Supply Issue', description: 'No drinking water for 3 days.', status: 'Pending', date: 'Oct 12, 2026', gp: 'Gazole I', category: 'Water Supply', applicant: 'Rahul Mandal' },
    { id: 'GZL/JS/2026/GAZOLE-II/0002', title: 'Broken Road', description: 'Large potholes near school.', status: 'In Progress', date: 'Oct 10, 2026', gp: 'Gazole II', category: 'Roads', applicant: 'Priya Das' }
  ]
};

document.addEventListener('DOMContentLoaded', function() {
  renderGrievances();
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    AppState.currentUser = JSON.parse(savedUser);
    updateUIForLoggedInUser();
  }
});

function navigateTo(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + pageName);
  if (page) { page.classList.add('active'); AppState.currentPage = pageName; }

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-page="${pageName}"]`);
  if (navItem) navItem.classList.add('active');

  window.scrollTo(0, 0);
  if (pageName === 'grievances') renderGrievances();
}

function nextStep(step) {
  if (!validateStep(AppState.currentStep)) return;
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active', 'completed'));

  document.getElementById('step-' + step).classList.add('active');
  for (let i = 1; i <= 3; i++) {
    const stepEl = document.querySelector(`.step[data-step="${i}"]`);
    if (i < step) stepEl.classList.add('completed');
    if (i === step) stepEl.classList.add('active');
  }
  AppState.currentStep = step;
  window.scrollTo(0, 0);
}

function prevStep(step) {
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active', 'completed'));
  document.getElementById('step-' + step).classList.add('active');
  for (let i = 1; i <= 3; i++) {
    const stepEl = document.querySelector(`.step[data-step="${i}"]`);
    if (i < step) stepEl.classList.add('completed');
    if (i === step) stepEl.classList.add('active');
  }
  AppState.currentStep = step;
  window.scrollTo(0, 0);
}

function validateStep(step) {
  if (step === 1) {
    const required = ['fullName', 'mobile', 'relation', 'guardianName', 'gramPanchayat', 'village'];
    for (let id of required) {
      if (!document.getElementById(id).value.trim()) {
        showToast('Please fill all required fields', 'error');
        return false;
      }
    }
  }
  if (step === 2) {
    if (!document.getElementById('category').value || !document.getElementById('description').value.trim()) {
      showToast('Please fill all required fields', 'error');
      return false;
    }
  }
  return true;
}

document.getElementById('grievanceForm').addEventListener('submit', function(e) {
  e.preventDefault();
  if (!validateStep(3)) return;

  const gp = document.getElementById('gramPanchayat').value;
  const gpCode = gp.replace(/\s+/g, '-').toUpperCase();
  const year = new Date().getFullYear();
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  const complaintId = `GZL/JS/${year}/${gpCode}/${seq}`;

  AppState.grievances.unshift({
    id: complaintId,
    title: document.getElementById('category').value,
    description: document.getElementById('description').value,
    status: 'Pending',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    gp: gp,
    category: document.getElementById('category').value,
    applicant: document.getElementById('fullName').value
  });

  document.getElementById('successComplaintId').textContent = complaintId;
  navigateTo('success');
  document.getElementById('grievanceForm').reset();
  AppState.uploadedFiles = [];
  renderFileList();
  AppState.currentStep = 1;
  nextStep(1);
  showToast('Grievance submitted successfully!', 'success');
});

function handleFileSelect(event) {
  Array.from(event.target.files).forEach(file => {
    if (file.size > 5 * 1024 * 1024) {
      showToast('File too large (Max 5MB)', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      AppState.uploadedFiles.push({ name: file.name, data: e.target.result });
      renderFileList();
    };
    reader.readAsDataURL(file);
  });
  event.target.value = '';
}

function renderFileList() {
  const container = document.getElementById('fileList');
  container.innerHTML = AppState.uploadedFiles.map((file, index) => `
    <div class="file-item">
      <span><i class="fas fa-file"></i> ${file.name}</span>
      <button type="button" class="remove-file" onclick="AppState.uploadedFiles.splice(${index}, 1); renderFileList();">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `).join('');
}

function renderGrievances() {
  const container = document.getElementById('grievancesList');
  if (!container) return;
  container.innerHTML = AppState.grievances.map(g => `
    <div class="card" style="cursor:pointer;" onclick="viewGrievance('${g.id}')">
      <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
        <span style="font-weight:700; color:var(--primary); font-family:monospace;">#${g.id}</span>
        <span class="status-badge status-${g.status.toLowerCase().replace(' ', '-')}">${g.status}</span>
      </div>
      <h3 style="font-size:15px; margin-bottom:6px;">${g.title}</h3>
      <p style="font-size:13px; color:var(--on-surface-variant); margin-bottom:12px;">${g.description}</p>
      <div style="display:flex; flex-wrap:wrap; gap:12px; font-size:12px; color:var(--outline);">
        <span><i class="fas fa-calendar"></i> ${g.date}</span>
        <span><i class="fas fa-map-marker-alt"></i> ${g.gp}</span>
        <span><i class="fas fa-user"></i> ${g.applicant}</span>
      </div>
    </div>
  `).join('');
}

function viewGrievance(id) {
  showToast('Viewing details for: ' + id, 'success');
}

function copyComplaintId() {
  const id = document.getElementById('successComplaintId').textContent;
  navigator.clipboard.writeText(id).then(() => {
    document.getElementById('copyText').textContent = 'Copied!';
    showToast('Complaint ID copied!', 'success');
    setTimeout(() => { document.getElementById('copyText').textContent = 'Copy'; }, 2000);
  });
}

function downloadAcknowledgement() {
  showToast('Acknowledgement downloaded!', 'success');
}

function resetAndSubmitAnother() {
  navigateTo('submit');
}

function openAddCategoryModal() {
  document.getElementById('addCategoryModal').classList.add('active');
}

function addNewCategory() {
  const name = document.getElementById('newCategoryName').value.trim();
  if (!name) { showToast('Please enter category name', 'error'); return; }

  const select = document.getElementById('category');
  const option = document.createElement('option');
  option.value = name; option.textContent = name;
  select.appendChild(option);
  select.value = name;

  document.getElementById('newCategoryName').value = '';
  closeModal('addCategoryModal');
  showToast('Category added successfully!', 'success');
}

function showInfoModal(type) {
  const title = document.getElementById('infoModalTitle');
  const body = document.getElementById('infoModalBody');
  if (type === 'how') {
    title.textContent = 'How it Works / কীভাবে কাজ করে';
    body.innerHTML = `<ol style="padding-left:20px; line-height:1.8;"><li>Submit your grievance online or visit during hearing hours.</li><li>Receive a unique Complaint ID.</li><li>Track your complaint status anytime.</li><li>Get resolution updates from concerned officers.</li></ol>`;
  } else {
    title.textContent = 'Contact Us / যোগাযোগ করুন';
    body.innerHTML = `<p><strong>Office of the Block Development Officer</strong><br>Gazole Development Block, Malda, West Bengal - 732122<br><br>Email: bdo.gazole@gmail.com</p>`;
  }
  document.getElementById('infoModal').classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('active');
  });
});

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show ' + type;
  setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

function updateUIForLoggedInUser() {
  if (AppState.currentUser) {
    document.getElementById('dashUserName').textContent = AppState.currentUser.name;
  }
}

document.getElementById('officerLoginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  AppState.currentUser = { name: 'BDO Gazole', role: 'Admin' };
  localStorage.setItem('currentUser', JSON.stringify(AppState.currentUser));
  updateUIForLoggedInUser();
  showToast('Login successful!', 'success');
  navigateTo('dashboard');
});
