'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { X, AlertTriangle } from 'lucide-react'

interface ConfirmDialogContextType {
    confirm: (message: string, title?: string) => Promise<boolean>
}

const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined)

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState('Confirm Action')
    const [message, setMessage] = useState('')
    const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null)

    const confirm = (msg: string, titleText: string = 'Confirm Action'): Promise<boolean> => {
        setMessage(msg)
        setTitle(titleText)
        setIsOpen(true)

        return new Promise((resolve) => {
            setResolvePromise(() => resolve)
        })
    }

    const handleConfirm = () => {
        if (resolvePromise) resolvePromise(true)
        setIsOpen(false)
    }

    const handleCancel = () => {
        if (resolvePromise) resolvePromise(false)
        setIsOpen(false)
    }

    return (
        <ConfirmDialogContext.Provider value={{ confirm }}>
            {children}

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-fadeInUp">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-100 p-2 rounded-full">
                                    <AlertTriangle className="text-red-600" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                            </div>
                            <button
                                onClick={handleCancel}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <p className="text-gray-700 leading-relaxed">{message}</p>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 p-6 bg-gray-50 rounded-b-xl">
                            <button
                                onClick={handleCancel}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmDialogContext.Provider>
    )
}

export function useConfirm() {
    const context = useContext(ConfirmDialogContext)
    if (!context) {
        throw new Error('useConfirm must be used within ConfirmDialogProvider')
    }
    return context
}
