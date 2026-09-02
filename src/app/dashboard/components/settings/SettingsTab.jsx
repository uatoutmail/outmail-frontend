"use client";
import {
  Check,
  X,
  User,
  Mail,
  Phone,
  Link,
  Save,
  FileText,
  Upload,
  Eye,
  Trash2,
  Globe,
  Zap,
  AlertTriangle,
  Briefcase,
  MapPin,
  ExternalLink,
  School,
} from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import AutofillExtensionCard from "./AutofillExtensionCard";
import { ConfirmDialog } from "@/component/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { logger } from "@/lib/logger";

const SettingsTab = () => {
  const { user, updateUser } = useAuth();

  const [profileSettings, setProfileSettings] = useState({
    name: user?.display_name || user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    linkedin_url: user?.linkedin_url || "",
    github_url: user?.github_url || "",
    job_title: user?.job_title || "",
    location: user?.location || "",
    portfolio_url: user?.portfolio_url || "",
    bio: user?.bio || "",
    notifications: true,
    autoMailingEnabled: user?.autoMailingEnabled || false,
  });

  const [gmailStatus, setGmailStatus] = useState({ connected: false, email: "" });
  const [emailUsage, setEmailUsage] = useState(null);

  // True when this page runs inside the Outmail desktop shell (its preload
  // exposes window.outmail). The Gmail app password is only ever entered in
  // the app's NATIVE settings panel — this lets us open it from here.
  const [canOpenAgentSettings, setCanOpenAgentSettings] = useState(false);
  useEffect(() => {
    // window.outmail is only reachable client-side (desktop shell preload) -
    // no async boundary to move this feature-detection past.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanOpenAgentSettings(
      typeof window !== "undefined" && typeof window.outmail?.openAgentSettings === "function"
    );
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(0);
  const [isDeleteAttachmentConfirmOpen, setIsDeleteAttachmentConfirmOpen] = useState(false);
  const [attachmentToDelete, setAttachmentToDelete] = useState(null);
  const [isDeleteAccountConfirmOpen, setIsDeleteAccountConfirmOpen] = useState(false);

  const fileInputRef = useRef(null);

  const [attachments, setAttachments] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(new Set());
  const ATTACHMENT_LIMIT = 3;

  const ALLOWED_FILE_TYPES = {
    "application/pdf": "PDF",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
    "image/jpeg": "JPEG",
    "image/jpg": "JPG",
    "image/png": "PNG",
  };
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const validateFile = (file) => {
    const errors = [];
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }
    if (!ALLOWED_FILE_TYPES[file.type]) {
      errors.push(
        `File type not supported. Allowed: ${Object.values(ALLOWED_FILE_TYPES).join(", ")}`
      );
    }
    return errors;
  };

  useEffect(() => {
    const loadUserFiles = async () => {
      if (!user) return;
      try {
        const response = await api.get("/api/resumes");

        if (response.data && Array.isArray(response.data)) {
          const formattedAttachments = response.data.map((item) => {
            return {
              id: item.id,
              name: item.filename || item.original_filename || item.name || "Unknown File",
              type: item.mimeType || item.type || item.fileType || "Unknown",
              size: item.size || item.fileSize || null,
              uploadDate: item.uploaded_at
                ? new Date(item.uploaded_at).toISOString().slice(0, 10)
                : new Date().toISOString().slice(0, 10),
              url: item.s3_path,
              uploaded: true,
            };
          });
          setAttachments(formattedAttachments);
        }
      } catch (error) {
        logger.warn("Error loading user files:", error.message);
      }
    };
    loadUserFiles();
  }, [user]);

  const handleUploadAttachment = async (file) => {
    const validationErrors = validateFile(file);
    if (validationErrors.length > 0) {
      toast.error(`Upload failed: ${validationErrors.join(", ")}`);
      return;
    }

    if (attachments.length >= ATTACHMENT_LIMIT) {
      toast.warning("You have reached the maximum limit of 3 resumes.");
      return;
    }

    const fileId = `upload_${Date.now()}`;
    setUploadingFiles((prev) => new Set(prev).add(fileId));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/api/resumes/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = response.data;

      const fileSizeKB = file.size / 1024;
      const formattedSize =
        fileSizeKB >= 1024
          ? `${(fileSizeKB / 1024).toFixed(2)} MB`
          : `${Math.round(fileSizeKB)} KB`;

      const newAttachment = {
        id: result.id || `temp-${Date.now()}`,
        name:
          result.filename || result.original_filename || result.name || file.name || "Unknown File",
        type: file.type || "application/pdf",
        size: formattedSize,
        uploadDate: new Date().toISOString().slice(0, 10),
        url: result.s3Url || result.s3_path || "",
        file: null,
        uploaded: true,
      };

      setAttachments((prev) => [...prev, newAttachment]);
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      logger.error("Upload error:", error);
      toast.error(`Upload failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setUploadingFiles((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const handleDeleteAttachment = (attachment) => {
    setAttachmentToDelete(attachment);
    setIsDeleteAttachmentConfirmOpen(true);
  };

  const confirmDeleteAttachment = async () => {
    const attachment = attachmentToDelete;
    if (!attachment) return;

    if (attachment.uploaded && attachment.id) {
      try {
        await api.delete(`/api/resumes/${attachment.id}`);
        setAttachments((prev) => prev.filter((att) => att.id !== attachment.id));
      } catch (error) {
        logger.error("Delete error:", error);
        toast.error(`Delete failed: ${error.response?.data?.error || error.message}`);
      }
    } else {
      setAttachments((prev) => prev.filter((att) => att.id !== attachment.id));
    }
    setAttachmentToDelete(null);
  };

  const handleViewAttachment = (attachment) => {
    if (!attachment) {
      toast.error("Attachment data not found.");
      return;
    }
    if (attachment.url) {
      window.open(attachment.url, "_blank");
    } else {
      toast.error("File URL not available. Please check console for details or contact support.");
    }
  };

  useEffect(() => {
    if (user) {
      // Syncing local form state from the user prop when it changes - no
      // async work, a controlled-form reset-on-prop-change pattern.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfileSettings((prev) => ({
        ...prev,
        name: user.display_name || user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        linkedin_url: user.linkedin_url || "",
        github_url: user.github_url || "",
        job_title: user.job_title || "",
        location: user.location || "",
        portfolio_url: user.portfolio_url || "",
        bio: user.bio || "",
        autoMailingEnabled: user.autoMailingEnabled || false,
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get("/api/user/gmail/status");
        setGmailStatus(response.data);
        if (response.data.connected) {
          try {
            const usageRes = await api.get("/api/user/gmail/usage");
            setEmailUsage(usageRes.data);
          } catch (err) {
            logger.error("Error fetching email usage:", err);
          }
        }
      } catch (error) {
        logger.error("Error fetching Gmail status:", error);
      }
    };
    fetchStatus();

    // Refetch the moment the desktop app reports a credential change, and when
    // the user returns from the native settings panel — otherwise this card
    // keeps showing "not connected" until a full page reload.
    // (/api/user/gmail/status is capped at 20 req/h, so no polling here.)
    let unsubscribe;
    if (typeof window !== "undefined" && typeof window.outmail?.onAgentEvent === "function") {
      unsubscribe = window.outmail.onAgentEvent((payload) => {
        if (typeof payload?.credentialConnected === "boolean") {
          setGmailStatus((prev) => ({ ...prev, connected: payload.credentialConnected }));
        }
      });
    }
    const onFocus = () => fetchStatus();
    window.addEventListener("focus", onFocus);
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileSettings((prevSettings) => ({
      ...prevSettings,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const onFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleUploadAttachment(file);
    }
  };

  const handleSave = async () => {
    if (!profileSettings.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    const now = Date.now();
    if (now - lastSaveTime < 2000) {
      toast.error("Please wait a moment before saving again");
      return;
    }
    setIsLoading(true);
    setLastSaveTime(now);
    try {
      const result = await updateUser({
        display_name: profileSettings.name,
        name: profileSettings.name,
        phone: profileSettings.phone,
        linkedin_url: profileSettings.linkedin_url,
        github_url: profileSettings.github_url,
        job_title: profileSettings.job_title,
        location: profileSettings.location,
        portfolio_url: profileSettings.portfolio_url,
        bio: profileSettings.bio,
        autoMailingEnabled: profileSettings.autoMailingEnabled,
      });
      if (result.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile: " + result.error);
      }
    } catch (error) {
      logger.error("Error updating profile:", error);
      toast.error("An error occurred while updating your profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = () => {
    setIsDeleteAccountConfirmOpen(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await api.delete("/api/user");
      toast.success("Your account has been deleted.");
      // Full reload clears client auth state and returns to the public site.
      window.location.href = "/";
    } catch (error) {
      logger.error("Error deleting user:", error);
      toast.error(
        error?.message || "Could not delete your account. Please try again or contact support."
      );
    } finally {
      setIsDeleteAccountConfirmOpen(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 font-syne">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 mt-4 text-white">Settings</h1>
          <p className="text-white text-sm sm:text-base">
            Manage your account, resumes and personal details
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <User className="text-purple-600" size={24} />
                <h2 className="text-xl font-semibold text-white">Profile Information</h2>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={profileSettings.name}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border border-gray-600 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileSettings.email}
                        disabled
                        className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-600 bg-white/5 text-gray-400 cursor-not-allowed focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Phone className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={profileSettings.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-600 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="linkedin_url"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      LinkedIn Profile
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Link className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="text"
                        id="linkedin_url"
                        name="linkedin_url"
                        value={profileSettings.linkedin_url}
                        onChange={handleChange}
                        placeholder="linkedin.com/in/..."
                        className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-600 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="github_url"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    GitHub Link
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Link className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="text"
                      id="github_url"
                      name="github_url"
                      value={profileSettings.github_url}
                      onChange={handleChange}
                      placeholder="github.com/..."
                      className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-600 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label
                      htmlFor="job_title"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Current Job Title / Role
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Briefcase className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="text"
                        id="job_title"
                        name="job_title"
                        value={profileSettings.job_title}
                        onChange={handleChange}
                        placeholder="e.g. Software Engineer"
                        className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-600 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      Location
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MapPin className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={profileSettings.location}
                        onChange={handleChange}
                        placeholder="e.g. Bangalore, India"
                        className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-600 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="portfolio_url"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Portfolio / Website
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <ExternalLink className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="text"
                      id="portfolio_url"
                      name="portfolio_url"
                      value={profileSettings.portfolio_url}
                      onChange={handleChange}
                      placeholder="https://yourportfolio.com"
                      className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-600 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">
                    Bio / About You
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={profileSettings.bio}
                    onChange={handleChange}
                    placeholder="Write a short bio about yourself..."
                    className="w-full p-3 rounded-lg border border-gray-600 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
                      isLoading
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"
                    } text-white`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <School className="text-emerald-500" size={24} />
                <h2 className="text-xl font-semibold text-white">Institution Settings</h2>
              </div>

              <div className="space-y-6">
                {user?.institution ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-1">
                          Joined Institution
                        </p>
                        <h3 className="text-lg font-bold text-white">{user.institution.name}</h3>
                        <p className="text-sm text-white/60 mt-1 flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-mono">
                            ID: {user.institution.institutionCode}
                          </span>
                        </p>
                      </div>
                      <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                        <Check size={20} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                    <p className="text-sm text-white/40">
                      You haven&apos;t joined an institution yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <FileText className="text-blue-500" size={24} />
                  <h2 className="text-xl font-semibold text-white">Manage Resumes</h2>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={attachments.length >= 3 || uploadingFiles.size > 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md ${
                    attachments.length >= 3 || uploadingFiles.size > 0
                      ? "bg-gray-600 cursor-not-allowed text-gray-400"
                      : "bg-white text-black hover:bg-white/90"
                  }`}
                >
                  {uploadingFiles.size > 0 ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Upload size={16} />
                  )}
                  {uploadingFiles.size > 0 ? "Uploading..." : "Upload New"}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
              </div>

              {attachments.length > 0 ? (
                <div className="space-y-3">
                  {attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400">
                          <FileText size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{file.name}</p>
                          <p className="text-xs text-white/40 mt-0.5">
                            {file.size ? `${file.size} • ` : ""}Uploaded on {file.uploadDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleViewAttachment(file)}
                          className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                          title="View Resume"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteAttachment(file)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400/60 hover:text-red-400 hover:bg-red-500/20 transition-all"
                          title="Delete Resume"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload size={20} className="text-white/20" />
                  </div>
                  <p className="text-sm text-white/40 mb-1">No resumes uploaded yet.</p>
                  <p className="text-xs text-white/20">
                    Upload up to 3 resumes to use in your outreach.
                  </p>
                </div>
              )}
              <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-xs text-blue-300 flex items-center gap-2">
                  <Globe size={12} />
                  Your resumes are used to personalize cold emails and match you with jobs.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-5">
                <Globe className="text-blue-400" size={20} />
                <h2 className="text-lg font-semibold text-white">Connected Account</h2>
              </div>
              <div className="flex items-center gap-3 mb-4">
                {user?.profilePicture ? (
                  <Image
                    src={user.profilePicture}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-purple-300" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.display_name || user?.name || "User"}
                  </p>
                  <p className="text-xs text-white/50 truncate">{user?.email || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-5">
                {gmailStatus.connected ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    <span className="text-xs text-green-400 font-medium">
                      Gmail connected via SMTP
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-400"></span>
                    <span className="text-xs text-red-400 font-medium">Gmail not connected</span>
                  </>
                )}
              </div>

              {!gmailStatus.connected ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-4">
                    <p className="text-[10px] text-blue-300 leading-relaxed">
                      Emails are sent by the <strong>Outmail desktop app</strong> from your own
                      computer. Your Gmail app password is stored only on your machine — it never
                      touches Outmail&apos;s servers.
                    </p>
                    {canOpenAgentSettings ? (
                      <p className="text-[10px] text-blue-300 leading-relaxed mt-2">
                        Use the button below to open the app&apos;s settings panel and enter your
                        Gmail app password there.
                      </p>
                    ) : (
                      <p className="text-[10px] text-blue-300 leading-relaxed mt-2">
                        To connect: open the Outmail desktop app and enter your Gmail app password
                        in <strong>Agent &amp; Gmail Settings</strong> (menu bar, or Cmd/Ctrl+,).
                      </p>
                    )}
                    <a
                      href="https://myaccount.google.com/apppasswords"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 mt-1"
                    >
                      Create a Gmail App Password <ExternalLink size={10} />
                    </a>
                  </div>
                  {canOpenAgentSettings && (
                    <button
                      onClick={() => window.outmail.openAgentSettings()}
                      className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition"
                    >
                      Open Agent &amp; Gmail Settings
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {emailUsage && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-sm font-semibold text-white mb-3">
                        Email Sending Limits
                      </h3>
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs text-gray-400">Daily Usage</span>
                          <span className="text-xs font-medium text-white">
                            {emailUsage.dailyUsed} / {emailUsage.dailyLimit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${emailUsage.dailyUsed >= emailUsage.dailyLimit ? "bg-red-500" : "bg-purple-500"}`}
                            style={{
                              width: `${Math.min(100, (emailUsage.dailyUsed / emailUsage.dailyLimit) * 100)}%`,
                            }}
                          ></div>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                          Your daily limit starts small and grows automatically as you send
                          consistently — this protects your Gmail account&apos;s reputation.
                        </p>
                      </div>
                    </div>
                  )}
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    Gmail is connected in your Outmail desktop app. To disconnect, open
                    <strong> Agent &amp; Gmail Settings</strong> and use &quot;Disconnect
                    Gmail&quot; there.
                  </p>
                  {canOpenAgentSettings && (
                    <button
                      onClick={() => window.outmail.openAgentSettings()}
                      className="w-full py-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold transition"
                    >
                      Open Agent &amp; Gmail Settings
                    </button>
                  )}
                </div>
              )}
            </div>

            <AutofillExtensionCard />

            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-white/5 rounded-full">
                  <Zap className="text-yellow-400" size={20} />
                </div>
                <h2 className="text-xl font-semibold text-white">Account Status</h2>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-3 shadow-lg group hover:rotate-12 transition-transform duration-300">
                  <Zap className="text-white fill-current" size={32} />
                </div>
                {/* There is no free plan (OUT-230). Calling an unpaid account
                    "Free Plan" tells the user they are on something they are
                    not, and makes the three-send limit look like a fault. */}
                <span className="text-lg font-bold text-white">
                  {user?.currentPlan?.name || "No active plan"}
                </span>
                <p className="text-xs text-white/40 mt-1">
                  {user?.currentPlan
                    ? "One placement year — see Billing for your end date"
                    : `${user?.trial?.remaining ?? 3} free sends left · choose a plan to keep going`}
                </p>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3 text-gray-300 text-xs">
                  <Check className="text-green-500" size={16} />
                  <span>Unlimited cold outreach</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300 text-xs">
                  <Check className="text-green-500" size={16} />
                  <span>Smart resume parsing</span>
                </li>
                <li className="flex items-center gap-3 text-gray-300 text-xs">
                  <Check className="text-green-500" size={16} />
                  <span>Priority job recommendations</span>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-purple-400" />
                      <p className="text-sm font-bold text-white">Auto-Mailing</p>
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                        BETA
                      </span>
                    </div>
                    <p className="text-[10px] text-white/40 mt-1">Intelligent daily outreach</p>
                  </div>
                  <button
                    onClick={async () => {
                      if (!gmailStatus.connected && !profileSettings.autoMailingEnabled) {
                        toast.error(
                          "Please connect your Gmail account before enabling Auto-Mailing"
                        );
                        return;
                      }
                      // Persist immediately. This used to only set local state,
                      // so the switch looked committed while the change was
                      // silently discarded unless you also hit Save — and this
                      // is the setting that decides whether the weekly planner
                      // includes you at all.
                      const next = !profileSettings.autoMailingEnabled;
                      setProfileSettings((prev) => ({ ...prev, autoMailingEnabled: next }));
                      const result = await updateUser({ autoMailingEnabled: next });
                      if (result?.success) {
                        toast.success(next ? "Auto-mailing enabled" : "Auto-mailing disabled");
                      } else {
                        setProfileSettings((prev) => ({ ...prev, autoMailingEnabled: !next }));
                        toast.error(
                          "Could not update auto-mailing: " + (result?.error || "unknown error")
                        );
                      }
                    }}
                    className={`relative flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-200 ${
                      profileSettings.autoMailingEnabled ? "bg-purple-600" : "bg-white/20"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        profileSettings.autoMailingEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-red-500/30 bg-red-500/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-1">
            <AlertTriangle className="text-red-400" size={18} />
            <h2 className="text-base font-semibold text-red-400">Danger Zone</h2>
          </div>
          <p className="text-xs text-white/40 mb-5">
            These actions are permanent and cannot be undone. Proceed with caution.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={deleteUser}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-sm hover:bg-red-500/25 transition-colors"
            >
              <X size={14} />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteAttachmentConfirmOpen}
        onClose={() => {
          setIsDeleteAttachmentConfirmOpen(false);
          setAttachmentToDelete(null);
        }}
        onConfirm={confirmDeleteAttachment}
        title="Delete Attachment?"
        description="Are you sure you want to delete this attachment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      <ConfirmDialog
        isOpen={isDeleteAccountConfirmOpen}
        onClose={() => setIsDeleteAccountConfirmOpen(false)}
        onConfirm={confirmDeleteUser}
        title="Delete Account?"
        description="Are you sure you want to delete your account? This action cannot be undone and you will lose all your data."
        confirmText="Delete Account"
        cancelText="Cancel"
      />
    </div>
  );
};

export default SettingsTab;
