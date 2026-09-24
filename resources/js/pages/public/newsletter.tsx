import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Mail, Send } from 'lucide-react';
import { home } from '@/routes';
import { subscribe as newsletterSubscribe } from '@/routes/newsletter';
import type { FormEvent } from 'react';
import type { PlatformSetting } from '@/types';

export default function NewsletterPublic() {
    const { platform, newsletter_notice } = usePage().props as {
        platform?: PlatformSetting | null;
        newsletter_notice?: { type: string; message: string } | null;
    };

    const brandName = platform?.brand_name ?? 'Project';

    const form = useForm({ email: '', name: '' });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.submit(newsletterSubscribe(), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Newsletter" />
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="sticky top-0 z-20 mb-6 w-full max-w-[335px] bg-[#FDFDFC] px-2 py-4 text-sm not-has-[nav]:hidden lg:max-w-4xl dark:bg-[#0a0a0a]">
                    <div className="flex items-center justify-between gap-4">
                        <Link href={home()} className="flex min-w-0 items-center gap-2.5">
                            {platform?.logo ? (
                                <img
                                    src={platform.logo}
                                    alt=""
                                    className="size-9 shrink-0 rounded-lg object-contain"
                                />
                            ) : (
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-sm font-semibold text-white">
                                    {brandName.charAt(0)}
                                </span>
                            )}
                            <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                    {brandName}
                                </span>
                                <span className="hidden truncate text-xs text-[#706f6c] sm:block dark:text-[#A1A09A]">
                                    Subscribe to our newsletter
                                </span>
                            </span>
                        </Link>
                    </div>
                </header>

                <main className="flex w-full max-w-[480px] flex-col gap-8">
                    <section className="rounded-xl border border-[#E7E5E4] bg-white p-8 shadow-sm dark:border-[#1D1D1B] dark:bg-[#161615]">
                        <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                            <Mail className="size-6" />
                        </div>

                        <h1 className="text-xl font-semibold tracking-tight text-[#1b1b18] dark:text-[#EDEDEC]">
                            Subscribe to the newsletter
                        </h1>
                        <p className="mt-2 text-sm leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
                            Get the latest news delivered straight to your inbox.
                        </p>

                        {newsletter_notice && (
                            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-400">
                                {newsletter_notice.message}
                            </div>
                        )}

                        <form
                            onSubmit={onSubmit}
                            className="mt-6 space-y-4"
                            noValidate
                        >
                            <input type="hidden" name="_token" value="" />

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.data.email}
                                    onChange={(e) =>
                                        form.setData('email', e.target.value)
                                    }
                                    placeholder="you@example.com"
                                    className="w-full rounded-lg border border-[#E7E5E4] bg-white px-3 py-2.5 text-sm text-[#1b1b18] placeholder:text-[#A1A09A] focus:border-emerald-500 focus:ring-emerald-500/30 focus:ring-2 focus:outline-none dark:border-[#1D1D1B] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]"
                                />
                                {form.errors.email && (
                                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
                                        {form.errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                    Name <span className="text-[#A1A09A]">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData('name', e.target.value)
                                    }
                                    placeholder="Your name"
                                    className="w-full rounded-lg border border-[#E7E5E4] bg-white px-3 py-2.5 text-sm text-[#1b1b18] placeholder:text-[#A1A09A] focus:border-emerald-500 focus:ring-emerald-500/30 focus:ring-2 focus:outline-none dark:border-[#1D1D1B] dark:bg-[#0a0a0a] dark:text-[#EDEDEC]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={form.processing}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 focus:ring-emerald-500/30 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                            >
                                <Send className="size-4" />
                                {form.processing ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>
                    </section>

                    <p className="text-center text-xs text-[#706f6c] dark:text-[#A1A09A]">
                        {brandName} ·{' '}
                        <Link
                            href={home()}
                            className="underline underline-offset-2 hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]"
                        >
                            Back to home
                        </Link>
                    </p>
                </main>
            </div>
        </>
    );
}