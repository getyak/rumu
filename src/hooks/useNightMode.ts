import { useCallback, useState } from 'react'

/** 夜读 / 昼读 — a whole-page atmosphere toggled via a body attribute. */
export function useNightMode() {
  const [night, setNight] = useState(false)

  const toggleNight = useCallback(() => {
    setNight((prev) => {
      const next = !prev
      if (next) document.body.setAttribute('data-night', '1')
      else document.body.removeAttribute('data-night')
      return next
    })
  }, [])

  return { night, toggleNight }
}
