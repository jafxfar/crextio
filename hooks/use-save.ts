'use client'

import { useState, useCallback } from 'react'

export type SaveState = 'idle' | 'saving' | 'saved'

/**
 * Simulates a save action with a short loading phase.
 * Returns { saveState, triggerSave } — bind triggerSave to the Save button.
 */
export function useSave(durationMs = 1600) {
  const [saveState, setSaveState] = useState<SaveState>('idle')

  const triggerSave = useCallback(() => {
    if (saveState === 'saving') return
    setSaveState('saving')
    setTimeout(() => {
      setSaveState('saved')
      // Reset back to idle after showing "Saved" for a moment
      setTimeout(() => setSaveState('idle'), 1800)
    }, durationMs)
  }, [saveState, durationMs])

  return { saveState, triggerSave }
}
