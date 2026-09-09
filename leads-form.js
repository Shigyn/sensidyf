// Remplace Netlify Forms/mailto : écrit directement dans la table `leads`
// Supabase. No-op tant que window.LOCWEB_CONFIG.supabaseUrl/clientId ne sont
// pas renseignés (client pas encore branché — le formulaire garde alors son
// comportement local défini en fin de page, voir index.html).
// Formulaires attendus : #contact-form et #quick-form, champs nom/telephone/ville/besoin/message.
(function () {
  const config = window.LOCWEB_CONFIG;
  if (!config || !config.supabaseUrl || !config.clientId) return;

  ['contact-form', 'quick-form'].forEach((id) => {
    const form = document.getElementById(id);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const payload = {
        client_id: config.clientId,
        nom: formData.get('nom'),
        telephone: formData.get('telephone'),
        ville: formData.get('ville') || null,
        besoin: formData.get('besoin') || null,
        message: formData.get('message') || null
      };

      const res = await fetch(`${config.supabaseUrl}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          apikey: config.supabaseAnonKey,
          Authorization: `Bearer ${config.supabaseAnonKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify(payload)
      });

      form.dataset.status = res.ok ? 'success' : 'error';
      form.dispatchEvent(new CustomEvent('leadSubmitted', { detail: { ok: res.ok } }));
    });
  });
})();
