import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import SiteSettings from '@/models/SiteSettings';
import SEOMetadata from '@/models/SEOMetadata';

export async function POST(req: NextRequest) {
    try {
        const { ids } = await req.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'No game IDs provided' }, { status: 400 });
        }

        await dbConnect();

        // Fetch games that need SEO
        const games = await Game.find({ _id: { $in: ids } });

        if (games.length === 0) {
            return NextResponse.json({ error: 'No valid games found' }, { status: 404 });
        }

        const settings = await SiteSettings.findOne();
        const apiKey = (settings?.geminiKey || process.env.GEMINI_API_KEY || '').trim();

        if (!apiKey) {
            return NextResponse.json({ error: 'Gemini API Key missing' }, { status: 500 });
        }

        const results = [];
        const modelName = 'gemini-2.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;

        // Process sequentially to be gentle on API limits
        for (const game of games) {
            try {
                const prompt = `
                    Generate SEO Metadata for:
                    Title: ${game.title}
                    Description: ${(game.description || '').substring(0, 500)}

                    Return JSON:
                    { "title": "Meta Title", "description": "Meta Desc (150 chars)", "keywords": "k1, k2, k3" }
                `;

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { temperature: 0.7 }
                    })
                });

                if (!response.ok) throw new Error(`API Error ${response.status}`);

                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!text) throw new Error('No text returned');

                const jsonMatch = text.match(/\{[\s\S]*\}/);
                const jsonStr = jsonMatch ? jsonMatch[0] : text;
                const seoData = JSON.parse(jsonStr);

                const routePath = `/game/${game.slug}`;
                await SEOMetadata.findOneAndUpdate(
                    { route: routePath },
                    {
                        route: routePath,
                        title: seoData.title,
                        description: seoData.description,
                        keywords: seoData.keywords,
                        isActive: true
                    },
                    { upsert: true, new: true }
                );

                results.push({ id: game._id, status: 'success', title: seoData.title });
            } catch (err: any) {
                console.error(`Failed SEO for game ${game.title}:`, err);
                results.push({
                    id: game._id,
                    status: 'error',
                    error: err.message
                });
            }
        }

        console.log(`Bulk SEO Finished. Success: ${results.filter(r => r.status === 'success').length}, Total: ${results.length}`);

        return NextResponse.json({
            message: 'Bulk SEO processing complete',
            results
        });

    } catch (error: any) {
        console.error('Bulk SEO Fatal Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
