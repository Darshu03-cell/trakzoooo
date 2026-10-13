/* Login / Sign up (ports login.php) — mock auth against localStorage. */
(function () {
  if (TZ.currentUser()) { location.replace(TZ.isAdmin() ? 'index.html' : 'workspace.html'); return; }
  var e = TZ.esc, icon = window.icon;
  TZ.db.all('users'); // ensure DB seeded

  var mode = TZ.qs('mode');
  if (mode !== 'signin' && mode !== 'signup') mode = 'signin';

  var features = [
    ['Projects', 'Track budgets & progress'],
    ['Clients', 'Manage relationships'],
    ['Finance', 'Income & expenses in ₹'],
    ['Reports', 'Export to Excel & PDF'],
  ];
  var year = new Date().getFullYear();

  var html =
    '<div class="min-h-screen flex" style="background:#F1F5F9">' +
      '<div class="hidden lg:flex flex-col justify-between p-10 w-[440px] flex-shrink-0" style="background:linear-gradient(160deg,#0B1F3A 0%,#1D4ED8 100%)">' +
        '<div class="flex items-center gap-3">' +
          '<div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">' + icon('hard-hat', 22) + '</div>' +
          '<div><p class="text-white font-bold text-xl tracking-tight font-display">Trackzo</p><p class="text-blue-200 text-[11px] tracking-widest uppercase">Construction ERP</p></div>' +
        '</div>' +
        '<div>' +
          '<h2 class="text-white text-3xl font-bold mb-4 leading-tight font-display">Build Smarter.<br>Track Better.</h2>' +
          '<p class="text-blue-200 text-sm leading-relaxed mb-8">The all-in-one ERP platform for builders and contractors to manage every project from foundation to handover.</p>' +
          '<div class="grid grid-cols-2 gap-3">' +
            features.map(function (s) {
              return '<div class="bg-white/10 rounded-xl p-3"><p class="text-white font-bold text-sm font-display">' + e(s[0]) + '</p><p class="text-blue-200 text-xs">' + e(s[1]) + '</p></div>';
            }).join('') +
          '</div>' +
        '</div>' +
        '<p class="text-blue-300 text-xs">© ' + year + ' Trackzo. All rights reserved.</p>' +
      '</div>' +

      '<div class="flex-1 flex items-center justify-center p-6">' +
        '<div class="w-full max-w-md">' +
          '<div class="flex items-center gap-3 mb-8 lg:hidden">' +
            '<div class="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-white">' + icon('hard-hat', 22) + '</div>' +
            '<div><p class="font-bold text-xl text-slate-900 font-display">Trackzo</p><p class="text-slate-400 text-xs">Construction ERP</p></div>' +
          '</div>' +
          '<div class="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">' +
            '<h1 id="formTitle" class="text-2xl font-bold text-slate-900 mb-1 font-display">Welcome back</h1>' +
            '<p id="formSub" class="text-slate-400 text-sm mb-6">Sign in to your Trackzo workspace</p>' +
            '<div class="bg-slate-100 rounded-xl p-1 flex mb-6 text-sm font-semibold">' +
              '<button type="button" id="tabIn" class="flex-1 py-2 rounded-lg transition-all">Sign In</button>' +
              '<button type="button" id="tabUp" class="flex-1 py-2 rounded-lg transition-all">Sign Up</button>' +
            '</div>' +
            '<div class="overflow-hidden"><div id="track" class="flex w-[300%] transition-transform duration-300 ease-out">' +
              '<div class="w-1/3">' +
                '<form id="signinForm" class="space-y-4">' +
                  '<div><label class="block text-xs font-semibold text-slate-600 mb-1.5">Email address</label>' +
                    '<input type="email" name="email" placeholder="you@company.com" autocomplete="email" class="fld"></div>' +
                  '<div><div class="flex justify-between items-center mb-1.5"><label class="block text-xs font-semibold text-slate-600">Password</label><button type="button" id="forgotBtn" class="text-xs text-blue-600 font-semibold hover:underline">Forgot password?</button></div>' +
                    '<div class="relative">' +
                      '<input id="signinPwd" type="password" name="password" placeholder="••••••••" autocomplete="current-password" class="fld" style="padding-right:2.75rem">' +
                      '<button type="button" id="signinPwdToggle" tabindex="-1" aria-label="Show password" class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">' + icon('eye', 18) + '</button>' +
                    '</div></div>' +
                  '<div id="signinError" class="hidden bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600"></div>' +
                  '<button type="submit" class="w-full flex items-center justify-center gap-2 py-3 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl text-sm">' + icon('login', 16) + ' Sign In</button>' +
                '</form>' +
              '</div>' +
              '<div class="w-1/3">' +
                '<form id="signupForm" class="space-y-4">' +
                  '<div><label class="block text-xs font-semibold text-slate-600 mb-1.5">Full name</label><input type="text" name="name" placeholder="Your name" class="fld"></div>' +
                  '<div><label class="block text-xs font-semibold text-slate-600 mb-1.5">Email address</label><input type="email" name="email" placeholder="you@company.com" class="fld"></div>' +
                  '<div class="grid grid-cols-2 gap-3">' +
                    '<div><label class="block text-xs font-semibold text-slate-600 mb-1.5">Password</label><input type="password" name="password" placeholder="Min 6 chars" class="fld"></div>' +
                    '<div><label class="block text-xs font-semibold text-slate-600 mb-1.5">Confirm</label><input type="password" name="confirm" placeholder="Repeat" class="fld"></div>' +
                  '</div>' +
                  '<div id="signupError" class="hidden bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600"></div>' +
                  '<button type="submit" class="w-full flex items-center justify-center gap-2 py-3 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl text-sm">' + icon('plus', 16) + ' Create account</button>' +
                '</form>' +
              '</div>' +
              '<div class="w-1/3">' +
                '<form id="resetForm" class="space-y-4">' +
                  '<div><label class="block text-xs font-semibold text-slate-600 mb-1.5">Email address</label><input type="email" name="email" placeholder="you@company.com" class="fld"></div>' +
                  '<div class="grid grid-cols-2 gap-3">' +
                    '<div><label class="block text-xs font-semibold text-slate-600 mb-1.5">New password</label><input type="password" name="password" placeholder="Min 6 chars" class="fld"></div>' +
                    '<div><label class="block text-xs font-semibold text-slate-600 mb-1.5">Confirm</label><input type="password" name="confirm" placeholder="Repeat" class="fld"></div>' +
                  '</div>' +
                  '<div id="resetError" class="hidden bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600"></div>' +
                  '<div id="resetOk" class="hidden bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700"></div>' +
                  '<button type="submit" class="w-full flex items-center justify-center gap-2 py-3 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl text-sm">' + icon('login', 16) + ' Reset password</button>' +
                  '<button type="button" id="backToSignin" class="w-full text-center text-xs text-blue-600 font-semibold hover:underline">Back to sign in</button>' +
                '</form>' +
              '</div>' +
            '</div></div>' +
            '<p class="mt-6 text-center text-xs text-slate-400"><span id="switchHint"></span><button type="button" id="switchBtn" class="text-blue-600 font-semibold hover:underline"></button></p>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.getElementById('app').innerHTML = html;

  var A = 'bg-white text-brand shadow-sm', I = 'text-slate-500';
  var track = document.getElementById('track');
  var TITLES = { signin: 'Welcome back', signup: 'Create your account', reset: 'Reset your password' };
  var SUBS = {
    signin: 'Sign in to your Trackzo workspace',
    signup: 'Set up your Trackzo workspace',
    reset: 'Enter your email and choose a new password',
  };
  function setMode(m) {
    track.dataset.mode = m;
    var x = m === 'signup' ? '-33.3333%' : (m === 'reset' ? '-66.6667%' : '0');
    track.style.transform = 'translateX(' + x + ')';
    document.getElementById('tabIn').className = 'flex-1 py-2 rounded-lg transition-all ' + (m === 'signin' ? A : I);
    document.getElementById('tabUp').className = 'flex-1 py-2 rounded-lg transition-all ' + (m === 'signup' ? A : I);
    document.getElementById('formTitle').textContent = TITLES[m] || TITLES.signin;
    document.getElementById('formSub').textContent = SUBS[m] || SUBS.signin;
    document.getElementById('switchHint').textContent = m === 'signup' ? 'Already have an account? ' : "Don't have an account? ";
    document.getElementById('switchBtn').textContent = m === 'signup' ? 'Sign in' : 'Create one';
  }
  document.getElementById('tabIn').addEventListener('click', function () { setMode('signin'); });
  document.getElementById('tabUp').addEventListener('click', function () { setMode('signup'); });
  document.getElementById('switchBtn').addEventListener('click', function () { setMode(track.dataset.mode === 'signup' ? 'signin' : 'signup'); });

  // Show/hide password toggle
  (function () {
    var input = document.getElementById('signinPwd');
    var btn = document.getElementById('signinPwdToggle');
    if (!input || !btn) return;
    btn.addEventListener('click', function () {
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.innerHTML = icon(show ? 'eye-off' : 'eye', 18);
      btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      input.focus();
    });
  })();

  function showErr(id, msg) { var el = document.getElementById(id); el.textContent = msg; el.classList.remove('hidden'); }

  document.getElementById('signinForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var f = TZ.formData(this);
    if (!f.email || !f.password) { showErr('signinError', 'Please enter email and password.'); return; }
    var r = TZ.signin(f.email, f.password);
    if (r.error) { showErr('signinError', r.error); return; }
    location.href = TZ.isAdmin() ? 'index.html' : 'workspace.html';
  });
  document.getElementById('signupForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var f = TZ.formData(this);
    var r = TZ.signup(f.name, f.email, f.password, f.confirm);
    if (r.error) { showErr('signupError', r.error); return; }
    location.href = TZ.isAdmin() ? 'index.html' : 'workspace.html';
  });

  // Forgot / reset password (browser-local auth — sets a new password directly)
  document.getElementById('forgotBtn').addEventListener('click', function () {
    var cur = document.querySelector('#signinForm input[name="email"]');
    var dst = document.querySelector('#resetForm input[name="email"]');
    if (cur && dst && cur.value) dst.value = cur.value;
    setMode('reset');
  });
  document.getElementById('backToSignin').addEventListener('click', function () { setMode('signin'); });
  document.getElementById('resetForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var okBox = document.getElementById('resetOk'), errBox = document.getElementById('resetError');
    okBox.classList.add('hidden'); errBox.classList.add('hidden');
    var f = TZ.formData(this);
    var r = TZ.resetPassword(f.email, f.password, f.confirm);
    if (r.error) { showErr('resetError', r.error); return; }
    var email = f.email;
    this.reset();
    okBox.textContent = 'Password updated. Redirecting to sign in…';
    okBox.classList.remove('hidden');
    setTimeout(function () {
      var si = document.querySelector('#signinForm input[name="email"]');
      var sp = document.getElementById('signinPwd');
      if (si) si.value = email;
      if (sp) sp.value = '';
      okBox.classList.add('hidden');
      setMode('signin');
      if (sp) sp.focus();
    }, 1400);
  });

  setMode(mode);
})();
