import axios from 'axios';
import { toast } from 'sonner';

// Configuration de base d'axios
const axiosInstance = axios.create({
  timeout: 10000, // 10 secondes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête pour ajouter le token automatiquement
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs globalement
axiosInstance.interceptors.response.use(
  (response) => {
    // Retourner la réponse si tout va bien
    return response;
  },
  (error) => {
    // Gérer les erreurs de manière centralisée
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      const { status, data } = error.response;

      switch (status) {
        case 400:
          toast.error(data?.message || 'Requête invalide. Veuillez vérifier vos données.');
          break;
        case 401:
          // Ne pas rediriger si on est déjà sur la page de login ou register
          const currentPath = window.location.pathname;
          if (currentPath !== '/login' && currentPath !== '/register') {
            toast.error('Session expirée. Veuillez vous reconnecter.');
            // Nettoyer le localStorage et rediriger vers login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
          // Sinon, ne rien faire - laisser le composant gérer l'erreur
          break;
        case 403:
          toast.error('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
          break;
        case 404:
          toast.error(data?.message || 'Ressource non trouvée.');
          break;
        case 422:
          // Erreurs de validation
          if (data?.errors) {
            const errorMessages = Object.values(data.errors).flat();
            errorMessages.forEach((msg: any) => toast.error(msg));
          } else {
            toast.error(data?.message || 'Erreur de validation.');
          }
          break;
        case 429:
          toast.error('Trop de requêtes. Veuillez patienter un moment.');
          break;
        case 500:
          toast.error('Erreur serveur. Veuillez réessayer plus tard.');
          break;
        case 503:
          toast.error('Service temporairement indisponible. Veuillez réessayer plus tard.');
          break;
        default:
          toast.error(data?.message || 'Une erreur est survenue.');
      }
    } else if (error.request) {
      // La requête a été faite mais pas de réponse reçue
      toast.error('Impossible de contacter le serveur. Vérifiez votre connexion internet.');
    } else {
      // Erreur lors de la configuration de la requête
      toast.error('Une erreur inattendue est survenue.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
