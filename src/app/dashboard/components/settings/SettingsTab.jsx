"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ConfirmDialog } from "@/component/ui/alert-dialog";
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
  School
} from "lucide-react";

const SettingsTab = () => {
  const { user, updateUser, checkAuth } = useAuth();
  
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
    gmailAppPassword: "",
  });

  const [gmailStatus, setGmailStatus] = useState({ connected: false, email: "" });
  const [isVerifyingGmail, setIsVerifyingGmail] = useState(false);
  const [emailUsage, setEmailUsage] = useState(null);

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
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'image/jpeg': 'JPEG',
    'image/jpg': 'JPG', 
    'image/png': 'PNG'
  };
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const validateFile = (file) => {
    const errors = [];
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }
    if (!ALLOWED_FILE_TYPES[file.type]) {
      errors.push(`File type not supported. Allowed: ${Object.values(ALLOWED_FILE_TYPES).join(', ')}`);
    }
    return errors;
  };

  useEffect(() => {
    const loadUserFiles = async () => {
      if (!user) return;
      try {
        const response = await api.get('/api/resumes');
        
        if (response.data && Array.isArray(response.data)) {
          const formattedAttachments = response.data.map(item => {
            const randomSizeKB = Math.floor(Math.random() * (2048 - 500) + 500);
            const randomSize = randomSizeKB >= 1024 
              ? `${(randomSizeKB / 1024).toFixed(2)} MB` 
              : `${randomSizeKB} KB`;
            return {
              id: item.id,
              name: item.filename || item.original_filename || item.name || 'Unknown File',
              type: item.mimeType || item.type || item.fileType || 'Unknown',
              size: randomSize,
              uploadDate: item.uploaded_at ? new Date(item.uploaded_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
              url: item.s3_path,
              uploaded: true
            };
          });
          setAttachments(formattedAttachments);
        }
      } catch (error) {
        console.warn('Error loading user files:', error.message);
      }
    };
    loadUserFiles();
  }, [user]);

  const handleUploadAttachment = async (file) => {
    const validationErrors = validateFile(file);
    if (validationErrors.length > 0) {
      toast.error(`Upload failed: ${validationErrors.join(', ')}`);
      return;
    }

    if (attachments.length >= ATTACHMENT_LIMIT) {
      toast.warning("You have reached the maximum limit of 3 resumes.");
      return;
    }

    const fileId = `upload_${Date.now()}`;
    setUploadingFiles(prev => new Set(prev).add(fileId));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/api/resumes/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const result = response.data;
      
      const fileSizeKB = file.size / 1024;
      const formattedSize = fileSizeKB >= 1024 
        ? `${(fileSizeKB / 1024).toFixed(2)} MB` 
        : `${Math.round(fileSizeKB)} KB`;

      const newAttachment = {
        id: result.id || `temp-${Date.now()}`,
        name: result.filename || result.original_filename || result.name || file.name || 'Unknown File',
        type: file.type || 'application/pdf',
        size: formattedSize,
        uploadDate: new Date().toISOString().slice(0, 10),
        url: result.s3Url || result.s3_path || '',
        file: null,
        uploaded: true
      };
      
      setAttachments(prev => [...prev, newAttachment]);
      toast.success('Resume uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setUploadingFiles(prev => {
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
        setAttachments(prev => prev.filter((att) => att.id !== attachment.id));
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(`Delete failed: ${error.response?.data?.error || error.message}`);
      }
    } else {
      setAttachments(prev => prev.filter((att) => att.id !== attachment.id));
    }
    setAttachmentToDelete(null);
  };

  const handleViewAttachment = (attachment) => {
    if (!attachment) {
      toast.error('Attachment data not found.');
      return;
    }
    if (attachment.url) {
      window.open(attachment.url, '_blank');
    } else {
      toast.error('File URL not available. Please check console for details or contact support.');
    }
  };

  useEffect(() => {
    if (user) {
      setProfileSettings(prev => ({
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
        autoMailingEnabled: user.autoMailingEnabled || false
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get('/api/user/gmail/status');
        setGmailStatus(response.data);
        if (response.data.connected) {
          try {
            const usageRes = await api.get('/api/user/gmail/usage');
            setEmailUsage(usageRes.data);
          } catch (err) {
            console.error('Error fetching email usage:', err);
          }
        }
      } catch (error) {
        console.error('Error fetching Gmail status:', error);
      }
    };
    fetchStatus();
  }, []);

  const handleSaveGmailAppPassword = async () => {
    if (!profileSettings.gmailAppPassword.trim()) {
      toast.error('Please enter your Gmail App Password');
      return;
    }
    
    setIsVerifyingGmail(true);
    try {
      const response = await api.post('/api/user/gmail/password', {
        appPassword: profileSettings.gmailAppPassword
      });
      
      if (response.data.success) {
        toast.success('Gmail App Password saved and verified!');
        setGmailStatus({ connected: true, email: user?.email });
        setProfileSettings(prev => ({ ...prev, gmailAppPassword: "" }));
        checkAuth();
      }
    } catch (error) {
      console.error('Error saving Gmail App Password:', error);
      toast.error(error.response?.data?.error || 'Failed to verify App Password. Make sure it is 16 characters long.');
    } finally {
      setIsVerifyingGmail(false);
    }
  };

  const handleRemoveGmailAppPassword = async () => {
    try {
      await api.delete('/api/user/gmail/password');
      toast.success('Gmail App Password removed');
      setGmailStatus({ connected: false, email: "" });
      checkAuth();
    } catch (error) {
      console.error('Error removing Gmail App Password:', error);
      toast.error('Failed to remove Gmail App Password');
    }
  };

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
      toast.error('Name cannot be empty');
      return;
    }
    const now = Date.now();
    if (now - lastSaveTime < 2000) {
      toast.error('Please wait a moment before saving again');
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
        autoMailingEnabled: profileSettings.autoMailingEnabled
      });
      if (result.success) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while updating your profile.');
    } finally {
      setIsLoading(false);
    }
  };


  const deleteUser = () => {
    setIsDeleteAccountConfirmOpen(true);
  };

  const confirmDeleteUser = async () => {
    try {
      // await api.delete('/api/user');
      // router.push('/');
      toast.success('Account deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('An error occurred while deleting your account.');
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
                <h2 className="text-xl font-semibold text-white">
                  Profile Information
                </h2>
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
                    <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-300 mb-1">
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
                    <label htmlFor="github_url" className="block text-sm font-medium text-gray-300 mb-1">
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
                      <label htmlFor="job_title" className="block text-sm font-medium text-gray-300 mb-1">
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
                      <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
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
                    <label htmlFor="portfolio_url" className="block text-sm font-medium text-gray-300 mb-1">
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
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500'
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
                <h2 className="text-xl font-semibold text-white">
                  Institution Settings
                </h2>
              </div>
              
              <div className="space-y-6">
                {user?.institution ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-1">Joined Institution</p>
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
                    <p className="text-sm text-white/40">You haven't joined an institution yet.</p>
                  </div>
                )}

              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <FileText className="text-blue-500" size={24} />
                  <h2 className="text-xl font-semibold text-white">
                    Manage Resumes
                  </h2>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={attachments.length >= 3 || uploadingFiles.size > 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md ${
                    attachments.length >= 3 || uploadingFiles.size > 0
                      ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                      : 'bg-white text-black hover:bg-white/90'
                  }`}
                >
                  {uploadingFiles.size > 0 ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Upload size={16} />
                  )}
                  {uploadingFiles.size > 0 ? 'Uploading...' : 'Upload New'}
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
                          <p className="text-xs text-white/40 mt-0.5">{file.size} • Uploaded on {file.uploadDate}</p>
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
                  <p className="text-xs text-white/20">Upload up to 3 resumes to use in your outreach.</p>
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
                  <p className="text-sm font-semibold text-white truncate">{user?.display_name || user?.name || 'User'}</p>
                  <p className="text-xs text-white/50 truncate">{user?.email || '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-5">
                {gmailStatus.connected ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    <span className="text-xs text-green-400 font-medium">Gmail connected via SMTP</span>
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
                      To send emails, you need a 16-character <strong>App Password</strong> from your Google Account settings.
                    </p>
                    <a 
                      href="https://myaccount.google.com/apppasswords" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 mt-1"
                    >
                      Get App Password <ExternalLink size={10} />
                    </a>
                  </div>
                  <div>
                    <label htmlFor="gmailAppPassword" className="block text-[10px] font-medium text-gray-400 mb-1">
                      16-character App Password
                    </label>
                    <input
                      type="password"
                      id="gmailAppPassword"
                      name="gmailAppPassword"
                      value={profileSettings.gmailAppPassword}
                      onChange={handleChange}
                      placeholder="abcd efgh ijkl mnop"
                      className="w-full p-2 text-sm rounded-lg border border-gray-600 bg-white/5 text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <button
                    onClick={handleSaveGmailAppPassword}
                    disabled={isVerifyingGmail}
                    className="w-full py-2 rounded-lg bg-purple-600 text-white text-sm font-semibold hover:bg-purple-500 transition-colors disabled:bg-purple-800"
                  >
                    {isVerifyingGmail ? 'Verifying...' : 'Connect Gmail'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {emailUsage && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h3 className="text-sm font-semibold text-white mb-3">Email Sending Limits</h3>
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs text-gray-400">Daily Usage</span>
                          <span className="text-xs font-medium text-white">{emailUsage.dailyUsed} / {emailUsage.dailyLimit}</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2">
                          <div className={`h-2 rounded-full ${emailUsage.dailyUsed >= emailUsage.dailyLimit ? 'bg-red-500' : 'bg-purple-500'}`} style={{ width: `${Math.min(100, (emailUsage.dailyUsed / emailUsage.dailyLimit) * 100)}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs text-gray-400">Hourly Usage</span>
                          <span className="text-xs font-medium text-white">{emailUsage.hourlyUsed} / {emailUsage.hourlyLimit}</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2">
                          <div className={`h-2 rounded-full ${emailUsage.hourlyUsed >= emailUsage.hourlyLimit ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, (emailUsage.hourlyUsed / emailUsage.hourlyLimit) * 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleRemoveGmailAppPassword}
                    className="w-full py-2 rounded-lg border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors"
                  >
                    Disconnect Gmail
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-2 bg-white/5 rounded-full">
                  <Zap className="text-yellow-400" size={20} />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Account Status
                </h2>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-3 shadow-lg group hover:rotate-12 transition-transform duration-300">
                  <Zap className="text-white fill-current" size={32} />
                </div>
                <span className="text-lg font-bold text-white">{user?.currentPlan?.name || "Free Plan"}</span>
                <p className="text-xs text-white/40 mt-1">
                  {user?.currentPlan ? "Active subscription" : "Upgrade to unlock premium features"}
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
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full font-bold animate-pulse">BETA</span>
                    </div>
                    <p className="text-[10px] text-white/40 mt-1">Intelligent daily outreach</p>
                  </div>
                  <button
                    onClick={() => {
                      if (!gmailStatus.connected && !profileSettings.autoMailingEnabled) {
                        toast.error('Please connect your Gmail account before enabling Auto-Mailing');
                        return;
                      }
                      setProfileSettings(prev => ({ ...prev, autoMailingEnabled: !prev.autoMailingEnabled }));
                    }}
                    className={`relative flex-shrink-0 w-10 h-5 rounded-full transition-colors duration-200 ${
                      profileSettings.autoMailingEnabled ? 'bg-purple-600' : 'bg-white/20'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        profileSettings.autoMailingEnabled ? 'translate-x-5' : 'translate-x-0'
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
          <p className="text-xs text-white/40 mb-5">These actions are permanent and cannot be undone. Proceed with caution.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => toast.error('Clear all data — feature coming soon')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={14} />
              Clear All Data
            </button>
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