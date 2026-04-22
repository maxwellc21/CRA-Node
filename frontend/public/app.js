const api = {
  async get(url, token) {
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return res.json();
  },
  async post(url, body, token) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body)
    });
    return res.json();
  },
  async put(url, body, token) {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(body)
    });
    return res.json();
  },
  async delete(url, token) {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return res.json();
  }
};

let selectedProductId = null;
let authMode = 'login';
const authModal = new bootstrap.Modal(document.getElementById('authModal'));

function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

function setSession(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  updateAuthButtons();
}

function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateAuthButtons();
}

function showAlert(message, type = 'success') {
  document.getElementById('alertBox').innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
}

function updateAuthButtons() {
  const loggedIn = !!getToken();
  document.getElementById('logoutBtn').classList.toggle('d-none', !loggedIn);
  document.getElementById('openLoginBtn').classList.toggle('d-none', loggedIn);
  document.getElementById('openRegisterBtn').classList.toggle('d-none', loggedIn);
}

function renderAuthForm() {
  const form = document.getElementById('authForm');
  const title = document.getElementById('authModalTitle');
  title.textContent = authMode === 'login' ? 'Login' : 'Register';

  form.innerHTML = authMode === 'login' ? `
    <div class="mb-3">
      <label class="form-label">Email</label>
      <input type="email" id="authEmail" class="form-control" required>
    </div>
    <div class="mb-3">
      <label class="form-label">Password</label>
      <input type="password" id="authPassword" class="form-control" required>
    </div>
    <button class="btn btn-primary w-100" type="submit">Login</button>
  ` : `
    <div class="row g-3">
      <div class="col-12">
        <label class="form-label">Full name</label>
        <input type="text" id="authName" class="form-control" required>
      </div>
      <div class="col-md-6">
        <label class="form-label">Gender</label>
        <input type="text" id="authGender" class="form-control" placeholder="Male/Female/Other">
      </div>
      <div class="col-md-6">
        <label class="form-label">Contact number</label>
        <input type="text" id="authContact" class="form-control">
      </div>
      <div class="col-12">
        <label class="form-label">Address</label>
        <input type="text" id="authAddress" class="form-control">
      </div>
      <div class="col-12">
        <label class="form-label">Email</label>
        <input type="email" id="authEmail" class="form-control" required>
      </div>
      <div class="col-12">
        <label class="form-label">Password</label>
        <input type="password" id="authPassword" class="form-control" required>
      </div>
    </div>
    <button class="btn btn-success w-100 mt-3" type="submit">Create Account</button>
  `;
}

async function loadProducts() {
  const products = await api.get('/api/products');
  const list = document.getElementById('productList');

  if (!Array.isArray(products) || !products.length) {
    list.innerHTML = '<p class="text-muted">No products found yet. Click "Seed Demo Products".</p>';
    return;
  }

  list.innerHTML = products.map(product => `
    <div class="col-md-4">
      <div class="card h-100 shadow-sm product-card">
        <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
        <div class="card-body d-flex flex-column">
          <span class="badge text-bg-primary align-self-start mb-2">${product.category}</span>
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.description}</p>
          <p class="fw-bold mt-auto">$${product.price.toFixed(2)}</p>
          <button class="btn btn-outline-primary mt-2" onclick="showProductDetails('${product._id}')">View Details</button>
        </div>
      </div>
    </div>
  `).join('');
}

async function showProductDetails(productId) {
  selectedProductId = productId;
  const product = await api.get(`/api/products/${productId}`);
  const section = document.getElementById('productDetailsSection');
  const details = document.getElementById('productDetails');
  section.classList.remove('d-none');
  details.innerHTML = `
    <div class="card shadow-sm">
      <div class="row g-0">
        <div class="col-md-4"><img src="${product.imageUrl}" class="img-fluid rounded-start h-100" style="object-fit:cover;" alt="${product.name}"></div>
        <div class="col-md-8">
          <div class="card-body">
            <span class="badge text-bg-secondary mb-2">${product.category}</span>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="fw-bold">Price: $${product.price.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  `;
  await loadReviews(productId);
  section.scrollIntoView({ behavior: 'smooth' });
}

async function loadReviews(productId) {
  const reviews = await api.get(`/api/reviews/product/${productId}`);
  const user = getUser();
  const list = document.getElementById('reviewList');

  if (!Array.isArray(reviews) || !reviews.length) {
    list.innerHTML = '<p class="text-muted">No reviews yet. Be the first to review this item.</p>';
    return;
  }

  list.innerHTML = reviews.map(review => `
    <div class="review-item">
      <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
        <div>
          <h5 class="mb-1">${review.title}</h5>
          <div class="small text-muted">By ${review.userName} • Rating: ${'★'.repeat(review.rating)}</div>
        </div>
        ${user && user.id === review.userId ? `
          <div class="d-flex gap-2">
            <button class="btn btn-sm btn-outline-secondary" onclick='editReview(${JSON.stringify(review).replace(/'/g, "&#39;")})'>Edit</button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteReview('${review._id}')">Delete</button>
          </div>
        ` : ''}
      </div>
      <p class="mb-0 mt-2">${review.comment}</p>
    </div>
  `).join('');
}

function editReview(review) {
  document.getElementById('rating').value = review.rating;
  document.getElementById('reviewTitle').value = review.title;
  document.getElementById('reviewComment').value = review.comment;
  document.getElementById('reviewForm').dataset.editId = review._id;
  showAlert('Editing review. Update the form and submit.', 'info');
}

async function deleteReview(reviewId) {
  const token = getToken();
  if (!token) {
    return showAlert('Please log in first.', 'warning');
  }
  const result = await api.delete(`/api/reviews/${reviewId}`, token);
  if (result.message) showAlert(result.message, 'success');
  await loadReviews(selectedProductId);
  await loadProfile();
}

async function loadProfile() {
  const token = getToken();
  const container = document.getElementById('profileContent');

  if (!token) {
    container.innerHTML = '<p class="text-muted mb-0">Log in to view your profile.</p>';
    return;
  }

  const data = await api.get('/api/users/me', token);
  if (data.message) {
    container.innerHTML = `<p class="text-danger mb-0">${data.message}</p>`;
    return;
  }

  const { user, reviews } = data;
  container.innerHTML = `
    <div class="row g-4">
      <div class="col-md-4">
        <div class="border rounded p-3 bg-light">
          <h5>${user.name}</h5>
          <p class="mb-1"><strong>Email:</strong> ${user.email}</p>
          <p class="mb-1"><strong>Gender:</strong> ${user.gender || 'N/A'}</p>
          <p class="mb-1"><strong>Contact:</strong> ${user.contactNumber || 'N/A'}</p>
          <p class="mb-0"><strong>Address:</strong> ${user.address || 'N/A'}</p>
        </div>
      </div>
      <div class="col-md-8">
        <h5 class="mb-3">My Reviews</h5>
        ${reviews.length ? reviews.map(review => `
          <div class="border rounded p-3 mb-3">
            <div class="d-flex justify-content-between">
              <strong>${review.title}</strong>
              <span>Rating: ${review.rating}/5</span>
            </div>
            <p class="mb-0 mt-2">${review.comment}</p>
          </div>
        `).join('') : '<p class="text-muted">You have not posted any reviews yet.</p>'}
      </div>
    </div>
  `;
}

document.getElementById('openLoginBtn').addEventListener('click', () => {
  authMode = 'login';
  renderAuthForm();
  authModal.show();
});

document.getElementById('openRegisterBtn').addEventListener('click', () => {
  authMode = 'register';
  renderAuthForm();
  authModal.show();
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  clearSession();
  loadProfile();
  showAlert('Logged out successfully.', 'success');
});

document.getElementById('authForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  let payload;
  let endpoint;

  if (authMode === 'login') {
    endpoint = '/api/auth/login';
    payload = {
      email: document.getElementById('authEmail').value,
      password: document.getElementById('authPassword').value
    };
  } else {
    endpoint = '/api/auth/register';
    payload = {
      name: document.getElementById('authName').value,
      gender: document.getElementById('authGender').value,
      address: document.getElementById('authAddress').value,
      contactNumber: document.getElementById('authContact').value,
      email: document.getElementById('authEmail').value,
      password: document.getElementById('authPassword').value
    };
  }

  const result = await api.post(endpoint, payload);
  if (result.token) {
    setSession(result.token, result.user);
    authModal.hide();
    showAlert(result.message, 'success');
    loadProfile();
  } else {
    showAlert(result.message || 'Request failed.', 'danger');
  }
});

document.getElementById('reviewForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = getToken();
  if (!token) {
    return showAlert('You must log in before posting a review.', 'warning');
  }
  if (!selectedProductId) {
    return showAlert('Please open a product first.', 'warning');
  }

  const payload = {
    productId: selectedProductId,
    rating: Number(document.getElementById('rating').value),
    title: document.getElementById('reviewTitle').value,
    comment: document.getElementById('reviewComment').value
  };

  const editId = e.target.dataset.editId;
  const result = editId
    ? await api.put(`/api/reviews/${editId}`, payload, token)
    : await api.post('/api/reviews', payload, token);

  showAlert(result.message || 'Action completed.', result.review ? 'success' : 'danger');
  e.target.reset();
  delete e.target.dataset.editId;
  await loadReviews(selectedProductId);
  await loadProfile();
});

document.getElementById('seedBtn').addEventListener('click', async () => {
  const result = await api.post('/api/products/seed', {});
  showAlert(result.message || 'Seed attempted.', 'info');
  await loadProducts();
});

renderAuthForm();
updateAuthButtons();
loadProducts();
loadProfile();
