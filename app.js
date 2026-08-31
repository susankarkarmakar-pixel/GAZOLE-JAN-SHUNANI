/**
 * GAZOLE JAN SHUNANI - Frontend Application
 * Version: 1.0.0
 */

// ===== APP STATE =====
const AppState = {
  currentPage: 'home',
  currentStep: 1,
  currentUser: null,
  uploadedFiles: [],
  grievances: [],
  users: [],
  categories: [
    'Water Supply', 'Roads', 'Electricity', 'Panchayat Services',
    'Sanitation', 'Health', 'Education', 'Other'
  ]
};

// ===== SAMPLE DATA =====
const sampleGrievances = [
  {
    id: 'GZL/JS/2026/GAZOLE-I/0001',
    title: 'Water Supply Issue in Ward 4',
    description: 'No drinking water supply for the last 3 days in the main market area.',
    status: 'Pending',
    date: 'Oct 12, 2026',
    gp: 'Gazole I',
    category: 'Water',
    applicant: 'Rahul Mandal',
    phone: '+91 98765 43210',
    address: 'Ward 5, Gazole Market Area'
  },
  {
    id: 'GZL/JS/2026/GAZOLE-II/0002',
    title: 'Broken Road near School',
    description: 'The main road connecting to the primary school has large potholes causing accidents.',
    status: 'In Progress',
    date: 'Oct 10, 2026',
    gp: 'Gazole II',
    category: 'Roads',
    applicant: 'Priya Das',
    phone: '+91 98765 12345',
    address: 'Near Primary School, Gazole II'
  },
  {
    id: 'GZL/JS/2026/ALAL/0003',
    title: 'Streetlight Malfunction',
    description: 'Streetlights on Bank Road are not working, causing safety concerns at night.',
    status: 'Resolved',
    date: 'Oct 05, 2026',
    gp: 'Alal',
    category: 'Electricity',
    applicant: 'Amit Sarkar',
    phone: '+91 98765 67890',
    address: 'Bank Road, Alal'
  }
];

const sampleUsers = [
  { userId: 'USR001', name: 'Rahim Uddin', role: 'Admin', gp: 'HQ', status: 'Active' },
  { userId: 'USR002', name: 'Anjali Roy', role: 'Operator', gp: 'Gazole I', status: 'Active' },
  { userId: 'USR003', name: 'Bikash Das', role: 'Viewer', gp: 'Alal', status: 'Active' }
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  AppState.grievances = sampleGrievances;
  AppState.users = sampleUsers;
  
  renderGrievances();
  renderUsers();
  renderDashboardCharts();
  
  // Check saved user
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    AppState.currentUser = JSON.parse(savedUser);
    updateUIForLoggedInUser();
  }
  
  console.log('GAZOLE JAN SHUNANI initialized');
});

// ===== NAVIGATION =====
function navigateTo(pageName) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  // Show target page
  const page = document.getElementById('page-' + pageName);
  if (page) {
    page.classList.add('active');
    AppState.currentPage = pageName;
  }
  
  // Update nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-page="${pageName}"]`);
  if (navItem) navItem.classList.add('active');
  
  // Update header action button
  const headerBtn = document.getElementById('headerActionBtn');
  if (pageName === 'login' || pageName === 'dashboard' || pageName === 'users') {
    headerBtn.style.display = 'none';
  } else {
    headerBtn.style.display = 'block';
  }
  
  // Scroll to top
  window.scrollTo(0, 0);
  
  // Page-specific actions
  if (pageName === 'grievances') renderGrievances();
  if (pageName === 'dashboard') renderDashboardCharts();
  if (pageName === 'users') renderUsers();
}

// ===== FORM STEPPER =====
function nextStep(step) {
  // Validate current step
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
      const el = document.getElementById(id);
      if (!el.value.trim()) {
        showToast('Please fill all required fields', 'error');
        el.focus();
        return false;
      }
    }
    const mobile = document.getElementById('mobile').value;
    if (!/^[0-9]{10}$/.test(mobile)) {
      showToast('Please enter valid 10-digit mobile number', 'error');
      return false;
    }
  }
  if (step === 2) {
    if (!document.getElementById('category').value) {
      showToast('Please select a category', 'error');
      return false;
    }
    if (!document.getElementById('description').value.trim()) {
      showToast('Please enter description', 'error');
      return false;
    }
  }
  return true;
}

// ===== FORM SUBMISSION =====
document.getElementById('grievanceForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  if (!validateStep(3)) return;
  
  const formData = {
    fullName: document.getElementById('fullName').value,
    mobile: document.getElementById('mobile').value,
    relation: document.getElementById('relation').value,
    guardianName: document.getElementById('guardianName').value,
    gramPanchayat: document.getElementById('gramPanchayat').value,
    village: document.getElementById('village').value,
    category: document.getElementById('category').value,
    description: document.getElementById('description').value,
    files: AppState.uploadedFiles,
    source: 'Online'
  };
  
  // Generate Complaint ID
  const gpCode = getGPCode(formData.gramPanchayat);
  const year = new Date().getFullYear();
  const sequence = String(Math.floor(Math.random() * 9000) + 1000);
  const complaintId = `GZL/JS/${year}/${gpCode}/${sequence}`;
  
  // Add to grievances
  const newGrievance = {
    id: complaintId,
    title: formData.category + ' - ' + formData.village,
    description: formData.description,
    status: 'Pending',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    gp: formData.gramPanchayat,
    category: formData.category,
    applicant: formData.fullName,
    phone: formData.mobile,
    address: formData.village
  };
  
  AppState.grievances.unshift(newGrievance);
  
  // Show success
  document.getElementById('successComplaintId').textContent = complaintId;
  navigateTo('success');
  
  // Reset form
  document.getElementById('grievanceForm').reset();
  AppState.uploadedFiles = [];
  renderFileList();
  AppState.currentStep = 1;
  nextStep(1);
  
  showToast('Grievance submitted successfully!', 'success');
});

function getGPCode(gpName) {
  const codes = {
    'Gazole I': 'GAZOLE-I',
    'Gazole II': 'GAZOLE-II',
    'Alal': 'ALAL',
    'Bairgachi I': 'BAIRGACHI-I',
    'Bairgachi II': 'BAIRGACHI-II',
    'Babupur': 'BABUPUR',
    'Chaknagar': 'CHAKNAGAR',
    'Deotala': 'DEOTALA',
    'Majhra': 'MAJHRA',
    'Karkach': 'KARKACH',
    'Pandua': 'PANDUA',
    'Raniganj I': 'RANIGANJ-I',
    'Raniganj II': 'RANIGANJ-II',
    'Salaidanga': 'SALAIDANGA',
    'Sahajadpur': 'SAHAJADPUR'
  };
  return codes[gpName] || 'UNKNOWN';
}

// ===== FILE UPLOAD =====
function handleFileSelect(event) {
  const files = Array.from(event.target.files);
  processFiles(files);
}

function processFiles(files) {
  files.forEach(file => {
    if (file.size > 5 * 1024 * 1024) {
      showToast('File too large: ' + file.name + ' (Max 5MB)', 'error');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      AppState.uploadedFiles.push({
        name: file.name,
        type: file.type,
        data: e.target.result
      });
      renderFileList();
    };
    reader.readAsDataURL(file);
  });
  
  event.target.value = '';
}

function renderFileList() {
  const container = document.getElementById('fileList');
  if (AppState.uploadedFiles.length === 0) {
    container.innerHTML = '';
    return;
  }
  
  container.innerHTML = AppState.uploadedFiles.map((file, index) => `
    <div class="file-item">
      <span><i class="fas fa-file"></i> ${file.name}</span>
      <button type="button" class="remove-file" onclick="removeFile(${index})">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `).join('');
}

function removeFile(index) {
  AppState.uploadedFiles.splice(index, 1);
  renderFileList();
}

// Drag and drop
const uploadZone = document.getElementById('uploadZone');
if (uploadZone) {
  uploadZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.style.borderColor = 'var(--primary)';
    this.style.background = 'var(--primary-fixed)';
  });
  
  uploadZone.addEventListener('dragleave', function(e) {
    e.preventDefault();
    this.style.borderColor = 'var(--border)';
    this.style.background = 'var(--surface-dim)';
  });
  
  uploadZone.addEventListener('drop', function(e) {
    e.preventDefault();
    this.style.borderColor = 'var(--border)';
    this.style.background = 'var(--surface-dim)';
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  });
}

// ===== GRIEVANCES LIST =====
function renderGrievances() {
  const container = document.getElementById('grievancesList');
  const filtered = filterGrievancesData();
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center" style="padding: 40px 20px; color: var(--text-light);">
        <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 16px;"></i>
        <p>No grievances found</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filtered.map(g => `
    <div class="grievance-card" onclick="viewGrievance('${g.id}')">
      <div class="grievance-card-header">
        <div class="grievance-id">#${g.id}</div>
        <span class="status-badge ${getStatusClass(g.status)}">${g.status}</span>
      </div>
      <div class="grievance-title">${g.title}</div>
      <div class="grievance-desc">${g.description}</div>
      <div class="grievance-meta">
        <span><i class="fas fa-calendar"></i> ${g.date}</span>
        <span><i class="fas fa-map-marker-alt"></i> ${g.gp}</span>
        <span><i class="fas fa-tag"></i> ${g.category}</span>
        <span><i class="fas fa-user"></i> ${g.applicant}</span>
      </div>
      <div class="grievance-actions">
        <button class="btn btn-primary" onclick="event.stopPropagation(); viewGrievance('${g.id}')">
          <i class="fas fa-eye"></i> View Details
        </button>
      </div>
    </div>
  `).join('');
}

function filterGrievancesData() {
  const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const status = document.getElementById('filterStatus')?.value || '';
  const category = document.getElementById('filterCategory')?.value || '';
  const gp = document.getElementById('filterGP')?.value || '';
  
  return AppState.grievances.filter(g => {
    if (search && !g.id.toLowerCase().includes(search) && !g.applicant.toLowerCase().includes(search) && !g.title.toLowerCase().includes(search)) return false;
    if (status && g.status !== status) return false;
    if (category && g.category !== category) return false;
    if (gp && g.gp !== gp) return false;
    return true;
  });
}

function filterGrievances() {
  renderGrievances();
}

function viewGrievance(id) {
  const grievance = AppState.grievances.find(g => g.id === id);
  if (!grievance) return;
  
  document.getElementById('detailsId').textContent = grievance.id;
  document.getElementById('detailsStatus').textContent = grievance.status;
  document.getElementById('detailsStatus').className = 'status-badge ' + getStatusClass(grievance.status);
  document.getElementById('detailName').textContent = grievance.applicant;
  document.getElementById('detailPhone').textContent = grievance.phone;
  document.getElementById('detailAddress').textContent = grievance.address;
  document.getElementById('detailGP').textContent = grievance.gp;
  document.getElementById('detailCategory').innerHTML = '<i class="fas fa-tag"></i> ' + grievance.category;
  document.getElementById('detailDate').textContent = grievance.date;
  document.getElementById('detailDescription').textContent = grievance.description;
  
  // Show update button for logged-in users
  const updateBtn = document.getElementById('updateStatusBtn');
  if (AppState.currentUser) {
    updateBtn.style.display = 'block';
  } else {
    updateBtn.style.display = 'none';
  }
  
  navigateTo('details');
}

function getStatusClass(status) {
  const classes = {
    'Pending': 'status-pending',
    'In Progress': 'status-in-progress',
    'Resolved': 'status-resolved',
    'Escalated': 'status-escalated',
    'Closed': 'status-closed'
  };
  return classes[status] || 'status-pending';
}

// ===== TRACK GRIEVANCE =====
function trackGrievance() {
  const id = document.getElementById('trackId').value.trim();
  if (!id) {
    showToast('Please enter Complaint ID', 'error');
    return;
  }
  
  const grievance = AppState.grievances.find(g => g.id === id);
  
  if (!grievance) {
    document.getElementById('trackResult').innerHTML = `
      <div class="alert alert-danger" style="background: var(--danger-bg); color: var(--danger-text); padding: 16px; border-radius: var(--radius); border-left: 4px solid var(--danger);">
        <i class="fas fa-exclamation-circle"></i>
        <strong>Complaint not found</strong>
        <p style="margin-top: 4px; font-size: 13px;">Please check the ID and try again.</p>
      </div>
    `;
    return;
  }
  
  const maskedName = maskText(grievance.applicant);
  const maskedPhone = maskPhone(grievance.phone);
  
  document.getElementById('trackResult').innerHTML = `
    <div class="track-result-card">
      <div class="track-id-display">
        <div class="track-id-value">${grievance.id}</div>
        <span class="status-badge ${getStatusClass(grievance.status)}">${grievance.status}</span>
      </div>
      
      <div class="track-info-grid">
        <div class="track-info-row">
          <span class="label">Category</span>
          <span class="value">${grievance.category}</span>
        </div>
        <div class="track-info-row">
          <span class="label">Applicant</span>
          <span class="value">${maskedName}</span>
        </div>
        <div class="track-info-row">
          <span class="label">Contact</span>
          <span class="value">${maskedPhone}</span>
        </div>
        <div class="track-info-row">
          <span class="label">Date Submitted</span>
          <span class="value">${grievance.date}</span>
        </div>
      </div>
      
      <h4 style="color: var(--primary); margin-bottom: 12px; font-size: 15px;">Progress Tracking</h4>
      <div class="timeline">
        <div class="timeline-item completed">
          <div class="timeline-time">${grievance.date} - 10:30 AM</div>
          <div class="timeline-action">Grievance Submitted</div>
          <div class="timeline-desc">অভিযোগ জমা দেওয়া হয়েছে</div>
        </div>
        <div class="timeline-item ${grievance.status !== 'Pending' ? 'completed' : 'current'}">
          <div class="timeline-time">${grievance.status !== 'Pending' ? grievance.date : 'Pending'}</div>
          <div class="timeline-action">Assigned to Department</div>
          <div class="timeline-desc">বিভাগে বরাদ্দ করা হয়েছে</div>
        </div>
        <div class="timeline-item ${['In Progress', 'Resolved', 'Closed'].includes(grievance.status) ? 'completed' : ''}">
          <div class="timeline-action">Under Review</div>
          <div class="timeline-desc">পর্যালোচনাধীন - Field officer assessing the complaint</div>
        </div>
        <div class="timeline-item ${grievance.status === 'Resolved' || grievance.status === 'Closed' ? 'completed' : ''}">
          <div class="timeline-action">Resolved</div>
          <div class="timeline-desc">সমাধান করা হয়েছে - Awaiting final action</div>
        </div>
      </div>
    </div>
  `;
}

function maskText(text) {
  if (text.length <= 2) return text;
  return text[0] + '****' + text[text.length - 1];
}

function maskPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 6) return phone;
  return '+91-' + digits.substring(0, 2) + '****' + digits.substring(digits.length - 4);
}

// ===== LOGIN =====
function switchLoginTab(tab) {
  document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.login-tab[data-tab="${tab}"]`).classList.add('active');
  
  if (tab === 'officer') {
    document.getElementById('officerLoginForm').style.display = 'block';
    document.getElementById('adminLoginForm').style.display = 'none';
  } else {
    document.getElementById('officerLoginForm').style.display = 'none';
    document.getElementById('adminLoginForm').style.display = 'block';
  }
}

function handleOfficerLogin(e) {
  e.preventDefault();
  
  const mobile = document.getElementById('loginMobile').value;
  const pin = document.getElementById('loginPin').value;
  
  // Demo login (replace with actual authentication)
  const user = AppState.users.find(u => u.mobile === mobile || u.userId === 'USR001');
  
  if (pin.length === 4) {
    AppState.currentUser = {
      userId: 'USR001',
      name: 'Rahim Uddin',
      role: 'Admin',
      gp: 'HQ'
    };
    localStorage.setItem('currentUser', JSON.stringify(AppState.currentUser));
    updateUIForLoggedInUser();
    showToast('Login successful!', 'success');
    navigateTo('dashboard');
  } else {
    showToast('Invalid credentials', 'error');
  }
  
  return false;
}

function handleAdminLogin(e) {
  e.preventDefault();
  
  const password = document.getElementById('adminPassword').value;
  
  if (password === 'BDO@Gazole2026') {
    AppState.currentUser = {
      userId: 'ADMIN001',
      name: 'BDO Gazole',
      role: 'Admin',
      gp: 'All'
    };
    localStorage.setItem('currentUser', JSON.stringify(AppState.currentUser));
    updateUIForLoggedInUser();
    showToast('Admin login successful!', 'success');
    navigateTo('dashboard');
  } else {
    showToast('Invalid password', 'error');
  }
  
  return false;
}

function updateUIForLoggedInUser() {
  if (AppState.currentUser) {
    document.getElementById('dashUserName').textContent = AppState.currentUser.name;
    document.getElementById('headerActionBtn').innerHTML = '<i class="fas fa-user-check"></i>';
    document.getElementById('headerActionBtn').onclick = function() { navigateTo('dashboard'); };
    
    if (AppState.currentUser.role === 'Admin') {
      document.getElementById('adminActions').style.display = 'block';
    }
  }
}

// ===== DASHBOARD =====
function renderDashboardCharts() {
  // Category chart
  const categoryData = {
    'Water': 320,
    'Roads': 280,
    'Health': 245,
    'Education': 198,
    'Other': 205
  };
  
  const maxCat = Math.max(...Object.values(categoryData));
  const categoryChart = document.getElementById('categoryChart');
  if (categoryChart) {
    categoryChart.innerHTML = Object.entries(categoryData).map(([cat, count]) => `
      <div class="chart-bar">
        <div class="label">${cat}</div>
        <div class="bar"><div class="bar-fill" style="width: ${(count/maxCat)*100}%"></div></div>
        <div class="value">${count}</div>
      </div>
    `).join('');
  }
  
  // Ageing chart
  const ageingData = [
    { label: '0-7 Days (০-৭ দিন)', value: 120, color: 'green' },
    { label: '8-15 Days (৮-৫ দিন)', value: 180, color: 'yellow' },
    { label: '15+ Days (১৫+ দিন)', value: 42, color: 'red' }
  ];
  
  const maxAge = Math.max(...ageingData.map(d => d.value));
  const ageingChart = document.getElementById('ageingChart');
  if (ageingChart) {
    ageingChart.innerHTML = ageingData.map(d => `
      <div class="ageing-bar">
        <div class="label">${d.label}</div>
        <div class="bar"><div class="bar-fill ${d.color}" style="width: ${(d.value/maxAge)*100}%"></div></div>
        <div class="value">${d.value}</div>
      </div>
    `).join('');
  }
}

// ===== USER MANAGEMENT =====
function renderUsers() {
  const tbody = document.getElementById('usersTableBody');
  if (!tbody) return;
  
  const search = document.getElementById('userSearch')?.value.toLowerCase() || '';
  const filtered = AppState.users.filter(u => 
    u.name.toLowerCase().includes(search) || u.gp.toLowerCase().includes(search)
  );
  
  tbody.innerHTML = filtered.map(u => `
    <tr>
      <td><strong>${u.userId}</strong></td>
      <td>${u.name}</td>
      <td><span class="status-badge status-in-progress">${u.role}</span></td>
      <td>${u.gp}</td>
      <td><span class="status-badge status-resolved">${u.status}</span></td>
    </tr>
  `).join('');
}

function filterUsers() {
  renderUsers();
}

function handleCreateUser(e) {
  e.preventDefault();
  
  const newUser = {
    userId: 'USR' + String(AppState.users.length + 1).padStart(3, '0'),
    name: document.getElementById('newUserName').value,
    role: document.getElementById('newUserRole').value,
    gp: document.getElementById('newUserGP').value,
    status: 'Active'
  };
  
  AppState.users.push(newUser);
  renderUsers();
  
  document.getElementById('createUserForm').reset();
  showToast('User created successfully!', 'success');
  
  return false;
}

// ===== UPDATE STATUS MODAL =====
function openUpdateStatusModal() {
  document.getElementById('updateStatusModal').classList.add('active');
}

function saveStatusUpdate() {
  const status = document.getElementById('updateStatus').value;
  const action = document.getElementById('updateAction').value;
  const remarks = document.getElementById('updateRemarks').value;
  
  if (!status) {
    showToast('Please select a status', 'error');
    return;
  }
  
  closeModal('updateStatusModal');
  showToast('Status updated successfully!', 'success');
  
  // Update the displayed grievance
  const id = document.getElementById('detailsId').textContent;
  const grievance = AppState.grievances.find(g => g.id === id);
  if (grievance) {
    grievance.status = status;
  }
}

// ===== ADD CATEGORY MODAL =====
function openAddCategoryModal() {
  document.getElementById('addCategoryModal').classList.add('active');
}

function addNewCategory() {
  const name = document.getElementById('newCategoryName').value.trim();
  if (!name) {
    showToast('Please enter category name', 'error');
    return;
  }
  
  AppState.categories.push(name);
  
  // Add to select dropdown
  const select = document.getElementById('category');
  const option = document.createElement('option');
  option.value = name;
  option.textContent = name;
  select.appendChild(option);
  select.value = name;
  
  document.getElementById('newCategoryName').value = '';
  closeModal('addCategoryModal');
  showToast('Category added successfully!', 'success');
}

// ===== MODALS =====
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('active');
    }
  });
});

// ===== INFO MODAL =====
function showInfoModal(type) {
  const title = document.getElementById('infoModalTitle');
  const body = document.getElementById('infoModalBody');
  
  if (type === 'how') {
    title.textContent = 'How it Works / কীভাবে কাজ করে';
    body.innerHTML = `
      <ol style="padding-left: 20px; line-height: 1.8;">
        <li><strong>Submit your grievance</strong> online or visit during hearing hours</li>
        <li><strong>Receive a unique Complaint ID</strong> (e.g., GZL/JS/2026/GAZOLE-I/0001)</li>
        <li><strong>Track your complaint status</strong> anytime using the ID</li>
        <li><strong>Get resolution updates</strong> from concerned officers</li>
      </ol>
      <p style="margin-top: 16px; padding: 12px; background: var(--info-bg); border-radius: var(--radius); font-size: 13px;">
        <strong>Hearing Schedule:</strong><br>
        Tuesday & Thursday, 10:30 AM - 1:00 PM<br>
        মঙ্গলবার ও বৃহস্পতিবার, সকাল ১০:০টা - দুপুর ১:০টা
      </p>
    `;
  } else if (type === 'contact') {
    title.textContent = 'Contact Us / যোগাযোগ করুন';
    body.innerHTML = `
      <div style="line-height: 1.8;">
        <p><strong>Office of the Block Development Officer</strong></p>
        <p>Gazole Development Block</p>
        <p>Malda, West Bengal - 732122</p>
        <p style="margin-top: 12px;"><strong>Email:</strong> bdo.gazole@gmail.com</p>
        <p><strong>Phone:</strong> +91-XXXXX-XXXXX</p>
        <p style="margin-top: 16px; padding: 12px; background: var(--warning-bg); border-radius: var(--radius); font-size: 13px;">
          <strong>Office Hours:</strong><br>
          Monday - Saturday, 10:00 AM - 5:00 PM
        </p>
      </div>
    `;
  }
  
  document.getElementById('infoModal').classList.add('active');
}

// ===== SUCCESS PAGE ACTIONS =====
function copyComplaintId() {
  const id = document.getElementById('successComplaintId').textContent;
  navigator.clipboard.writeText(id).then(() => {
    document.getElementById('copyText').textContent = 'Copied!';
    showToast('Complaint ID copied!', 'success');
    setTimeout(() => {
      document.getElementById('copyText').textContent = 'Copy';
    }, 2000);
  });
}

function downloadAcknowledgement() {
  const id = document.getElementById('successComplaintId').textContent;
  showToast('Acknowledgement downloaded!', 'success');
  console.log('Download acknowledgement for:', id);
}

function resetAndSubmitAnother() {
  navigateTo('submit');
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show ' + type;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      m.classList.remove('active');
    });
  }
});

console.log('GAZOLE JAN SHUNANI App loaded successfully');