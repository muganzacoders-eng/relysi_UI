// frontend/src/services/advertisementService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AdvertisementService {
  // Fetch advertisements with optional filters
  async getAdvertisements(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.target_audience) params.append('target_audience', filters.target_audience);
      if (filters.position) params.append('position', filters.position);
      if (filters.ad_type) params.append('ad_type', filters.ad_type);
      
      const response = await axios.get(`${API_URL}/advertisements?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching advertisements:', error);
      return [];
    }
  }

  // Track advertisement view
  async trackView(adId) {
    try {
      await axios.post(`${API_URL}/advertisements/${adId}/view`);
    } catch (error) {
      console.error('Error tracking ad view:', error);
    }
  }

  // Track advertisement click
  async trackClick(adId) {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      await axios.post(`${API_URL}/advertisements/${adId}/click`, {}, config);
    } catch (error) {
      console.error('Error tracking ad click:', error);
    }
  }
}

export default new AdvertisementService();