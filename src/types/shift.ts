export interface Shift {
    id: number
    title: string
    date: string
    location: string
    specialty: string
    status: 'open' | 'applied'
    hourlyRate: number
}