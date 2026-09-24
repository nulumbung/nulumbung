import { Form, Head, useForm } from '@inertiajs/react';
import {
    AtSign,
    Camera,
    Facebook,
    Instagram,
    Mail,
    MapPin,
    MessageCircle,
    Phone,
    Send,
    Youtube,
} from 'lucide-react';
import { useState } from 'react';
import PlatformController from '@/actions/App/Http/Controllers/System/PlatformController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { edit as editPlatform } from '@/routes/system/platform';
import type { PlatformSetting } from '@/types';

export default function PlatformSettings({
    platform,
}: {
    platform: PlatformSetting;
}) {
    return (
        <>
            <Head title="Platform settings" />

            <h1 className="sr-only">Platform settings</h1>

            <div className="flex h-full flex-1 flex-col justify-center gap-4 overflow-x-auto rounded-xl p-4">
                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full max-w-2xl self-center rounded-xl">
                    <CardHeader>
                        <CardTitle>Branding</CardTitle>
                        <CardDescription>
                            Manage your platform identity, branding and tagline
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...PlatformController.update.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-6 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label>Logo</Label>
                                            <div className="flex items-center gap-4">
                                                <LogoAvatar
                                                    current={platform.logo}
                                                />
                                                <p className="text-muted-foreground text-sm">
                                                    Used in the sidebar and
                                                    public pages
                                                </p>
                                            </div>
                                            <InputError message={errors.logo} />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label>Favicon</Label>
                                            <div className="flex items-center gap-4">
                                                <FaviconAvatar
                                                    current={platform.favicon}
                                                />
                                                <p className="text-muted-foreground text-sm">
                                                    Shown in the browser tab
                                                    and bookmarks
                                                </p>
                                            </div>
                                            <InputError
                                                message={errors.favicon}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="brand_name">
                                                Brand name
                                            </Label>
                                            <Input
                                                id="brand_name"
                                                name="brand_name"
                                                className="mt-1 block w-full"
                                                defaultValue={
                                                    platform.brand_name ?? ''
                                                }
                                                maxLength={255}
                                                placeholder="Brand name"
                                            />
                                            <InputError
                                                message={errors.brand_name}
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="tagline">
                                                Tagline
                                            </Label>
                                            <Input
                                                id="tagline"
                                                name="tagline"
                                                className="mt-1 block w-full"
                                                defaultValue={
                                                    platform.tagline ?? ''
                                                }
                                                maxLength={255}
                                                placeholder="Tagline"
                                            />
                                            <InputError
                                                message={errors.tagline}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        disabled={processing}
                                        data-test="update-platform-button"
                                    >
                                        Save
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>

                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full max-w-2xl self-center rounded-xl">
                    <CardHeader>
                        <CardTitle>Contact and address</CardTitle>
                        <CardDescription>
                            Contact details and address shown across the
                            platform
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ContactSettingsForm platform={platform} />
                    </CardContent>
                </Card>

                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full max-w-2xl self-center rounded-xl">
                    <CardHeader>
                        <CardTitle>Social media</CardTitle>
                        <CardDescription>
                            Links to the platform social media accounts
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SocialMediaSettingsForm platform={platform} />
                    </CardContent>
                </Card>

                <Card className="border-sidebar-border/70 dark:border-sidebar-border w-full max-w-2xl self-center rounded-xl">
                    <CardHeader>
                        <CardTitle>Email configuration</CardTitle>
                        <CardDescription>
                            Configure the SMTP server used to send emails
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <EmailSettingsForm platform={platform} />
                        <TestEmailForm />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

type ContactFormData = {
    contact_email: string;
    contact_phone: string;
    contact_whatsapp: string;
    contact_address: string;
};

function ContactSettingsForm({ platform }: { platform: PlatformSetting }) {
    const form = useForm<ContactFormData>({
        contact_email: platform.contact_email ?? '',
        contact_phone: platform.contact_phone ?? '',
        contact_whatsapp: platform.contact_whatsapp ?? '',
        contact_address: platform.contact_address ?? '',
    });

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.submit(PlatformController.update(), {
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="contact_email">Contact email</Label>
                    <div className="relative">
                        <AtSign className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            id="contact_email"
                            type="email"
                            value={form.data.contact_email}
                            onChange={(e) =>
                                form.setData('contact_email', e.target.value)
                            }
                            placeholder="info@example.com"
                            className="pl-9"
                            autoComplete="off"
                        />
                    </div>
                    <InputError message={form.errors.contact_email} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="contact_phone">Phone number</Label>
                    <div className="relative">
                        <Phone className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            id="contact_phone"
                            value={form.data.contact_phone}
                            onChange={(e) =>
                                form.setData('contact_phone', e.target.value)
                            }
                            placeholder="+62 21 1234567"
                            className="pl-9"
                            autoComplete="off"
                        />
                    </div>
                    <InputError message={form.errors.contact_phone} />
                </div>

                <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="contact_whatsapp">WhatsApp number</Label>
                    <div className="relative">
                        <MessageCircle className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            id="contact_whatsapp"
                            value={form.data.contact_whatsapp}
                            onChange={(e) =>
                                form.setData('contact_whatsapp', e.target.value)
                            }
                            placeholder="+62 812 3456 7890"
                            className="pl-9"
                            autoComplete="off"
                        />
                    </div>
                    <InputError message={form.errors.contact_whatsapp} />
                </div>

                <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="contact_address">Address</Label>
                    <div className="relative">
                        <MapPin className="text-muted-foreground pointer-events-none absolute top-3 left-3 size-4" />
                        <Textarea
                            id="contact_address"
                            value={form.data.contact_address}
                            onChange={(e) =>
                                form.setData('contact_address', e.target.value)
                            }
                            placeholder="Address"
                            className="pl-9"
                            rows={3}
                        />
                    </div>
                    <InputError message={form.errors.contact_address} />
                </div>
            </div>

            <Button type="submit" disabled={form.processing}>
                Save contact details
            </Button>
        </form>
    );
}

type SocialFormData = {
    social_facebook: string;
    social_instagram: string;
    social_youtube: string;
};

function SocialMediaSettingsForm({ platform }: { platform: PlatformSetting }) {
    const form = useForm<SocialFormData>({
        social_facebook: platform.social_facebook ?? '',
        social_instagram: platform.social_instagram ?? '',
        social_youtube: platform.social_youtube ?? '',
    });

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.submit(PlatformController.update(), {
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="social_facebook">Facebook</Label>
                    <div className="relative">
                        <Facebook className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            id="social_facebook"
                            type="url"
                            value={form.data.social_facebook}
                            onChange={(e) =>
                                form.setData('social_facebook', e.target.value)
                            }
                            placeholder="https://facebook.com/username"
                            className="pl-9"
                            autoComplete="off"
                        />
                    </div>
                    <InputError message={form.errors.social_facebook} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="social_instagram">Instagram</Label>
                    <div className="relative">
                        <Instagram className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            id="social_instagram"
                            type="url"
                            value={form.data.social_instagram}
                            onChange={(e) =>
                                form.setData('social_instagram', e.target.value)
                            }
                            placeholder="https://instagram.com/username"
                            className="pl-9"
                            autoComplete="off"
                        />
                    </div>
                    <InputError message={form.errors.social_instagram} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="social_youtube">Youtube</Label>
                    <div className="relative">
                        <Youtube className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                        <Input
                            id="social_youtube"
                            type="url"
                            value={form.data.social_youtube}
                            onChange={(e) =>
                                form.setData('social_youtube', e.target.value)
                            }
                            placeholder="https://youtube.com/@channel"
                            className="pl-9"
                            autoComplete="off"
                        />
                    </div>
                    <InputError message={form.errors.social_youtube} />
                </div>
            </div>

            <Button type="submit" disabled={form.processing}>
                Save social media
            </Button>
        </form>
    );
}

type MailFormData = {
    mail_mailer: string;
    mail_host: string;
    mail_port: string;
    mail_scheme: string;
    mail_username: string;
    mail_password: string;
    mail_from_address: string;
    mail_from_name: string;
};

function EmailSettingsForm({ platform }: { platform: PlatformSetting }) {
    const form = useForm<MailFormData>({
        mail_mailer: platform.mail_mailer ?? 'smtp',
        mail_host: platform.mail_host ?? '',
        mail_port:
            platform.mail_port !== null ? String(platform.mail_port) : '',
        mail_scheme: platform.mail_scheme ?? 'tls',
        mail_username: platform.mail_username ?? '',
        mail_password: platform.mail_password ?? '',
        mail_from_address: platform.mail_from_address ?? '',
        mail_from_name: platform.mail_from_name ?? '',
    });

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.submit(PlatformController.update());
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label>Mailer</Label>
                    <Select
                        value={form.data.mail_mailer}
                        onValueChange={(value) =>
                            form.setData('mail_mailer', value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Mailer" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="smtp">SMTP</SelectItem>
                            <SelectItem value="log">Log (development)</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={form.errors.mail_mailer} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="mail_host">SMTP host</Label>
                    <Input
                        id="mail_host"
                        value={form.data.mail_host}
                        onChange={(e) =>
                            form.setData('mail_host', e.target.value)
                        }
                        placeholder="smtp.example.com"
                        autoComplete="off"
                    />
                    <InputError message={form.errors.mail_host} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="mail_port">SMTP port</Label>
                    <Input
                        id="mail_port"
                        type="number"
                        min={1}
                        max={65535}
                        value={form.data.mail_port}
                        onChange={(e) =>
                            form.setData('mail_port', e.target.value)
                        }
                        placeholder="587"
                        autoComplete="off"
                    />
                    <InputError message={form.errors.mail_port} />
                </div>

                <div className="grid gap-2">
                    <Label>Encryption</Label>
                    <Select
                        value={form.data.mail_scheme}
                        onValueChange={(value) =>
                            form.setData('mail_scheme', value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Encryption" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="tls">TLS</SelectItem>
                            <SelectItem value="ssl">SSL</SelectItem>
                            <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                    </Select>
                    <InputError message={form.errors.mail_scheme} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="mail_username">SMTP username</Label>
                    <Input
                        id="mail_username"
                        value={form.data.mail_username}
                        onChange={(e) =>
                            form.setData('mail_username', e.target.value)
                        }
                        autoComplete="off"
                    />
                    <InputError message={form.errors.mail_username} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="mail_password">SMTP password</Label>
                    <PasswordInput
                        id="mail_password"
                        value={form.data.mail_password}
                        onChange={(e) =>
                            form.setData('mail_password', e.target.value)
                        }
                        placeholder="SMTP password"
                        autoComplete="new-password"
                    />
                    <InputError message={form.errors.mail_password} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="mail_from_address">From address</Label>
                    <Input
                        id="mail_from_address"
                        type="email"
                        value={form.data.mail_from_address}
                        onChange={(e) =>
                            form.setData('mail_from_address', e.target.value)
                        }
                        placeholder="no-reply@example.com"
                        autoComplete="off"
                    />
                    <InputError message={form.errors.mail_from_address} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="mail_from_name">From name</Label>
                    <Input
                        id="mail_from_name"
                        value={form.data.mail_from_name}
                        onChange={(e) =>
                            form.setData('mail_from_name', e.target.value)
                        }
                        placeholder="From name"
                        autoComplete="off"
                    />
                    <InputError message={form.errors.mail_from_name} />
                </div>
            </div>

            <Button type="submit" disabled={form.processing}>
                Save SMTP settings
            </Button>
        </form>
    );
}

function TestEmailForm() {
    const form = useForm<{ test_email: string }>({ test_email: '' });

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.submit(PlatformController.testEmail());
    };

    return (
        <form
            onSubmit={onSubmit}
            className="border-border rounded-lg border p-4 pt-6"
        >
            <div className="flex items-center gap-2">
                <Mail className="text-muted-foreground size-4" />
                <p className="text-sm font-medium">Send test email</p>
            </div>
            <p className="text-muted-foreground mt-1 mb-4 text-sm">
                Send a test email to verify your SMTP configuration works
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                    type="email"
                    value={form.data.test_email}
                    onChange={(e) => form.setData('test_email', e.target.value)}
                    placeholder="Recipient email"
                    className="sm:max-w-sm"
                    autoComplete="off"
                />
                <Button
                    type="submit"
                    variant="outline"
                    disabled={form.processing}
                >
                    <Send className="size-4" />
                    Send test email
                </Button>
            </div>
            <InputError message={form.errors.test_email} />
        </form>
    );
}

function LogoAvatar({ current }: { current: string | null }) {
    const [preview, setPreview] = useState<string | null>(null);

    return (
        <>
            <Label
                htmlFor="logo"
                className="relative cursor-pointer rounded-full"
            >
                <Avatar className="bg-muted ring-background h-20 w-20 overflow-hidden rounded-full ring-1 ring-neutral-200 dark:ring-neutral-700">
                    {(preview ?? current) && (
                        <AvatarImage
                            src={preview ?? current ?? undefined}
                            alt="Platform logo"
                            className="object-contain"
                        />
                    )}
                </Avatar>
                <span className="bg-foreground text-background ring-background absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full ring-2">
                    <Camera className="h-3 w-3" />
                </span>
            </Label>

            <Input
                id="logo"
                name="logo"
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                className="sr-only"
                onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                        setPreview(URL.createObjectURL(file));
                    }
                }}
            />
        </>
    );
}

function FaviconAvatar({ current }: { current: string | null }) {
    const [preview, setPreview] = useState<string | null>(null);

    return (
        <>
            <Label
                htmlFor="favicon"
                className="relative cursor-pointer rounded-full"
            >
                <Avatar className="bg-muted ring-background h-14 w-14 overflow-hidden rounded-full ring-1 ring-neutral-200 dark:ring-neutral-700">
                    {(preview ?? current) && (
                        <AvatarImage
                            src={preview ?? current ?? undefined}
                            alt="Platform favicon"
                            className="object-contain"
                        />
                    )}
                </Avatar>
                <span className="bg-foreground text-background ring-background absolute right-0 bottom-0 flex h-5 w-5 items-center justify-center rounded-full ring-2">
                    <Camera className="h-3 w-3" />
                </span>
            </Label>

            <Input
                id="favicon"
                name="favicon"
                type="file"
                accept="image/x-icon,image/vnd.microsoft.icon,image/png,image/jpeg,image/svg+xml"
                className="sr-only"
                onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                        setPreview(URL.createObjectURL(file));
                    }
                }}
            />
        </>
    );
}

PlatformSettings.layout = {
    breadcrumbs: [
        {
            title: 'Platform settings',
            href: editPlatform(),
        },
    ],
};