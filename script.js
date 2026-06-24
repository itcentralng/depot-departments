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

    // Portrait
    document.getElementById('portrait-role').textContent = dept.hod_role || '';
    document.getElementById('portrait-name').textContent = dept.hod_name || '—';

    var img = document.getElementById('portrait-img');
    var sil = document.getElementById('portrait-silhouette');
    if (dept.photo) {
      img.src = dept.photo;
      img.style.display = 'block';
      sil.classList.add('hidden');
    } else {
      img.style.display = 'none';
      sil.classList.remove('hidden');
    }

    // Show/hide profile button
    document.getElementById('profile-btn').style.display =
      (dept.hod_bio && dept.hod_bio.trim()) ? '' : 'none';

    // Members strip
    buildMembersStrip(dept.members || []);
  }

  function buildMembersStrip(members) {
    var strip = document.getElementById('members-strip');
    var scroll = document.getElementById('members-scroll');
    scroll.innerHTML = '';

    if (!members || !members.length) {
      strip.classList.add('hidden');
      return;
    }
    strip.classList.remove('hidden');

    members.forEach(function (m, i) {
      var card = document.createElement('div');
      card.className = 'member-card';
      card.style.animationDelay = (i * 30) + 'ms';

      var wrap = document.createElement('div');
      wrap.className = 'member-photo-wrap';

      if (m.photo) {
        var mimg = document.createElement('img');
        mimg.className = 'member-photo';
        mimg.src = m.photo;
        mimg.alt = m.name;
        wrap.appendChild(mimg);
        var sil = document.createElement('div');
        sil.className = 'member-sil hidden';
        sil.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8"><circle cx="12" cy="8" r="5"/><path d="M3 21c0-5 3.582-9 9-9s9 4 9 9"/></svg>';
        wrap.appendChild(sil);
      } else {
        var sil = document.createElement('div');
        sil.className = 'member-sil';
        sil.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8"><circle cx="12" cy="8" r="5"/><path d="M3 21c0-5 3.582-9 9-9s9 4 9 9"/></svg>';
        wrap.appendChild(sil);
      }

      var nameEl = document.createElement('div');
      nameEl.className = 'member-name';
      nameEl.textContent = m.name;

      card.appendChild(wrap);
      card.appendChild(nameEl);
      card.addEventListener('click', function () { openMemberProfile(m); });
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
    var d = currentDept;
    openModal(d.hod_role, d.hod_name, d.hod_bio, d.photo);
  };

  function openMemberProfile(m) {
    openModal('', m.name, m.bio, m.photo);
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

  fetch('data.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
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
            '<span class="dept-card-hod">' + (dept.hod_name || '') + '</span>' +
            '<span class="dept-card-arrow">›</span>' +
          '</div>';
        card.addEventListener('click', function () { showDetail(dept); });
        grid.appendChild(card);
      });
    })
    .catch(function (e) { console.error('data.json load error', e); });
})();
