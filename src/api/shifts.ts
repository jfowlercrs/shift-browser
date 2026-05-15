import type { Shift } from "../types/shift";

const API_URL = 'http://localhost:3001'

export const fetchShifts = async (): Promise<Shift[]> => {
    //await new Promise(resolve => setTimeout(resolve, 2000))
    const response = await fetch(`${API_URL}/shifts`)
    if (!response.ok) {
        throw new Error('Failed to fetch shifts')
    }
    return response.json()
}

export const applyForShift = async (id: number): Promise<Shift> => {
    const response = await fetch(`${API_URL}/shifts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'applied' })
    })
    if (!response.ok) {
        throw new Error('Failed to apply for shift')
    }
    return response.json()
}