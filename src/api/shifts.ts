import { z } from "zod";

const API_URL = 'http://localhost:3001'

const shiftSchema = z.object({
    id: z.coerce.number(),
    title: z.string().max(100),
    date: z.string(),
    location: z.string(),
    specialty: z.string(),
    status: z.enum(['open','applied']),
    hourlyRate: z.number().positive()
})

export type Shift = z.infer<typeof shiftSchema>

const ShiftsArraySchema = z.array(shiftSchema)

export const fetchShifts = async (): Promise<Shift[]> => {
    const response = await fetch(`${API_URL}/shifts`)
    if (!response.ok) {
        throw new Error('Failed to fetch shifts')
    }

    const data = await response.json()

    //validate
    const result = ShiftsArraySchema.safeParse(data) 

    if (!result.success) {
        throw new Error('Invalid API response: ${result.error.message}')
    }
    return result.data
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

    const data = await response.json()

    //validate
    const result = shiftSchema.safeParse(data)
    if (!result.success) {
        throw new Error('Invalid Shift response: ${result.error.message}')
    }
    return result.data
}