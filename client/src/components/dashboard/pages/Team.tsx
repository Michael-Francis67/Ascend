import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Modal from "@/components/ui/Modal";
import SearchInput from "@/components/ui/SearchInput";
import Toast from "@/components/ui/Toast";
import { teamAPI } from "@/lib/api/index";
import {
  CheckCircle,
  Copy,
  Edit,
  Eye,
  EyeOff,
  Plus,
  RefreshCw,
  Trash2,
  User,
  Users,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  quote: string;
  image: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
}

const Team: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await teamAPI.getAll();
      setMembers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
      showNotification("Failed to load team members", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await teamAPI.toggleActive(id);
      setMembers((prev) =>
        prev.map((member) =>
          member.id === id ? { ...member, isActive: !currentStatus } : member,
        ),
      );
      showNotification(
        `Team member ${!currentStatus ? "activated" : "deactivated"} successfully`,
        "success",
      );
    } catch (error) {
      console.error("Error toggling member status:", error);
      showNotification("Failed to toggle member status", "error");
    }
  };

  const handleDelete = async () => {
    if (!selectedMember) return;

    try {
      await teamAPI.delete(selectedMember.id);
      setMembers((prev) =>
        prev.filter((member) => member.id !== selectedMember.id),
      );
      showNotification("Team member deleted successfully", "success");
      setShowDeleteModal(false);
      setSelectedMember(null);
    } catch (error) {
      console.error("Error deleting team member:", error);
      showNotification("Failed to delete team member", "error");
    }
  };

  const handleDuplicate = async (member: TeamMember) => {
    try {
      const newMember = {
        name: `${member.name} (Copy)`,
        role: member.role,
        specialties: member.specialties,
        quote: member.quote,
        image: member.image,
        isActive: false,
        order: members.length,
      };

      await teamAPI.create(newMember);
      await fetchMembers();
      showNotification("Team member duplicated successfully", "success");
    } catch (error) {
      console.error("Error duplicating team member:", error);
      showNotification("Failed to duplicate team member", "error");
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.specialties.some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && member.isActive) ||
      (filterActive === "inactive" && !member.isActive);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <Toast
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        </div>
      )}

      {/* ============ HEADER WITH ACTION BUTTONS ============ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Team Members</h1>
          <p className="text-gray-500">
            Manage your team
            <span className="ml-2 text-sm font-medium text-brand-primary">
              ({filteredMembers.length} members)
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchMembers}
            className="flex items-center gap-2"
            size="sm"
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate("/dashboard/team/new")}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Add Team Member
          </Button>
        </div>
      </div>

      {/* ============ FILTERS AND SEARCH ============ */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchInput
            placeholder="Search members by name, role, or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={(value) => setSearchTerm(value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterActive("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterActive === "all"
                ? "bg-brand-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterActive("active")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterActive === "active"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterActive("inactive")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterActive === "inactive"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* ============ TEAM MEMBERS GRID ============ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Profile */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User size={24} className="text-brand-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-charcoal">
                        {member.name}
                      </h3>
                      <p className="text-sm text-brand-primary">
                        {member.role}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleToggleActive(member.id, member.isActive)
                      }
                      className={`p-1.5 rounded-lg transition-colors ${
                        member.isActive
                          ? "text-green-600 hover:bg-green-50"
                          : "text-gray-400 hover:bg-gray-50"
                      }`}
                      title={member.isActive ? "Deactivate" : "Activate"}
                    >
                      {member.isActive ? (
                        <Eye size={16} />
                      ) : (
                        <EyeOff size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-1 mb-3">
                {member.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              {/* Quote */}
              {member.quote && (
                <p className="text-sm text-gray-600 italic line-clamp-2 mb-3">
                  "{member.quote}"
                </p>
              )}

              {/* ============ ACTION BUTTONS ============ */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => navigate(`/dashboard/team/${member.id}/edit`)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit size={16} className="inline mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDuplicate(member)}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Copy size={16} className="inline mr-1" />
                  Copy
                </button>
                <button
                  onClick={() => {
                    setSelectedMember(member);
                    setShowDeleteModal(true);
                  }}
                  className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Status Badge */}
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    member.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {member.isActive ? (
                    <CheckCircle size={12} />
                  ) : (
                    <XCircle size={12} />
                  )}
                  {member.isActive ? "Active" : "Inactive"}
                </span>
                <span className="text-xs text-gray-400">
                  Order: {member.order}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ============ EMPTY STATE ============ */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          {searchTerm || filterActive !== "all" ? (
            <div>
              <p className="text-gray-500">
                No team members match your filters
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterActive("all");
                }}
                className="text-brand-primary hover:underline mt-2 inline-block"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-12 border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={40} className="text-brand-primary" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">
                No Team Members Yet
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Build your team page by adding members and their roles.
              </p>
              <Button
                variant="primary"
                onClick={() => navigate("/dashboard/team/new")}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus size={18} />
                Add First Team Member
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ============ DELETE CONFIRMATION MODAL ============ */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Team Member"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete{" "}
            <strong>{selectedMember?.name}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Member
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Team;
