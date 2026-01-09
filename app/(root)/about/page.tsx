import { getMetadataForPath } from '@/lib/seo';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    return await getMetadataForPath('/about', {
        title: 'About | choksapk - Our Protocol',
        description: 'Learn about the mission and technology behind the choksapk repository.'
    });
}

export default function AboutPage() {
    return (
        <div className="bg-background min-h-[70vh] py-24">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-card border border-border rounded-[2.5rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px] -mr-40 -mt-40"></div>

                    <h1 className="text-4xl md:text-5xl font-black text-foreground mb-10 uppercase tracking-tighter italic">About <span className="text-primary font-outfit uppercase">pkr games</span></h1>

                    <div className="space-y-8 text-muted-foreground font-medium leading-relaxed text-lg relative z-10">
                        <section>
                            <h2 className="text-xl font-black text-foreground uppercase tracking-tight mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-primary rounded-full"></span> Welcome to Our Platform
                            </h2>
                            <p>
                                We warmly welcome all the respected visitors on the site <span className="text-primary font-bold">PKRGAMES.COM.PK</span>. <span className="text-foreground font-bold">pkr games</span> is a third-party Open source platform which provides all kinds of third-party applications to android operating users.
                            </p>
                            <p className="mt-4">
                                On our site <span className="text-primary font-bold">pkrgames.com.pk</span> we share informative and useful android apps, games, gaming injectors, and casino app reviews with an APK file. For your easiness All the games apps and injectors are categorized in subgroups so download the APK file you need from our website without investing real bucks. Moreover you don’t need any registration or any user account to download the available apks. This was all about us.
                            </p>
                        </section>

                        <section className="bg-muted/30 p-8 rounded-3xl border border-border/50">
                            <h2 className="text-xl font-black text-foreground uppercase tracking-tight mb-4">What kind of apps and games can you find here?</h2>
                            <p>
                                You will find All your favorite apps and games with their tools such as social, productivity, rooting apps, hacking apps, and much more on our site totally free of cost. We offer apps and games which work 100 percent effectively and do not charge anything for their download and usage. Which You can not find any other website.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-black text-foreground uppercase tracking-tight mb-4">Have you liked our service?</h2>
                            <p>
                                We are sure you liked our service and we hope you always visit our site to download your favorite apps and games without investing a single penny. Moreover, you can request for your favorite files which are not available on our site. We assure you that you will get the APK file on our site on your next visit. Share your feedback and suggestions in the given comment section.
                            </p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border/50 text-sm">
                            <div className="space-y-2">
                                <h4 className="font-black text-foreground uppercase tracking-widest text-xs">Proprietor</h4>
                                <p className="text-primary font-bold">PKR GAMES</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-black text-foreground uppercase tracking-widest text-xs">Email</h4>
                                <p className="text-primary font-bold">PKR GAMES@gmail.com</p>
                            </div>
                        </div>

                        <div className="pt-8 italic text-foreground font-black text-2xl uppercase tracking-tighter">
                            Sincerely, <br />
                            <span className="text-primary">PKR GAMES</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
