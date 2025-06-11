'use client';
import { useState } from 'react';


interface Person {
    id: number;
    name: string;
    gender: string;
}

interface RelationQuizProps {
    people: Person[];
    onSelect: (person1: string, person2: string) => void;
}

export default function RelationQuiz({ people, onSelect }: RelationQuizProps) {
    const [firstPerson, setFirstPerson] = useState<string>('');
    const [secondPerson, setSecondPerson] = useState<string>('');
    const [isSaved, setIsSaved] = useState<boolean>(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSelect(firstPerson, secondPerson);
        setIsSaved(true)
    };


    if (isSaved)
        return (
            <div className="flex items-center justify-center h-full gap-4 p-4 m-2 bg-white shadow-md rounded-md">
                <div>
                    Relation between {firstPerson === "Current" ? "The user" : firstPerson} and {secondPerson}
                </div>
            </div>

        )

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 m-2 bg-white shadow-md rounded-md">
            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Select First Person
                </label>
                <select
                    value={firstPerson}
                    onChange={(e) => setFirstPerson(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                >
                    <option value="">Select a person...</option>
                    <option value="Current">Current</option>
                    {people.map((person) => (
                        <option key={person.id} value={person.name}>
                            {person.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Select Second Person
                </label>
                <select
                    value={secondPerson}
                    onChange={(e) => setSecondPerson(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                >
                    <option value="">Select a person...</option>
                    {people.map((person) => (
                        <option key={person.id} value={person.name}>
                            {person.name}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                disabled={!firstPerson || !secondPerson}
            >
                Save
            </button>
        </form>
    );
}