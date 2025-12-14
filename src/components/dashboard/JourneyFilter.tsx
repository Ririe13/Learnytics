
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen } from "lucide-react"; // Icon buku untuk Journey
import { getJourneyList } from "@/services/api";

interface Journey {
    id: number;
    name: string;
}

interface JourneyFilterProps {
    value: string;
    onChange: (value: string) => void;
}

export function JourneyFilter({ value, onChange }: JourneyFilterProps) {
    const [journeys, setJourneys] = useState<Journey[]>([]);

    useEffect(() => {
        const fetchJourneys = async () => {
            const data = await getJourneyList();
            setJourneys(data);
        };
        fetchJourneys();
    }, []);

    return (
        <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Filter by Journey" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Journeys</SelectItem>
                    {journeys.map((journey) => (
                        <SelectItem key={journey.id} value={journey.id.toString()}>
                            {journey.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
