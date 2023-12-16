import router from "../router/index";

class ApiClient {
    constructor() {
        this.baseUrl = "http://localhost:3000";
    }

    headers(options = {}) {
        const contentType = options.isFormData
            ? {}
            : {
                "Content-Type": "application/json",
            };
        return {
            ...contentType,
            Authorization: "Bearer " + localStorage.getItem("userToken"),
        };
    }

    get(path) {
        return fetch(this.baseUrl + path, {
            headers: this.headers(),
        })
            .then((response) => {
                if (response.status === 401) {
                    localStorage.clear();
                    router.push({ name: "Login" });
                } else if (response.status === 404) {
                    throw new Error("Resource not found");
                } else if (response.status >= 400 && response.status < 500) {
                    throw new Error(`Client error: ${response.status}`);
                } else if (response.status >= 500) {
                    throw new Error(`Server error: ${response.status}`);
                }
                return response.json();
            })
            .catch((error) => {
                if (error.message === "Ressource not found") {
                    console.error(
                        "Erreur 404 : La ressource demandée n'a pas été trouvée."
                    );
                } else {
                    console.error("Erreur lors de la requête:", error.message);
                    console.error(
                        "Impossible de récupérer les données de l'API"
                    );
                }
                return { error: error.message };
            });
    }

    post(path, body, options = {}) {
        return fetch(this.baseUrl + path, {
            method: "POST",
            body: options.isFormData ? body : JSON.stringify(body),
            headers: this.headers(options),
        })
            .catch((error) => {
                throw error;
            })
            .then((response) => this.handleResponse(response));
    }

    delete(path) {
        return fetch(this.baseUrl + path, {
            method: "DELETE",
            headers: this.headers(),
        })
            .then((response) => {
                console.log("Réponse du serveur:", response);
                if (!response.ok) {
                    console.error(
                        "Statut de la réponse non valide:",
                        response.status
                    );
                    throw new Error(
                        `Statut de la réponse non valide: ${response.status}`
                    );
                }
                return response
                    .text()
                    .then((text) => (text ? JSON.parse(text) : {}));
            })
            .catch((error) => {
                console.error("Erreur lors de la requête DELETE:", error);
                console.error("Erreur détaillée:", error.message);
                throw error;
            });
    }

    put(path, body, options = {}) {
        return fetch(this.baseUrl + path, {
            method: "PUT",
            body: options.isFormData ? body : JSON.stringify(body),
            headers: this.headers(options),
        }).then((response) => this.handleResponse(response));
    }

    async handleResponse(response) {
        if (!response.status.toString().match(/20[01]/)) {
            const error = await response.json();
            error.status = response.status; 
            throw error;
        }
        return response.json();
    }
}

export const apiClient = new ApiClient();
