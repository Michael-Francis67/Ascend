import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import Input from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Modal from "@/components/ui/Modal";
import SearchInput from "@/components/ui/SearchInput";
import Toast from "@/components/ui/Toast";
import { sectionsAPI } from "@/lib/api/index";
import {
  Building2,
  CheckCircle,
  Edit,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Plus,
  RefreshCw,
  Star,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface Client {
  id: string;
  name: string;
  type: string;
  logo: string;
  link: string;
  isActive: boolean;
  featured: boolean;
  isProfile: boolean;
}

const TrustedBy: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchTrustedBySection();
  }, []);

  const fetchTrustedBySection = async () => {
    setLoading(true);
    try {
      // Try to find the trusted-by section
      const response = await sectionsAPI.getByKey("trusted-by");
      const section = response.data.data;
      setSectionId(section.id);
      setClients(section.content?.clients || []);
    } catch (error) {
      // Section doesn't exist, create it
      try {
        const newSection = await sectionsAPI.create({
          key: "trusted-by",
          title: "Trusted By Section",
          content: {
            title: "Brands We've Worked With",
            description:
              "We've partnered with ambitious businesses and industry leaders...",
            clients: [],
          },
          isActive: true,
          order: 2,
        });
        setSectionId(newSection.data.data.id);
        setClients([]);
      } catch (createError) {
        console.error("Error creating trusted-by section:", createError);
        showNotification("Failed to load Trusted By section", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const saveClients = async (updatedClients: Client[]) => {
    if (!sectionId) return;

    try {
      // Get current section data
      const response = await sectionsAPI.getById(sectionId);
      const section = response.data.data;

      // Update only the clients
      await sectionsAPI.update(sectionId, {
        content: {
          ...section.content,
          clients: updatedClients,
        },
      });

      setClients(updatedClients);
      showNotification("Clients saved successfully", "success");
    } catch (error) {
      console.error("Error saving clients:", error);
      showNotification("Failed to save clients", "error");
    }
  };

  const handleAddClient = (client: Client) => {
    const newClient = {
      ...client,
      id: `client-${Date.now()}`,
    };
    const updatedClients = [...clients, newClient];
    saveClients(updatedClients);
    setShowAddModal(false);
  };

  const handleEditClient = (client: Client) => {
    const updatedClients = clients.map((c) =>
      c.id === client.id ? client : c,
    );
    saveClients(updatedClients);
    setEditingClient(null);
  };

  const handleDeleteClient = async () => {
    if (!selectedClient) return;

    const updatedClients = clients.filter((c) => c.id !== selectedClient.id);
    await saveClients(updatedClients);
    setShowDeleteModal(false);
    setSelectedClient(null);
  };

  const handleToggleActive = (client: Client) => {
    const updatedClient = { ...client, isActive: !client.isActive };
    const updatedClients = clients.map((c) =>
      c.id === client.id ? updatedClient : c,
    );
    saveClients(updatedClients);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Trusted By - Clients</h1>
          <p className="text-gray-500">
            Manage clients that trust your brand
            <span className="ml-2 text-sm font-medium text-brand-primary">
              ({clients.length} clients)
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={fetchTrustedBySection}
            className="flex items-center gap-2"
            size="sm"
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setEditingClient(null);
              setShowAddModal(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Add Client
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchInput
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSearch={(value) => setSearchTerm(value)}
        />
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Client Logo */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {client.logo ? (
                    <img
                      src={client.logo}
                      alt={client.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 size={24} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-charcoal">
                        {client.name}
                      </h3>
                      <p className="text-sm text-gray-500">{client.type}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedClient(client);
                        setShowDeleteModal(true);
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div className="space-y-2">
                {client.link && (
                  <a
                    href={client.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-primary hover:underline flex items-center gap-1"
                  >
                    <LinkIcon size={12} />
                    {client.link}
                  </a>
                )}
                <div className="flex flex-wrap gap-2">
                  {client.featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                      <Star size={12} />
                      Featured
                    </span>
                  )}
                  {client.isProfile && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
                      <User size={12} />
                      Profile
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setEditingClient(client);
                    setShowAddModal(true);
                  }}
                  className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit size={16} className="inline mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(client)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    client.isActive !== false
                      ? "text-green-600 hover:bg-green-50"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {client.isActive !== false ? (
                    <Eye size={16} />
                  ) : (
                    <EyeOff size={16} />
                  )}
                </button>
              </div>

              {/* Status */}
              <div className="mt-3">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    client.isActive !== false
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {client.isActive !== false ? (
                    <CheckCircle size={12} />
                  ) : (
                    <XCircle size={12} />
                  )}
                  {client.isActive !== false ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          {searchTerm ? (
            <div>
              <p className="text-gray-500">No clients match your search</p>
              <button
                onClick={() => setSearchTerm("")}
                className="text-brand-primary hover:underline mt-2 inline-block"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-12 border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 size={40} className="text-brand-primary" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">
                No Clients Added
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Start adding clients that trust your brand to build social
                proof.
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  setEditingClient(null);
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus size={18} />
                Add First Client
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={editingClient ? "Edit Client" : "Add New Client"}
      >
        <ClientForm
          client={editingClient}
          onSave={(client) => {
            if (editingClient) {
              handleEditClient(client);
            } else {
              handleAddClient(client);
            }
            setShowAddModal(false);
          }}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Remove Client"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to remove{" "}
            <strong>{selectedClient?.name}</strong> from the Trusted By section?
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteClient}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove Client
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Client Form Component
const ClientForm: React.FC<{
  client?: Client | null;
  onSave: (client: Client) => void;
  onCancel: () => void;
}> = ({ client, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Client>>({
    name: "",
    type: "",
    logo: "",
    link: "",
    featured: false,
    isProfile: false,
    isActive: true,
    ...client,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Client name is required");
      return;
    }
    onSave(formData as Client);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Client Name *"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="e.g., Adelois Consulting"
        required
      />
      <Input
        label="Client Type"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        placeholder="e.g., Business Consulting"
      />
      <ImageUpload
        label="Logo / Image"
        value={formData.logo}
        onChange={(url) => setFormData({ ...formData, logo: url })}
      />
      <Input
        label="Website Link (Optional)"
        value={formData.link}
        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
        placeholder="https://example.com"
        leftIcon={<LinkIcon size={16} />}
      />
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) =>
              setFormData({ ...formData, featured: e.target.checked })
            }
            className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
          />
          <span className="text-sm text-gray-700">Featured Client</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isProfile}
            onChange={(e) =>
              setFormData({ ...formData, isProfile: e.target.checked })
            }
            className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
          />
          <span className="text-sm text-gray-700">Show as Profile Card</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isActive !== false}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.checked })
            }
            className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
          />
          <span className="text-sm text-gray-700">Active</span>
        </label>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        {/* @ts-ignore */}
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        {/* @ts-ignore */}
        <Button variant="primary" type="submit">
          {client ? "Update Client" : "Add Client"}
        </Button>
      </div>
    </form>
  );
};

export default TrustedBy;
