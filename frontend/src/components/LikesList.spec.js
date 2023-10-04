import { mount } from '@vue/test-utils'
import LikesList from '@/components/LikesList.vue'
import { apiClient } from '../services/ApiClient' // ajustez le chemin

jest.mock('../services/ApiClient', () => ({
  get: jest.fn()
}))

describe('./LikesList.vue', () => {

    it('fetches likes and updates likesList', async () => {
        // Mock de la réponse de l'API
        apiClient.get.mockResolvedValueOnce({
          allLikes: [
            { id: 1, name: 'Like 1' },
            { id: 2, name: 'Like 2' }
          ]
        });
    
        const wrapper = mount(LikesList, {
          propsData: {
            post: { id: 1 },
            likesCount: 2
          }
        });
    
        // Appelle la méthode
        await wrapper.vm.fetchLikesList();
    
        // Vérifie si likesList est correctement mis à jour
        expect(wrapper.vm.likesList).toEqual([
          { id: 1, name: 'Like 1' },
          { id: 2, name: 'Like 2' }
        ]);
    
        // Vérifie si l'API a été appelée avec la bonne URL
        expect(apiClient.get).toHaveBeenCalledWith('/api/posts/1/likes');
      });
    });