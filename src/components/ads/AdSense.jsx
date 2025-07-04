import React, { useEffect } from 'react';
import { useWallpaper } from '../../context/WallpaperContext';

const AdSense = ({ slot, style = {}, className = '' }) => {
  const { adsenseConfig } = useWallpaper();

  useEffect(() => {
    if (adsenseConfig.enabled && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, [adsenseConfig.enabled]);

  if (!adsenseConfig.enabled || !adsenseConfig.clientId || !slot) {
    return null;
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={{ display: 'block', ...style }}
      data-ad-client={adsenseConfig.clientId}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default AdSense;