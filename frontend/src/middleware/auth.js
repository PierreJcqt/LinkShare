// Permet de vérifier que l'utilisateur dispose bien d'un token pour accéder à la page demandée
export default function auth (to, from, next) {
    if (!localStorage.getItem('userToken') && !localStorage.getItem('userData')) {
      return next({ name: 'Login' })
    }
    return next()
}