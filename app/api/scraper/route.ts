import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dbConnect from '@/lib/mongodb';
import Game from '@/models/Game';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { processAndBrandedImage } from '@/lib/imageProcessor';

async function verifyAdmin() {
    const token = (await cookies()).get('token')?.value;
    const payload = await verifyToken(token || '');
    return payload && (payload.role === 'admin' || payload.role === 'super_admin');
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export async function POST(req: NextRequest) {
    try {
        if (!(await verifyAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { url, selector, mode, useAiBranding = false } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Fetch the webpage
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });

        const html = response.data;
        const $ = cheerio.load(html);

        const scrapedGames: any[] = [];

        // Detect if this is a single game page or a listing page
        const isSingleGame = mode === 'single' ||
            url.includes('/game/') ||
            url.includes('/casino/') ||
            !selector;

        if (isSingleGame) {
            // SINGLE GAME MODE: Extract from entire page
            const title = $('h1').first().text().trim() ||
                $('title').text().split('|')[0].trim() ||
                $('meta[property="og:title"]').attr('content') ||
                'Untitled Game';

            // Try to get actual description from page content FIRST - GET EVERYTHING
            let description = '';

            // Priority 1: Check for dedicated description/content sections - GET ALL CONTENT
            const descripcionText = $('#descripcion').html() || $('#descripcion').text().trim();
            if (descripcionText && descripcionText.length > 100) {
                description = descripcionText; // No character limit - get everything
            }

            // Priority 2: Try to find all article/content areas - GET EVERYTHING
            if (!description) {
                const contentHtml = $('.content, .entry-content, article, .description, .post-content').first().html();
                if (contentHtml && contentHtml.length > 100) {
                    description = contentHtml; // Get full HTML content
                } else {
                    // Fallback: Get all content paragraphs
                    const contentParagraphs = $('.content p, .entry-content p, article p, .description p, .post-content p')
                        .map((i, el) => $(el).html() || $(el).text().trim())
                        .get()
                        .filter(text => text.length > 20) // Get nearly all paragraphs
                        .join('<br><br>'); // Join with line breaks

                    if (contentParagraphs.length > 100) {
                        description = contentParagraphs; // Full content
                    }
                }
            }

            // Priority 3: Get all paragraphs from the page
            if (!description) {
                const allParagraphs = $('p')
                    .map((i, el) => $(el).html() || $(el).text().trim())
                    .get()
                    .filter(text => text.length > 20)
                    .join('<br><br>');

                if (allParagraphs.length > 100) {
                    description = allParagraphs;
                }
            }

            // Priority 4: Fallback to meta tags only if no content found
            if (!description) {
                description = $('meta[name="description"]').attr('content') ||
                    $('meta[property="og:description"]').attr('content') ||
                    '';
            }

            const thumbnail = $('meta[property="og:image"]').attr('content') ||
                $('img').first().attr('src') ||
                $('img').first().attr('data-src') ||
                '';

            // Extract provider from various possible locations
            const provider = $('.provider').text().trim() ||
                $('.developer').text().trim() ||
                $('.author').text().trim() ||
                $('meta[name="author"]').attr('content') ||
                'Unknown Provider';

            // Extract metadata fields if available
            const version = $('*:contains("Version")').filter((i, el) => {
                const text = $(el).text();
                return !!(text.includes('Version') && text.length < 50);
            }).first().text().replace(/Version\s*:?\s*/i, '').trim() || '1.0.0';

            const fileSize = $('*:contains("Size")').filter((i, el) => {
                const text = $(el).text();
                const hasSize = text.match(/\d+\s*(MB|GB|KB)/i);
                return !!(hasSize && text.length < 50);
            }).first().text().replace(/Size\s*:?\s*/i, '').trim() || '45 MB';

            const requirements = $('*:contains("Requirements"), *:contains("Android")').filter((i, el) => {
                const text = $(el).text();
                const hasAndroid = text.match(/Android\s*\d+/i);
                return !!(hasAndroid && text.length < 50);
            }).first().text().replace(/Requirements\s*:?\s*/i, '').trim() || 'Android 5.0+';

            const downloadCount = $('*:contains("Downloads")').filter((i, el) => {
                const text = $(el).text();
                const hasNumber = text.match(/\d+/);
                return !!(hasNumber && text.includes('Download') && text.length < 50);
            }).first().text().replace(/Downloads?\s*:?\s*/i, '').trim() || '100,000+';

            // Try to get referral/download link
            const referralUrl = $('a[href*="download"]').first().attr('href') ||
                $('a[href*="play"]').first().attr('href') ||
                $('a.btn, a.button').first().attr('href') ||
                url;

            if (title && title.length > 2) {
                scrapedGames.push({
                    title,
                    slug: generateSlug(title),
                    description,
                    thumbnail: thumbnail.startsWith('http') ? thumbnail : new URL(thumbnail, url).href,
                    provider,
                    version,
                    fileSize,
                    requirements,
                    downloadCount,
                    referralUrl: referralUrl?.startsWith('http') ? referralUrl : new URL(referralUrl || '', url).href,
                    category: 'general',
                    isActive: true, // Automatically publish scraped games
                });
            }
        } else {
            // LISTING MODE: Multiple games
            const gameSelector = selector || '.game-item, .product, .card, article, .post, .entry';

            $(gameSelector).each((index, element) => {
                const $el = $(element);

                const title = $el.find('h1, h2, h3, h4, .title, .name').first().text().trim() ||
                    $el.find('a').first().text().trim() ||
                    $el.attr('title') ||
                    `Game ${index + 1}`;

                const description = $el.find('p, .description, .summary, .excerpt').first().text().trim() ||
                    $el.text().trim().substring(0, 200);

                const thumbnail = $el.find('img').first().attr('src') ||
                    $el.find('img').first().attr('data-src') ||
                    $el.find('img').first().attr('data-lazy-src') ||
                    '';

                const provider = $el.find('.provider, .developer, .author').first().text().trim() ||
                    'Unknown Provider';

                const gameUrl = $el.find('a').first().attr('href') || '';

                if (title && title.length > 2) {
                    scrapedGames.push({
                        title,
                        slug: generateSlug(title),
                        description,
                        thumbnail: thumbnail.startsWith('http') ? thumbnail : new URL(thumbnail, url).href,
                        provider,
                        referralUrl: gameUrl.startsWith('http') ? gameUrl : new URL(gameUrl, url).href,
                        category: 'general',
                        isActive: true, // Automatically publish scraped games
                    });
                }
            });
        }

        if (scrapedGames.length === 0) {
            return NextResponse.json({
                error: 'No games found. Try adjusting the selector.',
                debug: {
                    mode: isSingleGame ? 'single' : 'listing',
                    url,
                    selector,
                    pageTitle: $('title').text(),
                    h1Count: $('h1').length,
                    imgCount: $('img').length,
                },
                suggestions: [
                    'For single game pages, try using "Single Game Mode"',
                    'For listing pages, try different selectors like: article, .post, .game-card',
                    'Check if the website requires JavaScript rendering (our scraper only works with static HTML)',
                ]
            }, { status: 400 });
        }

        await dbConnect();

        // Import games into database
        const results = {
            imported: 0,
            skipped: 0,
            errors: [] as string[]
        };

        for (const gameData of scrapedGames) {
            try {
                // Check if game already exists
                const existing = await Game.findOne({ slug: gameData.slug });

                if (existing) {
                    results.skipped++;
                    continue;
                }

                // AI Image Branding
                if (useAiBranding && gameData.thumbnail) {
                    try {
                        gameData.thumbnail = await processAndBrandedImage(gameData.thumbnail, 'ear-apk.com');
                    } catch (imgErr) {
                        console.error('Branding failed for:', gameData.title, imgErr);
                    }
                }

                await Game.create(gameData);
                results.imported++;
            } catch (err: any) {
                results.errors.push(`${gameData.title}: ${err.message}`);
            }
        }

        return NextResponse.json({
            success: true,
            total: scrapedGames.length,
            imported: results.imported,
            skipped: results.skipped,
            errors: results.errors,
            preview: scrapedGames.slice(0, 5) // Show first 5 for preview
        });

    } catch (error: any) {
        console.error('Scraper Error:', error);
        return NextResponse.json({
            error: error.message || 'Scraping failed',
            details: error.response?.statusText || ''
        }, { status: 500 });
    }
}
