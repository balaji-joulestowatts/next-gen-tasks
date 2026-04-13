import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

type ProfileData = {
  displayName: string;
  bio: string;
  avatar: string | null;
  emailNotifications: boolean;
  darkMode: boolean;
};

const STORAGE_KEY = "app.profile";

function loadProfile(): ProfileData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        displayName: parsed.displayName || "",
        bio: parsed.bio || "",
        avatar: parsed.avatar || null,
        emailNotifications: Boolean(parsed.emailNotifications),
        darkMode: Boolean(parsed.darkMode),
      };
    }
  } catch (_) {}
  return {
    displayName: "",
    bio: "",
    avatar: null,
    emailNotifications: false,
    darkMode: false,
  };
}

function saveProfile(data: ProfileData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (_) {}
}

export default function Profile() {
  const [profile, setProfile] = React.useState<ProfileData>(() => loadProfile());
  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (profile.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [profile.darkMode]);

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((p) => ({ ...p, avatar: typeof reader.result === "string" ? reader.result : null }));
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setProfile((p) => ({ ...p, avatar: null }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    saveProfile(profile);
    setTimeout(() => {
      setSaving(false);
      setSavedAt(Date.now());
    }, 300);
  };

  const initials = React.useMemo(() => {
    const parts = profile.displayName.trim().split(" ");
    const first = parts[0]?.[0] || "U";
    const second = parts[1]?.[0] || "";
    return (first + second).toUpperCase();
  }, [profile.displayName]);

  return (
    <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
      <h1 className="mb-4 text-2xl font-semibold">User Profile</h1>
      <p className="mb-6 text-sm text-muted-foreground">Manage your personal information, avatar, and preferences.</p>

      <form onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your avatar and basic information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="flex flex-col items-center gap-3">
                <Avatar className="h-20 w-20">
                  {profile.avatar ? (
                    <AvatarImage alt="User avatar" src={profile.avatar} />
                  ) : (
                    <AvatarFallback>{initials}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex items-center gap-2">
                  <div>
                    <Label htmlFor="avatar" className="sr-only">
                      Upload Avatar
                    </Label>
                    <Input id="avatar" type="file" accept="image/*" onChange={onAvatarChange} />
                  </div>
                  <Button type="button" variant="outline" onClick={removeAvatar} disabled={!profile.avatar}>
                    Remove
                  </Button>
                </div>
              </div>

              <div className="grid w-full gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    placeholder="Your name"
                    value={profile.displayName}
                    onChange={(e) => setProfile((p) => ({ ...p, displayName: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    value={profile.bio}
                    onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize how you receive updates and view the app.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Use a darker color theme.</p>
              </div>
              <Switch
                checked={profile.darkMode}
                onCheckedChange={(v) => setProfile((p) => ({ ...p, darkMode: v }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified about important activity.</p>
              </div>
              <Switch
                checked={profile.emailNotifications}
                onCheckedChange={(v) => setProfile((p) => ({ ...p, emailNotifications: v }))}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Preferences"}</Button>
          </CardFooter>
        </Card>

        {savedAt ? (
          <p className="text-center text-sm text-muted-foreground">Saved at {new Date(savedAt).toLocaleTimeString()}</p>
        ) : null}
      </form>
    </div>
  );
}
