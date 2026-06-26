(function () {
  var currentDept = null;

  // ── Screen switching ─────────────────────────────────

  window.showHome = function () {
    document.getElementById('screen-detail').classList.remove('active');
    document.getElementById('screen-home').classList.add('active');
    document.getElementById('back-btn').classList.add('hidden');
  };

  function showDetail(dept) {
    currentDept = dept;
    document.getElementById('screen-home').classList.remove('active');
    document.getElementById('screen-detail').classList.add('active');
    document.getElementById('back-btn').classList.remove('hidden');
    populateDetail(dept);
  }

  // ── Populate detail screen ───────────────────────────

  function populateDetail(dept) {
    // Brief side
    document.getElementById('brief-dept-name').textContent = dept.name;
    document.getElementById('brief-text').textContent = dept.brief || 'Brief not available.';

    // Portrait — current HOD is chronicles[0]
    var current = (dept.chronicles && dept.chronicles[0]) || {};
    document.getElementById('portrait-role').textContent = current.role || '';
    document.getElementById('portrait-name').textContent = current.name || '—';

    var img = document.getElementById('portrait-img');
    var sil = document.getElementById('portrait-silhouette');
    if (current.photo) {
      img.src = current.photo;
      img.style.display = 'block';
      sil.classList.add('hidden');
    } else {
      img.style.display = 'none';
      sil.classList.remove('hidden');
    }

    // Show/hide profile button
    document.getElementById('profile-btn').style.display =
      (current.bio && current.bio.trim()) ? '' : 'none';

    // Chronicles strip
    buildChronicles(dept.chronicles || []);
  }

  function buildChronicles(chronicles) {
    var strip  = document.getElementById('chronicles-strip');
    var scroll = document.getElementById('chronicles-scroll');
    scroll.innerHTML = '';

    if (!chronicles || !chronicles.length) {
      strip.classList.add('hidden');
      return;
    }
    strip.classList.remove('hidden');

    chronicles.forEach(function (c, i) {
      var card = document.createElement('button');
      card.className = 'chronicle-card';
      card.style.animationDelay = (i * 40) + 'ms';

      var wrap = document.createElement('div');
      wrap.className = 'chronicle-photo-wrap';

      if (c.photo) {
        var cimg = document.createElement('img');
        cimg.className = 'chronicle-photo';
        cimg.src = c.photo;
        cimg.alt = c.name;
        wrap.appendChild(cimg);
      } else {
        var csil = document.createElement('div');
        csil.className = 'chronicle-sil';
        csil.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8"><circle cx="12" cy="8" r="5"/><path d="M3 21c0-5 3.582-9 9-9s9 4 9 9"/></svg>';
        wrap.appendChild(csil);
      }

      if (c.current) {
        var badge = document.createElement('div');
        badge.className = 'chronicle-badge';
        badge.textContent = 'CURRENT';
        wrap.appendChild(badge);
      }

      var info = document.createElement('div');
      info.className = 'chronicle-info';
      info.innerHTML =
        '<div class="chronicle-name">' + (c.name || '') + '</div>' +
        '<div class="chronicle-tenure">' + (c.tenure || '') + '</div>';

      card.appendChild(wrap);
      card.appendChild(info);
      card.addEventListener('click', function () { openChronicleProfile(c); });
      scroll.appendChild(card);
    });
  }

  // ── Profile modal ────────────────────────────────────

  function openModal(role, name, bio, photo) {
    document.getElementById('modal-role').textContent = role || '';
    document.getElementById('modal-name').textContent = name || '—';
    document.getElementById('modal-bio').textContent  = bio  || '';

    var img = document.getElementById('modal-photo');
    var sil = document.getElementById('modal-photo-silhouette');
    if (photo) {
      img.src = photo;
      img.style.display = 'block';
      sil.classList.add('hidden');
    } else {
      img.style.display = 'none';
      sil.classList.remove('hidden');
    }

    document.getElementById('modal').classList.remove('hidden');
    document.querySelector('.modal-bio-scroll').scrollTop = 0;
  }

  window.openProfile = function () {
    if (!currentDept) return;
    var c = (currentDept.chronicles && currentDept.chronicles[0]) || {};
    openModal(c.role, c.name, c.bio, c.photo);
  };

  function openChronicleProfile(c) {
    openModal(c.role, c.name, c.bio, c.photo);
  }

  window.closeProfile = function (e) {
    if (!e || e.target === document.getElementById('modal')) {
      document.getElementById('modal').classList.add('hidden');
    }
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeProfile();
  });

  // ── Build home grid ──────────────────────────────────

  function buildGrid(data) {
    var depts = Array.isArray(data.departments) ? data.departments : [];
    var grid = document.getElementById('dept-grid');

    depts.forEach(function (dept, i) {
      var card = document.createElement('div');
      card.className = 'dept-card';
      card.style.animationDelay = (i * 28) + 'ms';
      card.innerHTML =
        '<div class="dept-card-num">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<div class="dept-card-name">' + dept.name + '</div>' +
        '<div class="dept-card-footer">' +
          '<span class="dept-card-hod">' + ((dept.chronicles && dept.chronicles[0] && dept.chronicles[0].name) || '') + '</span>' +
          '<span class="dept-card-arrow">›</span>' +
        '</div>';
      card.addEventListener('click', function () { showDetail(dept); });
      grid.appendChild(card);
    });
  }

  if (typeof DEPT_DATA !== 'undefined') {
    buildGrid(DEPT_DATA);
  } else {
    fetch('data.json')
      .then(function (r) { return r.json(); })
      .then(buildGrid)
      .catch(function (e) { console.error('data.json load error', e); });
  }
})();
