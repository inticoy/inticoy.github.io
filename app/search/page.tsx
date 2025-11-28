import React from 'react'
import { getAllPosts } from '@/lib/notion'
import { SearchClient } from '@/components/search/search-client'

export const revalidate = 3600 // Revalidate every hour

export default async function SearchPage() {
    const posts = await getAllPosts()

    return (
        <SearchClient posts={posts} />
    )
}
