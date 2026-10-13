/* InfaBuild — app shell (ports inc/header.php + inc/footer.php).
 * TZ.mount({page, title, action}, renderFn) builds the sidebar/topbar layout,
 * enforces login, shows flashes, then calls renderFn(mainContentEl). */
(function () {
  var e = TZ.esc, icon = window.icon;

  var NAV = [
    { slug: 'dashboard', label: 'Dashboard', icon: 'dashboard', file: 'index.html' },
    { slug: 'projects', label: 'Projects', icon: 'folder', file: 'projects.html' },
    { slug: 'clients', label: 'Clients', icon: 'users', file: 'clients.html' },
    { slug: 'estimation', label: 'Estimation', icon: 'calculator', file: 'estimation.html' },
    { slug: 'materials', label: 'Materials', icon: 'package', file: 'materials.html' },
    { slug: 'purchase', label: 'Purchase', icon: 'cart', file: 'purchase.html' },
    { slug: 'finance', label: 'Finance', icon: 'dollar', file: 'finance.html' },
    { slug: 'reports', label: 'Reports', icon: 'bar-chart', file: 'reports.html' },
    { slug: 'workspace', label: 'Project Workspace', icon: 'building', file: 'workspace.html' },
    { slug: 'calendar', label: 'Calendar', icon: 'calendar', file: 'calendar.html' },
    { slug: 'account-tracker', label: 'Account Tracker', icon: 'credit-card', file: 'account_tracker.html' },
    { slug: 'settings', label: 'Settings', icon: 'settings', file: 'settings.html' },
  ];

  function initials(name) {
    var parts = String(name || 'U').trim().split(/\s+/);
    return (parts[0].charAt(0) + (parts[1] ? parts[1].charAt(0) : '')).toUpperCase() || 'U';
  }

  function navItem(it, page) {
    var on = it.slug === page;
    return '<li><a href="' + e(it.file) + '" title="' + e(it.label) + '" ' +
      'class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ' +
      (on ? 'bg-brand text-white shadow-lg' : 'text-blue-200 hover:bg-white/10 hover:text-white') + '">' +
      '<span class="flex-shrink-0">' + icon(it.icon, 18) + '</span>' +
      '<span class="truncate sb-label">' + e(it.label) + '</span>' +
      (on ? '<span class="ml-auto w-1.5 h-1.5 rounded-full bg-white/80 sb-label"></span>' : '') +
      '</a></li>';
  }

  var FLASH_CLS = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    error: 'bg-red-50 border-red-200 text-red-600',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
  };

  // Pages a non-admin (client/customer) may open. Everything else is admin-only.
  var MEMBER_PAGES = ['workspace', 'calendar', 'account-tracker', 'settings'];

  TZ.mount = function (opts, renderFn) {
    if (!TZ.requireLogin()) return;
    (TZ.ready || Promise.resolve()).then(function () { mountNow(opts, renderFn); });
  };
  function mountNow(opts, renderFn) {
    opts = opts || {};
    var page = opts.page || 'dashboard';
    // Role gate: a client/customer can only reach their allowed sections.
    if (!TZ.isAdmin() && MEMBER_PAGES.indexOf(page) < 0) {
      TZ.flash('That section is restricted to administrators.', 'error');
      location.replace('workspace.html');
      return;
    }
    var title = opts.title || 'Dashboard';
    var action = (opts.action && opts.action.label) ? opts.action : null;
    var user = TZ.currentUser();
    var nav = NAV.slice();
    if (TZ.isAdmin()) nav.push({ slug: 'admin', label: 'Admin Panel', icon: 'shield', file: 'admin.html' });
    var avatar = initials(user.name);

    document.title = title + ' · ' + TZ.APP_NAME;

    var management = nav.slice(8).map(function (it) { return navItem(it, page); }).join('');

    var html =
      '<div class="flex h-screen overflow-hidden bg-slate-100">' +
      '<div id="sb-backdrop" class="fixed inset-0 bg-black/40 z-40 hidden lg:hidden"></div>' +

      '<aside id="sidebar" class="sidebar-grad flex flex-col h-full flex-shrink-0 transition-all duration-300 fixed inset-y-0 left-0 z-50 -translate-x-full lg:static lg:translate-x-0">' +
        '<div class="flex items-center px-4 border-b border-white/10" style="height:64px">' +
          '<a href="' + (TZ.isAdmin() ? 'index.html' : 'workspace.html') + '" class="flex items-center gap-3 overflow-hidden">' +
            '<div class="flex items-center justify-center w-9 h-9 rounded-xl bg-white flex-shrink-0 overflow-hidden shadow-sm"><img src="assets/img/infabuild-icon.png?v=1" alt="InfaBuild" class="w-full h-full object-contain p-0.5"></div>' +
            '<div class="flex flex-col leading-none sb-label">' +
              '<span class="text-white font-bold text-lg tracking-tight font-display">InfaBuild</span>' +
              '<span class="text-blue-300 text-[10px] font-medium tracking-widest uppercase">Construction ERP</span>' +
            '</div>' +
          '</a>' +
          '<button id="sb-chevron" class="ml-auto flex items-center justify-center w-7 h-7 rounded-lg text-blue-300 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">' + icon('chevron-left', 16) + '</button>' +
        '</div>' +
        '<nav class="flex-1 py-4 overflow-y-auto scrollbar-hide">' +
          '<p class="px-4 mb-2 text-[10px] font-semibold tracking-widest text-blue-400/60 uppercase sb-label">Management</p>' +
          '<ul class="space-y-0.5 px-2">' + management + '</ul>' +
        '</nav>' +
        '<div class="border-t border-white/10 p-3">' +
          '<div class="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors">' +
            '<div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">' + e(avatar) + '</div>' +
            '<div class="flex-1 min-w-0 sb-label">' +
              '<p class="text-white text-sm font-semibold truncate">' + e(user.name) + '</p>' +
              '<p class="text-blue-300 text-xs truncate">' + e(user.role || 'Member') + '</p>' +
            '</div>' +
            '<a href="login.html" onclick="TZ.logout();return false;" class="text-blue-300 hover:text-white transition-colors sb-label" title="Sign out">' + icon('logout', 15) + '</a>' +
          '</div>' +
        '</div>' +
      '</aside>' +

      '<div class="flex-1 flex flex-col min-w-0 overflow-hidden">' +
        '<header class="h-16 bg-white border-b border-slate-200 flex items-center px-4 sm:px-6 gap-2 sm:gap-4 flex-shrink-0" style="box-shadow:0 1px 4px rgba(0,0,0,.06)">' +
          '<button id="sb-open" class="lg:hidden w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0" aria-label="Open menu">' + icon('menu', 18) + '</button>' +
          '<div class="flex-1 min-w-0">' +
            '<h1 class="text-base sm:text-lg font-bold text-slate-900 truncate font-display">' + e(title) + '</h1>' +
            '<p class="text-xs text-slate-400 hidden sm:block">' + e(TZ.fmtLongToday()) + '</p>' +
          '</div>' +
          '<div class="relative hidden md:block w-64 flex-shrink-0">' +
            '<div class="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-400 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200">' +
              icon('search', 15) +
              '<input id="tz-search" type="text" autocomplete="off" placeholder="Search anything..." class="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full">' +
            '</div>' +
            '<div id="tz-search-results" class="hidden absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto"></div>' +
          '</div>' +
          '<button class="relative w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors flex-shrink-0">' + icon('bell', 17) +
            '<span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white font-bold flex items-center justify-center">3</span></button>' +
          (action ? '<a href="' + e(action.href) + '" class="flex items-center gap-2 px-3 sm:px-4 py-2 bg-brand hover:bg-brand-hover text-white text-sm font-semibold rounded-xl transition-colors shadow-sm flex-shrink-0" title="' + e(action.label) + '">' + icon('plus', 16) + '<span class="hidden sm:inline">' + e(action.label) + '</span></a>' : '') +
          '<div class="flex items-center gap-2 flex-shrink-0"><div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">' + e(avatar) + '</div></div>' +
        '</header>' +
        '<main id="tz-main" class="flex-1 overflow-y-auto"></main>' +
      '</div>' +
      '</div>';

    var app = document.getElementById('app');
    app.innerHTML = html;

    var main = document.getElementById('tz-main');
    // Flash messages
    var flashes = TZ.takeFlashes();
    if (flashes.length) {
      var f = document.createElement('div');
      f.innerHTML = flashes.map(function (fl) {
        var c = FLASH_CLS[fl.type] || 'bg-slate-50 border-slate-200 text-slate-700';
        return '<div class="mx-6 mt-4 -mb-2 rounded-xl border px-4 py-3 text-sm font-medium ' + c + '">' + e(fl.msg) + '</div>';
      }).join('');
      main.appendChild(f);
    }
    var content = document.createElement('div');
    main.appendChild(content);

    wireSidebar();
    wireSearch();

    if (typeof renderFn === 'function') renderFn(content);
  };

  /* ---- Global search (top bar "Search anything…") ---- */
  // Scans the main records and returns up to the caller's limit of hits, each with
  // an icon, label, sub-line and a deep link. Rows are already owner-scoped by db.all.
  function searchAll(q) {
    var out = [];
    function hit(rec, fields) {
      for (var i = 0; i < fields.length; i++) {
        var v = rec[fields[i]];
        if (v != null && String(v).toLowerCase().indexOf(q) >= 0) return true;
      }
      return false;
    }
    function push(type, ic, label, sub, href) { out.push({ type: type, icon: ic, label: label || '—', sub: sub || '', href: href }); }
    function join(parts) { return parts.filter(Boolean).join(' · '); }

    TZ.db.all('projects').forEach(function (p) {
      if (hit(p, ['name', 'location', 'status', 'client_name'])) push('Project', 'building', p.name, p.status || '', 'workspace.html?project=' + p.id + '&section=overview');
    });
    TZ.db.all('clients').forEach(function (c) {
      if (hit(c, ['name', 'company', 'email', 'phone', 'city'])) push('Client', 'users', c.company || c.name, c.company ? c.name : join([c.email, c.phone]), 'clients.html?action=form&id=' + c.id);
    });
    TZ.db.all('materials').forEach(function (m) {
      if (hit(m, ['name', 'category', 'supplier', 'unit'])) push('Material', 'package', m.name, join([m.category, m.supplier]), 'materials.html?action=form&id=' + m.id);
    });
    TZ.db.all('purchase_orders').forEach(function (o) {
      if (hit(o, ['item', 'supplier', 'status'])) push('Purchase', 'cart', o.item, join([o.supplier, o.status]), 'purchase.html?action=form&id=' + o.id);
    });
    TZ.db.all('transactions').forEach(function (t) {
      if (hit(t, ['description', 'category', 'type', 'status'])) push('Finance', 'dollar', t.description, join([t.category, t.type]), 'finance.html?action=form&id=' + t.id);
    });
    TZ.db.all('accounts').forEach(function (a) {
      if (hit(a, ['name', 'type'])) push('Account', 'credit-card', a.name, a.type || '', 'account_tracker.html?action=form&id=' + a.id);
    });
    TZ.db.all('calendar_events').forEach(function (ev) {
      if (hit(ev, ['title', 'type'])) push('Event', 'calendar', ev.title, join([ev.type, ev.event_date]), 'calendar.html?ym=' + String(ev.event_date || '').slice(0, 7));
    });
    return out;
  }

  function wireSearch() {
    var input = document.getElementById('tz-search');
    var box = document.getElementById('tz-search-results');
    if (!input || !box) return;
    function hide() { box.classList.add('hidden'); }
    function run(raw) {
      var q = String(raw || '').trim().toLowerCase();
      if (!q) { box.innerHTML = ''; hide(); return; }
      var all = searchAll(q), results = all.slice(0, 10);
      if (!results.length) {
        box.innerHTML = '<div class="px-4 py-3 text-sm text-slate-400">No matches for “' + e(String(raw).trim()) + '”</div>';
      } else {
        box.innerHTML = results.map(function (r) {
          return '<a href="' + e(r.href) + '" class="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 border-b border-slate-100 last:border-0">' +
            '<span class="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">' + icon(r.icon, 16) + '</span>' +
            '<span class="flex-1 min-w-0"><span class="block text-sm font-medium text-slate-700 truncate">' + e(r.label) + '</span>' +
            (r.sub ? '<span class="block text-xs text-slate-400 truncate">' + e(r.sub) + '</span>' : '') + '</span>' +
            '<span class="text-[10px] font-semibold uppercase tracking-wide text-slate-300 flex-shrink-0">' + e(r.type) + '</span></a>';
        }).join('') + (all.length > results.length ? '<div class="px-4 py-2 text-[11px] text-slate-400 bg-slate-50">+' + (all.length - results.length) + ' more — keep typing to narrow</div>' : '');
      }
      box.classList.remove('hidden');
    }
    input.addEventListener('input', function () { run(this.value); });
    input.addEventListener('focus', function () { if (this.value.trim()) run(this.value); });
    input.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') { hide(); this.blur(); }
      else if (ev.key === 'Enter') { var a = box.querySelector('a[href]'); if (a) { ev.preventDefault(); location.href = a.getAttribute('href'); } }
    });
    document.addEventListener('click', function (ev) {
      if (ev.target !== input && !box.contains(ev.target)) hide();
    });
  }

  /* ---- Sidebar behaviour (ports footer.php script) ---- */
  function sb() { return document.getElementById('sidebar'); }
  function bd() { return document.getElementById('sb-backdrop'); }
  function isDesktop() { return window.matchMedia('(min-width:1024px)').matches; }
  function openSidebar() { sb().classList.remove('-translate-x-full'); bd().classList.remove('hidden'); }
  function closeSidebar() { sb().classList.add('-translate-x-full'); bd().classList.add('hidden'); }
  function toggleCollapse() {
    var s = sb(); s.classList.toggle('is-collapsed');
    try { localStorage.setItem('tz_sb', s.classList.contains('is-collapsed') ? '1' : '0'); } catch (e) {}
  }
  function chevronClick() { if (isDesktop()) toggleCollapse(); else closeSidebar(); }
  TZ.openSidebar = openSidebar; TZ.closeSidebar = closeSidebar;

  function wireSidebar() {
    document.getElementById('sb-open').addEventListener('click', openSidebar);
    document.getElementById('sb-backdrop').addEventListener('click', closeSidebar);
    document.getElementById('sb-chevron').addEventListener('click', chevronClick);
    try { if (localStorage.getItem('tz_sb') === '1') sb().classList.add('is-collapsed'); } catch (e) {}
  }
  window.addEventListener('resize', function () { if (isDesktop() && document.getElementById('sidebar')) closeSidebar(); });

  /* ---- Form field helpers (port helpers.php) ---- */
  function fieldInput(label, name, val, type, ph, attr) {
    type = type || 'text'; val = val == null ? '' : val; ph = ph || ''; attr = attr || '';
    return '<div><label class="block text-xs font-semibold text-slate-600 mb-1.5">' + e(label) + '</label>' +
      '<input type="' + type + '" name="' + e(name) + '" value="' + e(val) + '" placeholder="' + e(ph) + '" ' + attr +
      ' class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"></div>';
  }
  // options: object {value: label} or array of [value, label]
  function fieldSelect(label, name, options, selected) {
    selected = selected == null ? '' : String(selected);
    var opts = '';
    var pairs = Array.isArray(options) ? options.map(function (o) { return Array.isArray(o) ? o : [o, o]; })
      : Object.keys(options).map(function (k) { return [k, options[k]]; });
    pairs.forEach(function (p) {
      opts += '<option value="' + e(p[0]) + '"' + (String(p[0]) === selected ? ' selected' : '') + '>' + e(p[1]) + '</option>';
    });
    return '<div><label class="block text-xs font-semibold text-slate-600 mb-1.5">' + e(label) + '</label>' +
      '<select name="' + e(name) + '" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400">' +
      opts + '</select></div>';
  }
  function fieldTextarea(label, name, val, rows) {
    rows = rows || 3; val = val == null ? '' : val;
    return '<div class="sm:col-span-2"><label class="block text-xs font-semibold text-slate-600 mb-1.5">' + e(label) + '</label>' +
      '<textarea name="' + e(name) + '" rows="' + rows + '" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400">' + e(val) + '</textarea></div>';
  }
  // Select from a list OR pick "Other" to type a custom value. The actual value
  // is always carried by a text input named `name` (hidden unless "Other"), so
  // TZ.formData reads it the same way as any other field. `selected` that is not
  // in `options` is treated as a pre-existing custom ("Other") value.
  var FLD_CLS = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400';
  var _fsoSeq = 0;
  function fieldSelectOther(label, name, options, selected, ph) {
    ph = ph || 'Type name…'; selected = selected == null ? '' : String(selected);
    var pairs = Array.isArray(options) ? options.map(function (o) { return Array.isArray(o) ? o : [o, o]; })
      : Object.keys(options).map(function (k) { return [k, options[k]]; });
    var known = pairs.some(function (p) { return String(p[0]) === selected; });
    var isOther = selected !== '' && !known;
    var id = 'fso' + (++_fsoSeq);
    var opts = '<option value="">— Select —</option>';
    pairs.forEach(function (p) {
      opts += '<option value="' + e(p[0]) + '"' + (!isOther && String(p[0]) === selected ? ' selected' : '') + '>' + e(p[1]) + '</option>';
    });
    opts += '<option value="__other__"' + (isOther ? ' selected' : '') + '>Other (type below)</option>';
    var inpVal = (isOther || known) ? selected : '';   // text input always carries the real value
    var inpCls = isOther ? FLD_CLS : 'hidden';          // only visible when "Other" is chosen
    return '<div><label class="block text-xs font-semibold text-slate-600 mb-1.5">' + e(label) + '</label>' +
      '<select id="' + id + '" data-input="' + id + '_i" onchange="TZ.otherSel(this)" class="' + FLD_CLS + ' mb-2">' + opts + '</select>' +
      '<input type="text" id="' + id + '_i" name="' + e(name) + '" value="' + e(inpVal) + '" placeholder="' + e(ph) + '" class="' + inpCls + '"></div>';
  }
  function otherSel(sel) {
    var inp = document.getElementById(sel.getAttribute('data-input'));
    if (!inp) return;
    if (sel.value === '__other__') {
      inp.className = FLD_CLS; inp.value = ''; inp.focus();
    } else {
      inp.value = sel.value; inp.className = 'hidden';
    }
  }
  TZ.fieldInput = fieldInput; TZ.fieldSelect = fieldSelect; TZ.fieldTextarea = fieldTextarea;
  TZ.fieldSelectOther = fieldSelectOther; TZ.otherSel = otherSel;
})();
