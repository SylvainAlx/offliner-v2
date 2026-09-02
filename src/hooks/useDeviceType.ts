import { useState, useEffect, useCallback } from 'react'

export interface DeviceType {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

const MOBILE_UA_PATTERN =
  /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Silk|Kindle|Fennec|Maemo|Midori|Minimo|mmp|NetFront|palm|Plucker|ReqwirelessWeb|Symbian|uZardWeb|Windows CE|Windows Phone|Xiino|WPDesktop/i

const TABLET_UA_PATTERN = /iPad|Tablet|PlayBook|Touch|Pad|Nexus 7|Nexus 9|Nexus 10|Xoom|SCH-I800|Tab/i

function detectDevice(): DeviceType {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return { isMobile: false, isTablet: false, isDesktop: true }
  }

  const ua = navigator.userAgent || ''
  const hasTouch =
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 1) ||
    (navigator as Navigator & { msMaxTouchPoints?: number }).msMaxTouchPoints &&
      (navigator as Navigator & { msMaxTouchPoints?: number }).msMaxTouchPoints! > 1

  const width = typeof window.innerWidth === 'number' ? window.innerWidth : 1024

  const uaMobile = MOBILE_UA_PATTERN.test(ua)
  const uaTablet = TABLET_UA_PATTERN.test(ua) && !uaMobile

  let isMobile = uaMobile
  let isTablet = uaTablet

  if (!isMobile && !isTablet) {
    if (hasTouch && width < 1024) {
      isMobile = width < 768
      isTablet = !isMobile
    }
  }

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
  }
}

export function useDeviceType(): DeviceType {
  const [device, setDevice] = useState<DeviceType>(() => detectDevice())

  const refresh = useCallback(() => {
    setDevice(detectDevice())
  }, [])

  useEffect(() => {
    window.addEventListener('resize', refresh)
    window.addEventListener('orientationchange', refresh)
    return () => {
      window.removeEventListener('resize', refresh)
      window.removeEventListener('orientationchange', refresh)
    }
  }, [refresh])

  return device
}
