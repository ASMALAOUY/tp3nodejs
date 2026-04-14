// Confirmation de suppression
document.querySelectorAll('.btn-delete').forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      e.preventDefault();
    }
  });
});

// Auto-hide des messages d'erreur après 5 secondes
setTimeout(() => {
  const errorDiv = document.querySelector('.error-message');
  if (errorDiv) {
    errorDiv.style.opacity = '0';
    setTimeout(() => errorDiv.remove(), 500);
  }
}, 5000);