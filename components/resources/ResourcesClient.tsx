'use client';

import { ResourceCard } from '@/components/cards/ResourceCard';
import { SearchBar } from '@/components/forms/SearchBar';
import { useState, useMemo } from 'react';
import { Filter } from 'lucide-react';

type Resource = {
    id: string;
    slug: string;
    title: string;
    summary: string;
    description: string;
    type: string;
    audience: string[];
    category: string;
    tags: string[];
    origin: string;
    chapter?: {
        id: string;
        name: string;
    } | null;
};

const RESOURCE_TYPES = ['TEMPLATE', 'VIDEO', 'WORKSHOP', 'GUIDE', 'TOOL', 'EVENT', 'SERVICE'];
const CATEGORIES = ['Leadership', 'Competition Prep', 'Operations', 'Marketing', 'Community Service'];
const AUDIENCES = ['Students', 'Advisors', 'Chapter Officers', 'New Chapters'];

export function ResourcesClient({ initialResources }: { initialResources: Resource[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedAudience, setSelectedAudience] = useState<string>('');

    const filteredResources = useMemo(() => {
        return initialResources.filter((resource) => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    resource.title.toLowerCase().includes(query) ||
                    resource.summary.toLowerCase().includes(query) ||
                    resource.description.toLowerCase().includes(query) ||
                    resource.tags.some((tag) => tag.toLowerCase().includes(query));
                if (!matchesSearch) return false;
            }

            // Type filter
            if (selectedType && resource.type !== selectedType) return false;

            // Category filter
            if (selectedCategory && resource.category !== selectedCategory) return false;

            // Audience filter
            if (selectedAudience && !resource.audience.includes(selectedAudience)) return false;

            return true;
        });
    }, [initialResources, searchQuery, selectedType, selectedCategory, selectedAudience]);

    return (
        <div className="space-y-8">
            {/* Search and Filters */}
            <div className="glass-card rounded-xl p-6 space-y-4">
                <SearchBar
                    onSearch={setSearchQuery}
                    placeholder="Search resources by title, description, or tags..."
                />

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            <Filter className="inline w-4 h-4 mr-1" />
                            Resource Type
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                        >
                            <option value="">All Types</option>
                            {RESOURCE_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                        >
                            <option value="">All Categories</option>
                            {CATEGORIES.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Audience</label>
                        <select
                            value={selectedAudience}
                            onChange={(e) => setSelectedAudience(e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                        >
                            <option value="">All Audiences</option>
                            {AUDIENCES.map((audience) => (
                                <option key={audience} value={audience}>
                                    {audience}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Active filters display */}
                {(searchQuery || selectedType || selectedCategory || selectedAudience) && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {searchQuery && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                                Search: "{searchQuery}"
                                <button onClick={() => setSearchQuery('')} className="hover:text-primary-900">
                                    ×
                                </button>
                            </span>
                        )}
                        {selectedType && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                                Type: {selectedType.replace('_', ' ')}
                                <button onClick={() => setSelectedType('')} className="hover:text-primary-900">
                                    ×
                                </button>
                            </span>
                        )}
                        {selectedCategory && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                                Category: {selectedCategory}
                                <button onClick={() => setSelectedCategory('')} className="hover:text-primary-900">
                                    ×
                                </button>
                            </span>
                        )}
                        {selectedAudience && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                                Audience: {selectedAudience}
                                <button onClick={() => setSelectedAudience('')} className="hover:text-primary-900">
                                    ×
                                </button>
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Results count */}
            <div className="text-neutral-600">
                Showing <span className="font-semibold">{filteredResources.length}</span> resource
                {filteredResources.length !== 1 ? 's' : ''}
            </div>

            {/* Resources Grid */}
            {filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-neutral-500 text-lg">No resources found matching your criteria.</p>
                    <p className="text-neutral-400 mt-2">Try adjusting your filters or search query.</p>
                </div>
            )}
        </div>
    );
}
