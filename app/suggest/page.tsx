'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';

const RESOURCE_TYPES = ['Template', 'Video', 'Workshop', 'Guide', 'Tool', 'Event', 'Service', 'Other'];
const CATEGORIES = ['Leadership', 'Competition Prep', 'Operations', 'Marketing', 'Community Service', 'Other'];

export default function SuggestPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        resourceName: '',
        description: '',
        url: '',
        type: '',
        audience: '',
        category: '',
        chapterName: '',
        email: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/suggestions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitted(true);
            } else {
                alert('Failed to submit suggestion. Please try again.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center py-20">
                <div className="container">
                    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center border border-neutral-200">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-neutral-900 mb-4">Thank You!</h1>
                        <p className="text-lg text-neutral-600 mb-8">
                            Your resource suggestion has been submitted successfully. Our team will review it and,
                            if approved, add it to the WTSA Resource Hub.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={() => setSubmitted(false)}>Submit Another</Button>
                            <Button variant="outline" onClick={() => (window.location.href = '/resources')}>
                                Browse Resources
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="page-header-accent py-16 relative">
                <div className="container relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900">Suggest a Resource</h1>
                        <p className="text-xl text-neutral-600">
                            Know of a great resource that could help other WTSA chapters? Share it with our
                            community! Your suggestion will be reviewed and added to the hub.
                        </p>
                    </div>
                </div>
            </section>

            {/* Form */}
            <section className="section">
                <div className="container">
                    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-neutral-200">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Resource Name */}
                            <div>
                                <label htmlFor="resourceName" className="block text-sm font-medium text-neutral-700 mb-2">
                                    Resource Name <span className="text-accent-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="resourceName"
                                    required
                                    value={formData.resourceName}
                                    onChange={(e) => setFormData({ ...formData, resourceName: e.target.value })}
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="e.g., CAD Tutorial Series"
                                />
                            </div>

                            {/* Type and Category */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-neutral-700 mb-2">
                                        Resource Type <span className="text-accent-600">*</span>
                                    </label>
                                    <select
                                        id="type"
                                        required
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                                    >
                                        <option value="">Select type...</option>
                                        {RESOURCE_TYPES.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-2">
                                        Category <span className="text-accent-600">*</span>
                                    </label>
                                    <select
                                        id="category"
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                                    >
                                        <option value="">Select category...</option>
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                                    Description <span className="text-accent-600">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    required
                                    rows={5}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                    placeholder="Describe this resource and how it can help other chapters..."
                                />
                            </div>

                            {/* URL */}
                            <div>
                                <label htmlFor="url" className="block text-sm font-medium text-neutral-700 mb-2">
                                    Resource URL or Link
                                </label>
                                <input
                                    type="url"
                                    id="url"
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="https://..."
                                />
                            </div>

                            {/* Target Audience */}
                            <div>
                                <label htmlFor="audience" className="block text-sm font-medium text-neutral-700 mb-2">
                                    Target Audience <span className="text-accent-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="audience"
                                    required
                                    value={formData.audience}
                                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    placeholder="e.g., Students, Advisors, Chapter Officers"
                                />
                            </div>

                            {/* Optional Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="chapterName" className="block text-sm font-medium text-neutral-700 mb-2">
                                        Your Chapter (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="chapterName"
                                        value={formData.chapterName}
                                        onChange={(e) => setFormData({ ...formData, chapterName: e.target.value })}
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="e.g., Lake Washington HS"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                                        Contact Email (Optional)
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            {/* Consent */}
                            <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        required
                                        className="mt-1 w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-neutral-700">
                                        I confirm that the information provided is accurate and that I have permission to
                                        share this resource with the WTSA community.
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit Suggestion'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
