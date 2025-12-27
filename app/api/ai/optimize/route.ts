import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';

export async function POST(req: NextRequest) {
    try {
        const { text, mode } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        await dbConnect();
        const settings = await SiteSettings.findOne();

        // Use provided gemini key or fallback to the one user shared
        const apiKey = (settings?.geminiKey || 'AIzaSyD3iCK7pSAnu8UL1eFrU735jeEdMpbadtg').trim();

        let prompt = '';
        if (mode === 'humanize') {
            prompt = `Rearrange and humanize the following text to sound natural, engaging, and professional. Avoid robotic patterns. Return ONLY the rewritten text:\n\n${text}`;
        } else if (mode === 'seo') {
            prompt = `SEO-optimize the following text. Make it more relevant for search engines while keeping it highly readable and "human-like". Use keywords naturally. Return ONLY the rewritten text:\n\n${text}`;
        } else {
            prompt = `Optimize the following text for SEO and humanize it. Rearrange it to be more engaging and high-converting. Return ONLY the rewritten text:\n\n${text}`;
        }

        // We use the stable v1 endpoint and gemini-2.5-flash which is confirmed working
        const modelName = 'gemini-2.5-flash';
        const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            { text: prompt }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Gemini API Error details:', data);
            throw new Error(data.error?.message || `API error: ${response.statusText}`);
        }

        const optimizedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!optimizedText) {
            throw new Error('No content returned from AI');
        }

        return NextResponse.json({ optimizedText });
    } catch (error: any) {
        console.error('Final Gemini Optimization Error:', error);
        return NextResponse.json({
            error: error.message || 'AI processing failed'
        }, { status: 500 });
    }
}
