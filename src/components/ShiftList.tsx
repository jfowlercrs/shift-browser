import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchShifts, applyForShift } from "../api/shifts";
import type { Shift } from "../types/shift";
import ShiftCard from "./ShiftCard";
import { useState } from "react";
import ShiftCardSkeleton from "./ShiftCardSkeleton";
import ShiftModal from "./ShiftModal";
import { useDebounce } from "../hooks/useDebounce";

const ShiftList = () => {
    const queryClient = useQueryClient()
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All')
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null)
    const [searchTerm, setSearchTerm] = useState<string>('')

    const { data: shifts, isLoading, isError } = useQuery({
        queryKey: ['shifts'],
        queryFn: fetchShifts,
        //staleTime: 0, 
        //gcTime: 0
    })

    // //basic mutation without optimistic updates
    // const mutation = useMutation({
    //     mutationFn: (id: number) => applyForShift(id),
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({ queryKey: ['shifts']})
    //     }
    // })

    //advanced mutation with optimistic updates
    const mutation = useMutation({
        mutationFn: (id: number) => applyForShift(id),

        onMutate: async (id: number) => {
            //cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['shifts']})

            //snapshot previous value
            const previousShifts = queryClient.getQueryData<Shift[]>(['shifts'])

            //optimistically update to new value
            queryClient.setQueryData<Shift[]>(['shifts'], old =>
                old?.map(shift =>
                    shift.id === id 
                    ? { ...shift, status: 'applied' as const }
                    : shift
                ) ?? []
            )

            //return snapshot for rollback
            return { previousShifts }
            
        },
        onSuccess: () => {
            setSelectedShift(prev => prev ? {...prev, status: 'applied' as const } : null)
        },
        onError: (err, id, context) => {
            //roll back to snapshot on error
            if (context?.previousShifts) {
                queryClient.setQueriesData<Shift[]>(['shifts'], context.previousShifts)                
            }
            console.error('Failed to apply for shift:', err)
        },
        onSettled: () => {
            //always refecth after mutation settles
            queryClient.invalidateQueries({ queryKey: ['shifts']})
        }
    })

    const specialties = ['All', ...new Set(shifts?.map(s => s.specialty) ?? [])]
    const debouncedSearchTerm = useDebounce(searchTerm, 300)

    //const filteredShifts = selectedSpecialty === 'All' ? shifts : shifts?.filter(s => s.specialty === selectedSpecialty)
    const filteredShifts = shifts
        ?.filter(s => selectedSpecialty === "All" || s.specialty === selectedSpecialty)
        .filter(s =>
            // s => searchTerm === '' 
            // || s.title.toLowerCase().includes(searchTerm.toLowerCase()) 
            // || s.location.toLowerCase().includes(searchTerm.toLowerCase())
            debouncedSearchTerm === '' ||
            s.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            s.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
        

    //if (isLoading) return <div>Loading shifts...</div>
    if (isLoading) return (
        <div className="shift-browser">
            <div className="shift-list">
                {Array.from({ length: 6 }).map((_, i) => (
                    <ShiftCardSkeleton key={i} />
                ))}
            </div>
        </div>
    )

    if (isError) return <div>Error loading shifts. Please try again.</div>

    return (
        <>
        <div className="shift-browser">
            <div className="filter-bar">
                <label htmlFor="specialty">Filter by Specialty:</label>
                <select 
                    id="specialty" 
                    value={selectedSpecialty} 
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                    {specialties.map((specialty) => (
                        <option key={specialty} value={specialty}>
                            {specialty}
                        </option>
                    ))}
                </select>
                <input 
                    type="text" 
                    placeholder="Search shifts..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="search-input" 
                />
            </div>
        </div>
        <div className="shift-list">
            {filteredShifts?.map((shift: Shift) => (
                <ShiftCard 
                    key={shift.id} 
                    shift={shift} 
                    onApply={mutation.mutate} 
                    isApplying={mutation.isPending} 
                    onSelect={(shift) => setSelectedShift(shift)}
                />
            ))}
        </div>
        {selectedShift && (
            <ShiftModal 
                shift={selectedShift} 
                onClose={() => setSelectedShift(null)} 
                onApply={mutation.mutate} 
                isApplying={mutation.isPending} 
            />
        )}
        </>
    )
}

export default ShiftList