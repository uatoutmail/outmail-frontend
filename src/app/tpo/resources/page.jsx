"use client";
import TPOPageShell from "@/component/tpo/TPOPageShell";
import { toast } from "sonner";
import { BookOpen, FileText, Video, Link2, Download, ExternalLink } from "lucide-react";

const SUCCESS_TEAM_MAILTO =
  "mailto:contact@outmail.in?subject=TPO%20Success%20Team%20%E2%80%94%20Request%20a%20Call&body=Hi%20Outmail%20team%2C%0A%0AWe%27d%20like%20to%20schedule%20a%20call.%0A%0AInstitution%3A%0AName%3A%0APreferred%20time%3A%0A";

const resources = [
  {
    category: "Getting Started",
    icon: BookOpen,
    color: "purple",
    items: [
      { title:"TPO Onboarding Guide",                type:"PDF",   desc:"Step-by-step setup for your college on Outmail",   tag:"Essential" },
      { title:"Student Invitation Walkthrough",       type:"Video", desc:"How to invite and enroll your students in 5 mins",  tag:"Essential" },
      { title:"Dashboard Quick Tour",                type:"Video", desc:"A 3-minute overview of every section in this portal",tag:"Essential" },
    ],
  },
  {
    category: "Understanding the Data",
    icon: FileText,
    color: "blue",
    items: [
      { title:"Outmail Priority Score — Explained",  type:"PDF",   desc:"How job scores are calculated and what drives them", tag:"Recommended" },
      { title:"Reading Email Analytics",             type:"PDF",   desc:"Open rate, reply rate, and what benchmarks to target",tag:"Recommended" },
      { title:"Engagement Score Breakdown",          type:"PDF",   desc:"What factors make up a student's engagement score",   tag:"Recommended" },
    ],
  },
  {
    category: "Improving Outcomes",
    icon: Video,
    color: "green",
    items: [
      { title:"Cold Email Best Practices for Students",type:"PDF",  desc:"Templates and strategies that get recruiter replies",  tag:"High Impact" },
      { title:"Driving Student Activation",           type:"Video", desc:"How to nudge inactive students back onto the platform",tag:"High Impact" },
      { title:"Hosting a Campus Mentorship Drive",    type:"Video", desc:"Organise group mentor sessions for maximum attendance",tag:"High Impact" },
    ],
  },
  {
    category: "Compliance & Privacy",
    icon: Link2,
    color: "orange",
    items: [
      { title:"Data Privacy Policy",                 type:"Link",  desc:"How student data is stored, used, and protected",     tag:"Legal"  },
      { title:"FERPA / DPDP Compliance Summary",     type:"PDF",   desc:"Outmail's compliance with Indian data protection norms",tag:"Legal" },
      { title:"Student Consent Framework",           type:"PDF",   desc:"Template consent forms for college-level enrolment",   tag:"Legal"  },
    ],
  },
];

const typeIcon = { PDF:<FileText size={13}/>, Video:<Video size={13}/>, Link:<Link2 size={13}/> };
const typeCls  = { PDF:"bg-purple-100 text-purple-700", Video:"bg-blue-100 text-blue-700", Link:"bg-orange-100 text-orange-700" };
const tagCls   = { Essential:"bg-purple-50 text-purple-700 border-purple-200", Recommended:"bg-blue-50 text-blue-700 border-blue-200", "High Impact":"bg-green-50 text-green-700 border-green-200", Legal:"bg-orange-50 text-orange-700 border-orange-200" };
const colorMap = { purple:"border-purple-200 bg-purple-50", blue:"border-blue-200 bg-blue-50", green:"border-green-200 bg-green-50", orange:"border-orange-200 bg-orange-50" };
const iconTextMap = { purple:"text-purple-600", blue:"text-blue-600", green:"text-green-600", orange:"text-orange-600" };

export default function ResourcesPage() {
  return (
    <TPOPageShell title="Resources" subtitle="Guides, videos, and compliance documents to help you get the most out of Outmail">

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label:"Download Onboarding PDF",    icon:Download,     hint:"Quick-start guide for your college", onClick:()=>toast("Onboarding guide is coming soon.") },
          { label:"Watch Platform Demo",         icon:Video,        hint:"5-minute recorded walkthrough",      onClick:()=>toast("The demo video is coming soon.")    },
          { label:"Talk to Our Success Team",    icon:ExternalLink, hint:"Book a 30-min call with us",          onClick:()=>{ window.location.href = SUCCESS_TEAM_MAILTO; } },
        ].map(({label,icon:Icon,hint,onClick})=>(
          <button key={label} onClick={onClick} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-4 hover:border-purple-300 hover:bg-purple-50/40 transition text-left shadow-sm group">
            <div className="p-2.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition">
              <Icon size={16} className="text-purple-600"/>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Resource sections */}
      <div className="space-y-8">
        {resources.map(({ category, icon: Icon, color, items }) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-4">
              <div className={`p-2 rounded-lg border ${colorMap[color]}`}>
                <Icon size={15} className={iconTextMap[color]}/>
              </div>
              <h2 className="text-sm font-bold text-gray-900">{category}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item)=>(
                <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-purple-200 transition group cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${typeCls[item.type]}`}>
                      {typeIcon[item.type]} {item.type}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${tagCls[item.tag]}`}>
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mb-1 group-hover:text-purple-700 transition">{item.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">{item.desc}</p>
                  <button
                    onClick={() => toast("This resource is coming soon.")}
                    className="flex items-center gap-1 text-xs text-purple-600 font-medium hover:underline"
                  >
                    {item.type==="Link"?"Open link →":"Download →"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Support block */}
      <div className="mt-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-white font-bold text-lg">Need personalised help?</p>
          <p className="text-purple-200 text-sm mt-1">Our customer success team is happy to walk you through any feature or help you drive student adoption.</p>
        </div>
        <a
          href={SUCCESS_TEAM_MAILTO}
          className="flex-shrink-0 bg-white text-purple-700 font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-purple-50 transition"
        >
          Book a Call
        </a>
      </div>
    </TPOPageShell>
  );
}
