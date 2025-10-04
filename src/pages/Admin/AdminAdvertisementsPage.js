// frontend/src/pages/Admin/AdminAdvertisementsPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AdminAdvertisementsPage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link_url: '',
    ad_type: 'banner',
    target_audience: 'all',
    position: 'sidebar_right',
    priority: 1,
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    is_active: true
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/advertisements/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAds(response.data);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (ad = null) => {
    if (ad) {
      setEditingAd(ad);
      setFormData({
        title: ad.title,
        description: ad.description || '',
        link_url: ad.link_url || '',
        ad_type: ad.ad_type,
        target_audience: ad.target_audience,
        position: ad.position,
        priority: ad.priority,
        start_date: ad.start_date?.split('T')[0] || '',
        end_date: ad.end_date?.split('T')[0] || '',
        is_active: ad.is_active
      });
    } else {
      setEditingAd(null);
      setFormData({
        title: '',
        description: '',
        link_url: '',
        ad_type: 'banner',
        target_audience: 'all',
        position: 'sidebar_right',
        priority: 1,
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        is_active: true
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAd(null);
  };

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingAd) {
        await axios.put(
          `${API_URL}/advertisements/${editingAd.ad_id}`,
          formData,
          config
        );
      } else {
        await axios.post(`${API_URL}/advertisements`, formData, config);
      }

      handleCloseDialog();
      fetchAds();
    } catch (error) {
      console.error('Error saving ad:', error);
    }
  };

  const handleDelete = async (adId) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/advertisements/${adId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchAds();
      } catch (error) {
        console.error('Error deleting ad:', error);
      }
    }
  };

  const handleToggleActive = async (adId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/advertisements/${adId}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAds();
    } catch (error) {
      console.error('Error toggling ad:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Manage Advertisements</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Ad
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Audience</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Views</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell>CTR</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ads.map((ad) => {
              const ctr = ad.view_count > 0
                ? ((ad.click_count / ad.view_count) * 100).toFixed(2)
                : '0.00';
              
              return (
                <TableRow key={ad.ad_id}>
                  <TableCell>{ad.title}</TableCell>
                  <TableCell>{ad.ad_type}</TableCell>
                  <TableCell>{ad.position}</TableCell>
                  <TableCell>{ad.target_audience}</TableCell>
                  <TableCell>{ad.priority}</TableCell>
                  <TableCell>
                    <Chip
                      label={ad.is_active ? 'Active' : 'Inactive'}
                      color={ad.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{ad.view_count}</TableCell>
                  <TableCell>{ad.click_count}</TableCell>
                  <TableCell>{ctr}%</TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleToggleActive(ad.ad_id)}>
                      <ViewIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleOpenDialog(ad)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(ad.ad_id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingAd ? 'Edit Advertisement' : 'Create Advertisement'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                name="title"
                label="Title"
                value={formData.title}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                name="description"
                label="Description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                fullWidth
              />
              <TextField
                name="link_url"
                label="Link URL"
                value={formData.link_url}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="ad_type"
                label="Ad Type"
                value={formData.ad_type}
                onChange={handleInputChange}
                select
                fullWidth
              >
                <MenuItem value="banner">Banner</MenuItem>
                <MenuItem value="sidebar">Sidebar</MenuItem>
                <MenuItem value="popup">Popup</MenuItem>
                <MenuItem value="interstitial">Interstitial</MenuItem>
              </TextField>
              <TextField
                name="target_audience"
                label="Target Audience"
                value={formData.target_audience}
                onChange={handleInputChange}
                select
                fullWidth
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="students">Students</MenuItem>
                <MenuItem value="teachers">Teachers</MenuItem>
                <MenuItem value="parents">Parents</MenuItem>
              </TextField>
              <TextField
                name="position"
                label="Position"
                value={formData.position}
                onChange={handleInputChange}
                select
                fullWidth
              >
                <MenuItem value="header">Header</MenuItem>
                <MenuItem value="footer">Footer</MenuItem>
                <MenuItem value="sidebar_left">Sidebar Left</MenuItem>
                <MenuItem value="sidebar_right">Sidebar Right</MenuItem>
                <MenuItem value="content_top">Content Top</MenuItem>
                <MenuItem value="content_bottom">Content Bottom</MenuItem>
              </TextField>
              <TextField
                name="priority"
                label="Priority"
                type="number"
                value={formData.priority}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="start_date"
                label="Start Date"
                type="date"
                value={formData.start_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                name="end_date"
                label="End Date"
                type="date"
                value={formData.end_date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <FormControlLabel
                control={
                  <Switch
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                }
                label="Active"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingAd ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default AdminAdvertisementsPage;