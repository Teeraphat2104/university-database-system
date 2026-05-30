"use client"

import { createContext, useContext } from "react"

type ModalContextValue = {
  portalTarget: HTMLElement | null
}

const ModalContext = createContext<ModalContextValue>({ portalTarget: null })

export function ModalProvider({ portalTarget, children }: { portalTarget: HTMLElement | null; children: React.ReactNode }) {
  return <ModalContext.Provider value={{ portalTarget }}>{children}</ModalContext.Provider>
}

export function useModalPortal() {
  return useContext(ModalContext)
}
