"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-context';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  User, Mail, Phone, MapPin, Calendar, Bell, Shield, CreditCard,
  TrendingUp, Target, Activity, Settings
} from 'lucide-react';

interface ProfileErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    joinDate: '2024-01-15',
    avatar: undefined as string | undefined,
    bio: 'Passionate investor focused on technology stocks and long-term growth strategies.'
  });

  // Sync auth state if available
  useEffect(() => {
    if (authUser) {
      setProfile(prev => ({
        ...prev,
        name: authUser.name || prev.name,
        email: authUser.email || prev.email,
        avatar: authUser.avatar || prev.avatar
      }));
    }
  }, [authUser]);

  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    marketNews: true,
    portfolioUpdates: true,
    weeklyReports: false,
    emailNotifications: true,
    pushNotifications: true
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<ProfileErrors>({});

  const stats = [
    { label: 'Stocks Tracked', value: '12', icon: TrendingUp, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Active Alerts', value: '8', icon: Bell, color: 'text-yellow-600 dark:text-yellow-400' },
    { label: 'Predictions Made', value: '45', icon: Target, color: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Days Active', value: '89', icon: Activity, color: 'text-purple-600 dark:text-purple-400' }
  ];

  const validate = (): boolean => {
    const tempErrors: ProfileErrors = {};
    if (!profile.name.trim()) {
      tempErrors.name = 'Full name is required.';
    }
    if (!profile.email.trim()) {
      tempErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }
    if (profile.phone && !/^\+?[0-9\s\-()]{7,20}$/.test(profile.phone)) {
      tempErrors.phone = 'Please enter a valid phone number.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validate()) {
      toast.error('Please correct the validation errors first.');
      return;
    }

    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success('Notification preference updated.');
  };

  const handleAvatarChange = () => {
    toast.info('Avatar upload functionality will be configured in production.');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-xl">
            <User className="w-6 h-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          </div>
          Profile Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Manage your account settings and preferences
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <aside className="lg:col-span-1" aria-label="Profile Card">
          <Card>
            <CardHeader className="text-center pb-4">
              <div className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer" onClick={handleAvatarChange}>
                <Avatar className="w-24 h-24 ring-4 ring-slate-100 dark:ring-slate-800">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-white font-semibold">Change</span>
                </div>
              </div>
              <CardTitle className="text-xl">{profile.name}</CardTitle>
              <CardDescription>{profile.email}</CardDescription>
              <div className="mt-2.5">
                <Badge variant="secondary" className="px-3 py-0.5 text-xs font-semibold">
                  Premium Member
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4 mr-2.5 text-slate-400" aria-hidden="true" />
                  {profile.location}
                </div>
                <div className="flex items-center text-slate-600 dark:text-slate-400">
                  <Calendar className="w-4 h-4 mr-2.5 text-slate-400" aria-hidden="true" />
                  Joined {new Date(profile.joinDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </div>
              </div>
              
              <Separator />
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                      <Icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} aria-hidden="true" />
                      <div className="text-lg font-bold text-slate-900 dark:text-slate-50">{stat.value}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-300 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Settings Tabs */}
        <main className="lg:col-span-2" aria-label="Settings Tabs">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 rounded-xl p-1 bg-slate-100 dark:bg-slate-800">
              <TabsTrigger value="personal" className="rounded-lg text-xs sm:text-sm">Personal</TabsTrigger>
              <TabsTrigger value="notifications" className="rounded-lg text-xs sm:text-sm">Notifications</TabsTrigger>
              <TabsTrigger value="security" className="rounded-lg text-xs sm:text-sm">Security</TabsTrigger>
              <TabsTrigger value="billing" className="rounded-lg text-xs sm:text-sm">Billing</TabsTrigger>
            </TabsList>

            {/* Personal Information */}
            <TabsContent value="personal" className="outline-none">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                    <CardDescription className="text-xs">
                      Update your profile information and contact details
                    </CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                    disabled={isSaving}
                    size="sm"
                    className="h-8 px-4"
                  >
                    {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" aria-hidden="true" />
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => {
                            setProfile(prev => ({ ...prev, name: e.target.value }));
                            setErrors(prev => ({ ...prev, name: undefined }));
                          }}
                          className={cn("pl-9 rounded-xl", errors.name && "border-red-500 focus-visible:ring-red-500")}
                          disabled={!isEditing}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "name-error" : undefined}
                        />
                      </div>
                      {errors.name && <p id="name-error" className="text-xs text-red-500 dark:text-red-400 mt-1" role="alert">{errors.name}</p>}
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" aria-hidden="true" />
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => {
                            setProfile(prev => ({ ...prev, email: e.target.value }));
                            setErrors(prev => ({ ...prev, email: undefined }));
                          }}
                          className={cn("pl-9 rounded-xl", errors.email && "border-red-500 focus-visible:ring-red-500")}
                          disabled={!isEditing}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "email-error" : undefined}
                        />
                      </div>
                      {errors.email && <p id="email-error" className="text-xs text-red-500 dark:text-red-400 mt-1" role="alert">{errors.email}</p>}
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" aria-hidden="true" />
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => {
                            setProfile(prev => ({ ...prev, phone: e.target.value }));
                            setErrors(prev => ({ ...prev, phone: undefined }));
                          }}
                          className={cn("pl-9 rounded-xl", errors.phone && "border-red-500 focus-visible:ring-red-500")}
                          disabled={!isEditing}
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? "phone-error" : undefined}
                        />
                      </div>
                      {errors.phone && <p id="phone-error" className="text-xs text-red-500 dark:text-red-400 mt-1" role="alert">{errors.phone}</p>}
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" aria-hidden="true" />
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                          className="pl-9 rounded-xl"
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      className="w-full p-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm leading-relaxed"
                      rows={3}
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Tell us about your investment style..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="outline-none">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notification Preferences</CardTitle>
                  <CardDescription className="text-xs">
                    Choose what notifications you want to receive and where
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="priceAlerts" className="text-sm font-semibold">
                          Price Alerts
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Get notified when stocks reach your target prices
                        </p>
                      </div>
                      <Switch
                        id="priceAlerts"
                        checked={notifications.priceAlerts}
                        onCheckedChange={(checked) => handleNotificationChange('priceAlerts', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="marketNews" className="text-sm font-semibold">
                          Market News
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Receive important market news and technical updates
                        </p>
                      </div>
                      <Switch
                        id="marketNews"
                        checked={notifications.marketNews}
                        onCheckedChange={(checked) => handleNotificationChange('marketNews', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="portfolioUpdates" className="text-sm font-semibold">
                          Portfolio Updates
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Daily summaries of your portfolio performance
                        </p>
                      </div>
                      <Switch
                        id="portfolioUpdates"
                        checked={notifications.portfolioUpdates}
                        onCheckedChange={(checked) => handleNotificationChange('portfolioUpdates', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="weeklyReports" className="text-sm font-semibold">
                          Weekly Reports
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Comprehensive weekly market forecasts
                        </p>
                      </div>
                      <Switch
                        id="weeklyReports"
                        checked={notifications.weeklyReports}
                        onCheckedChange={(checked) => handleNotificationChange('weeklyReports', checked)}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Delivery Channels</h4>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifications" className="text-sm font-semibold">
                          Email Notifications
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Receive alerts via your primary email address
                        </p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pushNotifications" className="text-sm font-semibold">
                          Push Notifications
                        </Label>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Receive live push alerts in your browser
                        </p>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security" className="outline-none">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Security Settings</CardTitle>
                  <CardDescription className="text-xs">
                    Manage your account security and authorization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold">Password</Label>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                        Last changed 30 days ago
                      </p>
                      <Button variant="outline" size="sm">Change Password</Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="text-sm font-semibold">Two-Factor Authentication</Label>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                        Add an extra layer of security to prevent unauthorized access
                      </p>
                      <Button variant="outline" size="sm">Enable 2FA</Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <Label className="text-sm font-semibold">Active Sessions</Label>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                        Monitor active browser sessions and connected devices
                      </p>
                      <Button variant="outline" size="sm">View Sessions</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing */}
            <TabsContent value="billing" className="outline-none">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Billing & Subscription</CardTitle>
                  <CardDescription className="text-xs">
                    Manage your subscription plans and billing details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                          Premium Plan
                        </h4>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-0.5">
                          $29.99/month • Next renewal: March 15, 2024
                        </p>
                      </div>
                      <Badge className="bg-blue-600 text-white">Active</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-semibold">Payment Method</Label>
                      <div className="flex items-center justify-between p-3.5 border rounded-xl mt-2 bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex items-center">
                          <CreditCard className="w-5 h-5 mr-3 text-slate-400" aria-hidden="true" />
                          <div>
                            <p className="font-medium text-sm">•••• •••• •••• 4242</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Expires 12/26
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Update</Button>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Billing History</Button>
                      <Button variant="outline" size="sm">Download Invoices</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}