import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import Input from "@/components/ui/Input";
import { Globe, Mail, MapPin, MessageCircle, Phone, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

interface SettingsData {
  companyInfo: {
    name: string;
    tagline: string;
    email: string;
    phone: string;
    address: string;
  };
  socialLinks: {
    instagram: string;
    linkedin: string;
    youtube: string;
    whatsapp: string;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    logo: string;
    favicon: string;
  };
}

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    companyInfo: {
      name: "ASCEND",
      tagline: "Building Businesses. Scaling Brands.",
      email: "",
      phone: "",
      address: "Lagos, Nigeria",
    },
    socialLinks: {
      instagram: "",
      linkedin: "",
      youtube: "",
      whatsapp: "",
    },
    branding: {
      primaryColor: "#0F4C4C",
      secondaryColor: "#1A6B6B",
      logo: "",
      favicon: "",
    },
  });

  useEffect(() => {
    // Fetch settings from API
    const fetchSettings = async () => {
      try {
        // Replace with actual API call
        // const response = await settingsAPI.getAll();
        // setSettings(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching settings:", error);
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Replace with actual API call
      // await settingsAPI.update(settings);
      console.log("Settings saved:", settings);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500">Manage your website configuration</p>
        </div>
        <Button variant="primary" onClick={handleSave} aria-disabled={saving}>
          <Save size={18} className="mr-2" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Branding */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                value={settings.companyInfo.name}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    companyInfo: {
                      ...settings.companyInfo,
                      name: e.target.value,
                    },
                  })
                }
                placeholder="Company name"
                leftIcon={<Globe size={18} />}
              />
              <Input
                label="Tagline"
                value={settings.companyInfo.tagline}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    companyInfo: {
                      ...settings.companyInfo,
                      tagline: e.target.value,
                    },
                  })
                }
                placeholder="Your tagline"
              />
              <Input
                label="Email"
                type="email"
                value={settings.companyInfo.email}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    companyInfo: {
                      ...settings.companyInfo,
                      email: e.target.value,
                    },
                  })
                }
                placeholder="contact@yourcompany.com"
                leftIcon={<Mail size={18} />}
              />
              <Input
                label="Phone"
                value={settings.companyInfo.phone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    companyInfo: {
                      ...settings.companyInfo,
                      phone: e.target.value,
                    },
                  })
                }
                placeholder="+234 123 456 7890"
                leftIcon={<Phone size={18} />}
              />
              <div className="md:col-span-2">
                <Input
                  label="Address"
                  value={settings.companyInfo.address}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      companyInfo: {
                        ...settings.companyInfo,
                        address: e.target.value,
                      },
                    })
                  }
                  placeholder="Business address"
                  leftIcon={<MapPin size={18} />}
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Instagram"
                value={settings.socialLinks.instagram}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: {
                      ...settings.socialLinks,
                      instagram: e.target.value,
                    },
                  })
                }
                placeholder="https://instagram.com/yourprofile"
                leftIcon={<FaInstagram size={18} />}
              />
              <Input
                label="LinkedIn"
                value={settings.socialLinks.linkedin}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: {
                      ...settings.socialLinks,
                      linkedin: e.target.value,
                    },
                  })
                }
                placeholder="https://linkedin.com/company/yourcompany"
                leftIcon={<FaLinkedin size={18} />}
              />
              <Input
                label="YouTube"
                value={settings.socialLinks.youtube}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: {
                      ...settings.socialLinks,
                      youtube: e.target.value,
                    },
                  })
                }
                placeholder="https://youtube.com/@yourchannel"
                leftIcon={<FaYoutube size={18} />}
              />

              <Input
                label="WhatsApp"
                value={settings.socialLinks.whatsapp}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    socialLinks: {
                      ...settings.socialLinks,
                      whatsapp: e.target.value,
                    },
                  })
                }
                placeholder="https://wa.me/1234567890"
                leftIcon={<MessageCircle size={18} />}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Branding */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Branding</h3>

            <div className="space-y-4">
              <ImageUpload
                label="Logo"
                value={settings.branding.logo}
                onChange={(url) =>
                  setSettings({
                    ...settings,
                    branding: { ...settings.branding, logo: url },
                  })
                }
              />

              <ImageUpload
                label="Favicon"
                value={settings.branding.favicon}
                onChange={(url) =>
                  setSettings({
                    ...settings,
                    branding: { ...settings.branding, favicon: url },
                  })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.branding.primaryColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          branding: {
                            ...settings.branding,
                            primaryColor: e.target.value,
                          },
                        })
                      }
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <Input
                      value={settings.branding.primaryColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          branding: {
                            ...settings.branding,
                            primaryColor: e.target.value,
                          },
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.branding.secondaryColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          branding: {
                            ...settings.branding,
                            secondaryColor: e.target.value,
                          },
                        })
                      }
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <Input
                      value={settings.branding.secondaryColor}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          branding: {
                            ...settings.branding,
                            secondaryColor: e.target.value,
                          },
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 rounded-xl p-6 border border-brand-primary/10">
            <h4 className="font-semibold mb-3">Preview</h4>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                {settings.branding.logo ? (
                  <img
                    src={settings.branding.logo}
                    alt="Logo"
                    className="h-8 w-auto"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-brand-primary flex items-center justify-center text-white font-bold text-sm">
                    A
                  </div>
                )}
                <div>
                  <p
                    className="font-bold text-sm"
                    style={{ color: settings.branding.primaryColor }}
                  >
                    {settings.companyInfo.name || "ASCEND"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {settings.companyInfo.tagline ||
                      "Building Businesses. Scaling Brands."}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              This is how your brand appears on the website
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
