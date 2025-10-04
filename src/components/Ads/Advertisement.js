// frontend/src/components/ads/Advertisement.js
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Card, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material';
import advertisementService from '../../services/advertisementService';

function Advertisement({ ad, variant = 'sidebar' }) {
  useEffect(() => {
    // Track view when ad is displayed
    if (ad?.ad_id) {
      advertisementService.trackView(ad.ad_id);
    }
  }, [ad?.ad_id]);

  const handleClick = () => {
    if (ad?.ad_id) {
      advertisementService.trackClick(ad.ad_id);
    }
    if (ad?.link_url) {
      window.open(ad.link_url, '_blank');
    }
  };

  if (!ad) return null;

  // Different styles based on variant/position
  const getStyles = () => {
    switch (variant) {
      case 'banner':
        return {
          width: '100%',
          maxHeight: { xs: '100px', sm: '120px', md: '150px' },
          mb: 2
        };
      case 'sidebar':
        return {
          width: '100%',
          maxWidth: '100%',
          mb: 2
        };
      case 'popup':
        return {
          maxWidth: '400px',
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          display: { xs: 'none', md: 'block' } // Hide on mobile
        };
      default:
        return {
          width: '100%',
          mb: 2
        };
    }
  };

  const getImageHeight = () => {
    switch (variant) {
      case 'banner':
        return { xs: 80, sm: 100, md: 120 };
      case 'sidebar':
        return { xs: 150, sm: 180, md: 200 };
      default:
        return 200;
    }
  };

  return (
    <Card sx={getStyles()}>
      <CardActionArea onClick={handleClick}>
        {ad.image_url && (
          <CardMedia
            component="img"
            image={ad.image_url}
            alt={ad.title}
            sx={{
              height: getImageHeight(),
              objectFit: 'cover'
            }}
          />
        )}
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            {ad.title}
          </Typography>
          {ad.description && (
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                display: { xs: '-webkit-box', sm: 'block' },
                WebkitLineClamp: { xs: 2, sm: 3 },
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {ad.description.substring(0, 100)}
              {ad.description.length > 100 && '...'}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

Advertisement.propTypes = {
  ad: PropTypes.shape({
    ad_id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    image_url: PropTypes.string,
    link_url: PropTypes.string,
    ad_type: PropTypes.string,
    position: PropTypes.string
  }),
  variant: PropTypes.oneOf(['banner', 'sidebar', 'popup', 'footer'])
};

export default Advertisement;