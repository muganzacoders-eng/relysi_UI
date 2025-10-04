// frontend/src/config/adConfig.js
// Centralized ad display configuration

const adConfig = {
  // Enable/disable ads globally
  enabled: false,

  // Maximum number of ads per position
//   maxAdsPerPosition: {
//     header: 1,
//     content_top: 1,
//     sidebar_left: 2,
//     sidebar_right: 2,
//     content_bottom: 1,
//     footer: 1
//   },

  maxAdsPerPosition: {
  header: 1,
  content_top: 0,        // Disable top banner
  sidebar_left: 1,       // Show only 1
  sidebar_right: 1,      // Show only 1
  content_bottom: 0,     // Disable bottom banner
  footer: 0
},

  // Responsive breakpoints for ad display
  displayBreakpoints: {
    // Hide all ads on screens smaller than this (px)
    mobileHide: false, // Set to true to hide all ads on mobile
    
    // Hide sidebar ads on screens smaller than this
    sidebarHideBelow: 'lg', // 'sm', 'md', 'lg', 'xl'
    
    // Hide banner ads on screens smaller than this
    bannerHideBelow: null // null means always show
  },

  // Ad refresh settings
  refresh: {
    enabled: false, // Auto-refresh ads
    interval: 30000 // Refresh every 30 seconds
  },

  // Ad size limits (to prevent oversized ads)
  sizeLimits: {
    banner: {
      maxHeight: { xs: 100, sm: 120, md: 150 },
      aspectRatio: '16/9'
    },
    sidebar: {
      maxHeight: { xs: 150, sm: 180, md: 200 },
      maxWidth: '100%'
    }
  },

  // Spacing around ads
  spacing: {
    marginBottom: { xs: 1, sm: 1.5, md: 2 },
    gap: { xs: 1, md: 2, lg: 3 }
  },

  // Priority filtering (only show ads with priority >= this value)
  minPriority: 1,

  // Animation settings
  animation: {
    enabled: true,
    transition: 'all 0.3s ease-in-out'
  }
};

export default adConfig;




