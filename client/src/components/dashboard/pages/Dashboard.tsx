import {
  projectsAPI,
  sectionsAPI,
  servicesAPI,
  testimonialsAPI,
} from "@/lib/api/index";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  Award,
  Briefcase,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Plus,
  RefreshCw,
  Settings,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";

// ============ TYPE DEFINITIONS ============
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  trend?: number;
  subtitle?: string;
}

interface ActivityItem {
  id: string;
  type: "section" | "project" | "service" | "testimonial" | "team";
  action: "created" | "updated" | "deleted" | "published";
  title: string;
  timestamp: string;
  user: string;
}

// ============ STAT CARD COMPONENT ============
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  subtitle,
}) => {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold mt-1 text-charcoal">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend !== undefined && (
            <div className="flex items-center mt-2">
              <div
                className={`flex items-center text-xs font-medium ${isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-gray-400"}`}
              >
                {isPositive && <ArrowUp size={14} className="mr-0.5" />}
                {isNegative && <ArrowDown size={14} className="mr-0.5" />}
                {Math.abs(trend)}%
                <span className="text-gray-400 ml-1">vs last month</span>
              </div>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};

// ============ ACTIVITY ITEM COMPONENT ============
const ActivityItem: React.FC<{ item: ActivityItem }> = ({ item }) => {
  const getIcon = () => {
    switch (item.type) {
      case "section":
        return <FileText size={16} className="text-blue-500" />;
      case "project":
        return <Briefcase size={16} className="text-purple-500" />;
      case "service":
        return <Star size={16} className="text-yellow-500" />;
      case "testimonial":
        return <Users size={16} className="text-green-500" />;
      case "team":
        return <Users size={16} className="text-pink-500" />;
      default:
        return <Activity size={16} className="text-gray-500" />;
    }
  };

  const getActionColor = () => {
    switch (item.action) {
      case "created":
        return "text-green-600";
      case "updated":
        return "text-blue-600";
      case "deleted":
        return "text-red-600";
      case "published":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const getActionText = () => {
    switch (item.action) {
      case "created":
        return "Created";
      case "updated":
        return "Updated";
      case "deleted":
        return "Deleted";
      case "published":
        return "Published";
      default:
        return "Modified";
    }
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${getActionColor()}`}>
            {getActionText()}
          </span>
          <span className="text-sm font-medium text-charcoal truncate">
            {item.title}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-gray-400">{item.user}</span>
          <span className="text-xs text-gray-300">•</span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={12} />
            {item.timestamp}
          </span>
        </div>
      </div>
    </div>
  );
};

// ============ MAIN DASHBOARD COMPONENT ============
const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    sections: 0,
    projects: 0,
    services: 0,
    testimonials: 0,
    team: 0,
  });
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [quickStats, setQuickStats] = useState({
    totalViews: 0,
    engagement: 0,
    growth: 0,
    completion: 0,
  });

  // Mock data for demonstration - In production, fetch from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch real data
        const [sections, projects, services, testimonials] = await Promise.all([
          sectionsAPI.getAll(),
          projectsAPI.getAll(),
          servicesAPI.getAll(),
          testimonialsAPI.getAll(),
        ]);

        setStats({
          sections: sections.data.data?.length || 0,
          projects: projects.data.data?.length || 0,
          services: services.data.data?.length || 0,
          testimonials: testimonials.data.data?.length || 0,
          team: 0, // Fetch team count
        });

        // Mock recent activities (replace with real data)
        setRecentActivities([
          {
            id: "1",
            type: "section",
            action: "updated",
            title: "Hero Section",
            timestamp: "2 hours ago",
            user: "Admin",
          },
          {
            id: "2",
            type: "project",
            action: "created",
            title: "Brand Transformation Project",
            timestamp: "5 hours ago",
            user: "Admin",
          },
          {
            id: "3",
            type: "testimonial",
            action: "published",
            title: "Adelois Consulting Testimonial",
            timestamp: "1 day ago",
            user: "Admin",
          },
          {
            id: "4",
            type: "service",
            action: "updated",
            title: "Content Strategy Service",
            timestamp: "2 days ago",
            user: "Admin",
          },
          {
            id: "5",
            type: "team",
            action: "created",
            title: "Mary-Ann - CEO & Co-Founder",
            timestamp: "3 days ago",
            user: "Admin",
          },
        ]);

        // Mock quick stats
        setQuickStats({
          totalViews: 1247,
          engagement: 89,
          growth: 23,
          completion: 76,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-primary border-t-transparent"></div>
        <p className="mt-4 text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ============ HEADER ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-charcoal">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's what's happening with your website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Filter size={18} />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* ============ STATS GRID ============ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sections"
          value={stats.sections}
          icon={FileText}
          color="bg-blue-500"
          trend={12}
        />
        <StatCard
          title="Projects"
          value={stats.projects}
          icon={Briefcase}
          color="bg-purple-500"
          trend={8}
        />
        <StatCard
          title="Services"
          value={stats.services}
          icon={Star}
          color="bg-yellow-500"
          trend={-3}
        />
        <StatCard
          title="Testimonials"
          value={stats.testimonials}
          icon={Users}
          color="bg-green-500"
          trend={5}
        />
      </div>

      {/* ============ QUICK STATS ============ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 p-4 rounded-xl border border-brand-primary/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary/10 rounded-lg">
              <Eye size={20} className="text-brand-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{quickStats.totalViews}</p>
              <p className="text-xs text-gray-500">Total Views</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 p-4 rounded-xl border border-blue-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{quickStats.engagement}%</p>
              <p className="text-xs text-gray-500">Engagement Rate</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500/5 to-green-600/5 p-4 rounded-xl border border-green-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Zap size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">+{quickStats.growth}%</p>
              <p className="text-xs text-gray-500">Growth Rate</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/5 to-purple-600/5 p-4 rounded-xl border border-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Award size={20} className="text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{quickStats.completion}%</p>
              <p className="text-xs text-gray-500">Profile Complete</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ MAIN CONTENT GRID ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ============ RECENT ACTIVITY ============ */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-charcoal">Recent Activity</h3>
              <p className="text-xs text-gray-500">
                Latest changes to your website
              </p>
            </div>
            <button className="text-sm text-brand-primary hover:underline flex items-center gap-1">
              View All
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-1">
            {recentActivities.map((item) => (
              <ActivityItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* ============ QUICK ACTIONS ============ */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="mb-4">
            <h3 className="font-semibold text-charcoal">Quick Actions</h3>
            <p className="text-xs text-gray-500">
              Common tasks to manage your site
            </p>
          </div>
          <div className="space-y-2">
            <Link
              to="/dashboard/sections/new"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Plus size={18} className="text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Add New Section</p>
                <p className="text-xs text-gray-400">
                  Create a new website section
                </p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </Link>

            <Link
              to="/dashboard/projects/new"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                <Plus size={18} className="text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Add New Project</p>
                <p className="text-xs text-gray-400">Showcase your work</p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </Link>

            <Link
              to="/dashboard/services/new"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="p-2 bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-colors">
                <Plus size={18} className="text-yellow-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Add New Service</p>
                <p className="text-xs text-gray-400">List your services</p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </Link>

            <Link
              to="/dashboard/testimonials/new"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                <Plus size={18} className="text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Add Testimonial</p>
                <p className="text-xs text-gray-400">Add client feedback</p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </Link>

            <Link
              to="/dashboard/team/new"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="p-2 bg-pink-50 rounded-lg group-hover:bg-pink-100 transition-colors">
                <Plus size={18} className="text-pink-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Add Team Member</p>
                <p className="text-xs text-gray-400">Build your team page</p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </Link>

            <Link
              to="/dashboard/settings"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <Settings size={18} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Site Settings</p>
                <p className="text-xs text-gray-400">Configure your website</p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* ============ STATUS OVERVIEW ============ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Website Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-charcoal">Website Status</h3>
              <p className="text-xs text-gray-500">
                Current health of your site
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-green-600">Live</span>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Published Sections</span>
                <span className="font-medium">
                  {Math.floor(stats.sections * 0.8)}/{stats.sections}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "80%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Active Projects</span>
                <span className="font-medium">
                  {Math.floor(stats.projects * 0.9)}/{stats.projects}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "90%" }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Active Services</span>
                <span className="font-medium">
                  {Math.floor(stats.services * 0.7)}/{stats.services}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: "70%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 rounded-xl p-6 border border-brand-primary/10">
          <h3 className="font-semibold text-charcoal mb-4">
            Tips for Better Results
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white/80 p-3 rounded-lg">
              <div className="p-1.5 bg-brand-primary/10 rounded-full mt-0.5">
                <CheckCircle size={14} className="text-brand-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Update Hero Section</p>
                <p className="text-xs text-gray-500">
                  Fresh content improves engagement
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/80 p-3 rounded-lg">
              <div className="p-1.5 bg-yellow-500/10 rounded-full mt-0.5">
                <Star size={14} className="text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Add New Testimonial</p>
                <p className="text-xs text-gray-500">
                  Social proof builds trust
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/80 p-3 rounded-lg">
              <div className="p-1.5 bg-blue-500/10 rounded-full mt-0.5">
                <Briefcase size={14} className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Showcase Recent Work</p>
                <p className="text-xs text-gray-500">Add your latest project</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
