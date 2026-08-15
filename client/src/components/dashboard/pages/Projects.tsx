import Button from "@/components/ui/Button";
import SearchInput from "@/components/ui/SearchInput";
import { projectsAPI } from "@/lib/api/index";
import { Calendar, Edit, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  client: string;
  isActive: boolean;
  createdAt: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await projectsAPI.delete(id);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await projectsAPI.update(id, { isActive: !currentStatus });
      fetchProjects();
    } catch (error) {
      console.error("Error toggling project status:", error);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || project.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...new Set(projects.map((p) => p.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-gray-500">Manage your portfolio projects</p>
        </div>
        <Link to="/dashboard/projects/new">
          <Button variant="primary">
            <Plus size={18} className="mr-2" />
            Add Project
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchInput
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filterCategory === category
                  ? "bg-brand-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-video bg-gray-100 relative">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                <button
                  onClick={() =>
                    handleToggleActive(project.id, project.isActive)
                  }
                  className={`p-1.5 rounded-lg ${
                    project.isActive
                      ? "bg-green-100 text-green-600 hover:bg-green-200"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  }`}
                >
                  {project.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-charcoal truncate">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500">{project.client}</p>
                </div>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600 whitespace-nowrap">
                  {project.category}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <Link
                  to={`/dashboard/projects/${project.id}/edit`}
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 border-red-200"
                  onClick={() => handleDelete(project.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No projects found</p>
          <Link
            to="/dashboard/projects/new"
            className="text-brand-primary hover:underline mt-2 inline-block"
          >
            Create your first project
          </Link>
        </div>
      )}
    </div>
  );
};

export default Projects;
