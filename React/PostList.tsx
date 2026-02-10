import React, { useState, useEffect } from 'react';

interface Post {
    id: number;
    title: string;
    body: string;
}

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
                if (!response.ok) throw new Error('Failed to fetch');
                const data: Post[] = await response.json();
                setPosts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <div className="text-center p-4">Loading posts...</div>;
    if (error) return <div className="text-red-500 p-4 font-bold">Error: {error}</div>;

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold border-b pb-2">Recent Posts (Mock Data)</h2>
            {posts.map(post => (
                <div key={post.id} className="p-4 bg-gray-50 rounded border">
                    <h3 className="font-semibold text-lg capitalize">{post.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{post.body}</p>
                </div>
            ))}
        </div>
    );
};

export default PostList;
