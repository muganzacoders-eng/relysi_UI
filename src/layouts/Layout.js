// frontend/src/layouts/Layout.js (RESPONSIVE FIXED)
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import AppBar from '../components/common/AppBar';
import Sidebar from '../components/common/Sidebar';
import AdContainer from '../components/ads/AdContainer';
import { useAuth } from '../contexts/AuthContext';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const handleDrawerToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {user && (
        <>
          <AppBar onDrawerToggle={handleDrawerToggle} />
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={handleDrawerToggle}
            isMobile={isMobile}
          />
        </>
      )}
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2, md: 3 },
          width: user ? { sm: `calc(100% - ${sidebarOpen ? 240 : 80}px)` } : '100%',
          ml: user ? { sm: `${sidebarOpen ? 240 : 80}px` } : 0,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {user && <Box sx={{ mt: 8 }} />}
        
        {/* Header/Banner Ads - Only on desktop, compact on tablet */}
        {user && !isMobile && (
          <Box sx={{ mb: 2 }}>
            <AdContainer position="content_top" adType="banner" />
          </Box>
        )}
        
        {/* Main Content with Optional Sidebar */}
        <Box sx={{ 
          display: 'flex', 
          gap: { xs: 0, md: 2, lg: 3 },
          flexDirection: { xs: 'column', lg: 'row' }
        }}>
          {/* Main Content Area - Always prioritized */}
          <Box sx={{ 
            flexGrow: 1,
            minWidth: 0, // Prevent content overflow
            width: { xs: '100%', lg: 'auto' }
          }}>
            {children}
          </Box>
          
          {/* Right Sidebar Ads - Only on large screens */}
          {user && !isTablet && (
            <Box sx={{ 
              width: { lg: '280px', xl: '320px' },
              flexShrink: 0,
              display: { xs: 'none', lg: 'block' }
            }}>
              <AdContainer position="sidebar_right" adType="sidebar" />
            </Box>
          )}
        </Box>
        
        {/* Mobile Bottom Ads - Only on mobile, small and compact */}
        {user && isMobile && (
          <Box sx={{ mt: 3 }}>
            <AdContainer position="content_bottom" adType="banner" />
          </Box>
        )}
        
        {/* Desktop Footer Ads - Only on desktop */}
        {user && !isMobile && (
          <Box sx={{ mt: 4 }}>
            <AdContainer position="content_bottom" adType="banner" />
          </Box>
        )}
      </Box>
    </Box>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;