import React, { useState, useEffect } from "react";
import { Mail, AlertTriangle, ChevronRight, Send, FileText } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

const CustomOutreach = ({ resumes, hasResumes, user }) => {
  const [customTargetEmail, setCustomTargetEmail] = useState("");
  const [customSelectedResumeId, setCustomSelectedResumeId] = useState("");
  const [customJobDescription, setCustomJobDescription] = useState("");
  const [isCustomSending, setIsCustomSending] = useState(false);

  // Default to the first resume once resumes are available
  useEffect(() => {
    if (!customSelectedResumeId && resumes.length > 0) {
      setCustomSelectedResumeId(resumes[0].id);
    }
  }, [resumes, customSelectedResumeId]);

  const handleSendCustomOutreach = async (e) => {
    e.preventDefault();
    if (!customTargetEmail || !customSelectedResumeId || !customJobDescription) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (!user?.hasGmailConnected) {
      toast.error('Please connect your Gmail App Password in Settings first.');
      return;
    }

    setIsCustomSending(true);

    try {
      await api.post('/api/cold-outreach/start-custom', {
        targetMail: customTargetEmail,
        resumeId: customSelectedResumeId,
        jobDescription: customJobDescription,
      });

      toast.success(`Custom outreach sent successfully! An email will be sent to ${customTargetEmail} shortly.`);

      setCustomTargetEmail('');
      setCustomJobDescription('');
    } catch (error) {
      console.error('Error sending custom outreach:', error);
      toast.error(error.response?.data?.error || 'An error occurred while sending the custom outreach.');
    } finally {
      setIsCustomSending(false);
    }
  };

  return (
    <div className="mt-6 mb-10 bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/10">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
          <Send size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Custom Outreach Mailer</h2>
          <p className="text-sm text-gray-400 mt-1">
            Generate and send a personalized outreach email for any job description and target email.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {!hasResumes && (
          <div className="p-4 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
            <AlertTriangle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-red-400 font-semibold mb-1">Resume Required</h4>
              <p className="text-sm text-red-400/80">
                You need to upload at least one resume in the Settings before you can run outreach campaigns. The AI uses your resume to generate personalized emails.
              </p>
            </div>
          </div>
        )}

        {!user?.hasGmailConnected && (
          <div className="p-4 mb-6 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-3">
            <AlertTriangle size={18} className="text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-yellow-400 font-semibold mb-1">Gmail Connection Required</h4>
              <p className="text-sm text-yellow-400/80">
                You need to connect your Gmail account using an App Password in the Settings before you can send outreach emails.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSendCustomOutreach} className="space-y-6 max-w-4xl">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Select Resume</label>
            <div className="relative">
              <select
                value={customSelectedResumeId}
                onChange={(e) => setCustomSelectedResumeId(e.target.value)}
                disabled={!hasResumes}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
              >
                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id} className="bg-black text-white">
                    {resume.name} ({new Date(resume.uploaded_at).toLocaleDateString()})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <ChevronRight size={16} className="rotate-90" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Target Recipient Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                placeholder="recruiter@company.com"
                value={customTargetEmail}
                onChange={(e) => setCustomTargetEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Job Description</label>
            <div className="relative">
              <div className="absolute top-3 left-3 text-gray-400 pointer-events-none">
                <FileText size={18} />
              </div>
              <textarea
                required
                rows={8}
                placeholder="Paste the full job description or requirements here..."
                value={customJobDescription}
                onChange={(e) => setCustomJobDescription(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-200 resize-y min-h-[150px]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isCustomSending || !hasResumes || !user?.hasGmailConnected}
            className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold shadow-md transition-all duration-300 w-full sm:w-auto ${
              isCustomSending
                ? 'bg-purple-600/50 cursor-not-allowed border border-purple-500/30 text-white/70'
                : !hasResumes || !user?.hasGmailConnected
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                : 'bg-white/10 hover:bg-purple-600 border border-white/10 hover:border-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/20'
            }`}
          >
            {isCustomSending ? (
              <>
                <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                Processing Outreach...
              </>
            ) : (
              <>
                <Send size={18} />
                Send Custom Outreach
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomOutreach;
