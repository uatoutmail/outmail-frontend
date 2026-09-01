"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { motion } from "framer-motion";
import {
	Rocket,
	Send,
	Search,
	FileCheck,
	BarChart3,
	GraduationCap,
	CheckCircle2,
	Mail,
	ArrowRight,
} from "lucide-react";

const oauthUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`;

const fadeUp = {
	initial: { opacity: 0, y: 30 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true, margin: "-50px" },
	transition: { duration: 0.6, ease: "easeOut" },
};

/* ---------------------------------------------------------------- Demos --- */

function RecruiterOutreachDemo() {
	return (
		<div className="glass-card p-4 md:p-5">
			<div className="flex items-center justify-between gap-2 text-xs md:text-sm text-white/70">
				<div className="flex items-center gap-2">
					<Send className="h-4 w-4 text-accent-soft" />
					<span>Recruiter Outreach</span>
				</div>
				<span className="hidden sm:inline text-[11px]">Gmail-style outreach</span>
			</div>
			<div className="mt-4 space-y-3 text-xs md:text-sm">
				<div className="rounded-lg border border-white/10 bg-black/40 p-3">
					<p className="text-[11px] text-white/60 mb-1">Doing it manually</p>
					<div className="space-y-1.5">
						<p className="rounded-md bg-red-500/10 px-2 py-1 text-red-100/90">&quot;startup companies hiring&quot;</p>
						<p className="rounded-md bg-red-500/5 px-2 py-1 text-red-100/80">&quot;companies hiring software engineers&quot;</p>
						<p className="rounded-md bg-red-500/5 px-2 py-1 text-red-100/70">&quot;recruiter email HR manager&quot;</p>
					</div>
					<p className="mt-2 text-[11px] text-red-200">A few companies. No targeting. No signals.</p>
				</div>
				<motion.div
					className="rounded-lg border border-blue-400/40 bg-blue-500/10 p-3"
					animate={{
						boxShadow: [
							"0 0 0px rgba(37,99,235,0.6)",
							"0 0 25px rgba(37,99,235,0.5)",
							"0 0 0px rgba(37,99,235,0.6)",
						],
					}}
					transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
				>
					<p className="text-[11px] font-medium text-blue-100 mb-1 flex items-center gap-2">
						<span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-500/30">
							<Send className="h-3 w-3" />
						</span>
						Smart campaigns. Real signals.
					</p>
					<p className="text-[11px] text-white/80">
						Outmail builds a targeted list of companies showing hiring signals — and sends personalized emails from your own inbox.
					</p>
				</motion.div>
			</div>
		</div>
	);
}

function OpportunityDiscoveryDemo() {
	return (
		<div className="glass-card p-4 md:p-5">
			<div className="flex items-center justify-between gap-2 text-xs md:text-sm text-white/70">
				<div className="flex items-center gap-2">
					<Search className="h-4 w-4 text-accent-soft" />
					<span>Job Discovery Feed</span>
				</div>
				<span className="hidden sm:inline text-[11px]">Curated &amp; ranked</span>
			</div>
			<div className="mt-4 space-y-3 text-xs md:text-sm">
				<div className="flex flex-wrap gap-2">
					{["Backend", "Entry Level", "Bangalore"].map((chip) => (
						<span key={chip} className="rounded-full bg-blue-500/15 border border-blue-400/60 px-3 py-1 text-[11px] text-blue-100">
							{chip}
						</span>
					))}
				</div>
				<div className="grid gap-3 md:grid-cols-2">
					{[
						{ title: "Software Engineer — Backend", score: 94 },
						{ title: "Data Analyst — Entry Level", score: 88 },
						{ title: "Product Associate", score: 82 },
						{ title: "Frontend Developer", score: 79 },
					].map((job) => (
						<motion.div
							key={job.title}
							className="rounded-xl border border-white/10 bg-black/40 p-3 flex flex-col gap-1"
							whileHover={{ y: -3, scale: 1.01 }}
							transition={{ type: "spring", stiffness: 300, damping: 20 }}
						>
							<p className="text-white/90 text-xs md:text-sm">{job.title}</p>
							<p className="text-white/60 text-[11px]">High-intent opportunity</p>
							<span className="mt-1 inline-flex w-max items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-200">
								<span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
								Outmail Score: {job.score}
							</span>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
}

function AutoApplyDemo() {
	const fields = ["Full Name", "Email", "Phone", "Resume", "LinkedIn", "Education", "Skills"];
	return (
		<div className="glass-card p-4 md:p-5">
			<div className="flex items-center justify-between gap-2 text-xs md:text-sm text-white/70">
				<div className="flex items-center gap-2">
					<FileCheck className="h-4 w-4 text-accent-soft" />
					<span>One-Click Autofill</span>
				</div>
				<span className="hidden sm:inline text-[11px]">Form auto-fill preview</span>
			</div>
			<div className="mt-4 space-y-2 text-xs md:text-sm">
				{fields.map((field, idx) => (
					<motion.div
						key={field}
						className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-3 py-2"
						initial={{ opacity: 0, x: 10 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ delay: idx * 0.06, duration: 0.2 }}
					>
						<span className="text-white/70">{field}</span>
						<span className="flex items-center gap-1 text-[11px] text-emerald-200">
							<CheckCircle2 className="h-3 w-3" />
							auto-filled
						</span>
					</motion.div>
				))}
				<p className="mt-2 text-[11px] text-white/60">Enter once on the Outmail dashboard, apply everywhere faster.</p>
			</div>
		</div>
	);
}

function PlacementAnalyticsDemo() {
	return (
		<div className="glass-card p-4 md:p-5">
			<div className="flex items-center justify-between gap-2 text-xs md:text-sm text-white/70">
				<div className="flex items-center gap-2">
					<BarChart3 className="h-4 w-4 text-accent-soft" />
					<span>Outreach Dashboard</span>
				</div>
				<span className="hidden sm:inline text-[11px]">Track everything</span>
			</div>
			<div className="mt-4 space-y-3 text-xs md:text-sm">
				<div className="grid gap-3 md:grid-cols-2">
					{[
						{ label: "Emails Sent", value: "128", hint: "+18 this week" },
						{ label: "Companies Reached", value: "64", hint: "+9 this week" },
						{ label: "Opens Tracked", value: "71%", hint: "open rate" },
						{ label: "Opportunities Found", value: "212", hint: "Updated daily" },
					].map((metric) => (
						<div key={metric.label} className="rounded-xl border border-white/10 bg-black/40 p-3">
							<p className="text-[11px] text-white/60">{metric.label}</p>
							<p className="text-sm font-semibold text-white">{metric.value}</p>
							<p className="text-[11px] text-emerald-300">{metric.hint}</p>
						</div>
					))}
				</div>
				<div className="rounded-xl border border-blue-400/40 bg-blue-500/10 p-3">
					<p className="text-[11px] text-blue-100 mb-2">Weekly activity trend</p>
					<div className="mt-1 flex items-end gap-1 h-20">
						{[35, 42, 55, 48, 62, 70, 85].map((h, idx) => (
							<div key={idx} className="flex-1 rounded-full bg-white/10 overflow-hidden flex items-end">
								<div className="w-full rounded-full bg-gradient-to-t from-accent to-primary" style={{ height: `${h}%` }} />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function MentorshipDemo() {
	return (
		<div className="glass-card p-4 md:p-5">
			<div className="flex items-center justify-between gap-2 text-xs md:text-sm text-white/70">
				<div className="flex items-center gap-2">
					<GraduationCap className="h-4 w-4 text-accent-soft" />
					<span>Mentorship Sessions</span>
				</div>
				<span className="hidden sm:inline text-[11px]">Structured guidance</span>
			</div>
			<div className="mt-4 space-y-3 text-xs md:text-sm">
				<div className="rounded-lg border border-white/10 bg-black/40 p-3 space-y-1.5">
					{["how to prepare for product roles", "data science interview tips", "best resume for freshers 2026", "software engineer career path"].map((query) => (
						<p key={query} className="rounded-md bg-red-500/5 px-2 py-1 text-[11px] text-red-100/80">{query}</p>
					))}
					<p className="mt-1 text-[11px] text-red-200">Scattered, unreliable advice without structure.</p>
				</div>
				<div className="rounded-lg border border-purple-400/40 bg-purple-500/10 p-3 space-y-2">
					{["Resume Review Workshop", "Hiring Trends Discussion", "Mock Interview Session"].map((session) => (
						<motion.div key={session} className="flex items-center justify-between gap-2 rounded-md bg-white/5 px-3 py-2" whileHover={{ y: -2 }}>
							<span className="text-[11px] text-white/80">{session}</span>
							<span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
}

/* ------------------------------------------------------------- Content --- */

const offerings = [
	{
		n: "01",
		eyebrow: "Cold Outreach",
		Icon: Send,
		title: "Structured Recruiter Outreach",
		description:
			"Outmail runs personalized cold-email campaigns to recruiters from your own inbox, targeting companies that show real hiring signals — funding, hiring momentum, and industry growth.",
		features: [
			"Personalized outreach sent from your own Gmail",
			"Targets companies with strong hiring signals",
			"Safe sending limits + open tracking",
			"Get noticed where your odds are actually higher",
		],
		highlight: "Reach the companies where your probability of getting noticed and hired is significantly higher.",
		Demo: RecruiterOutreachDemo,
	},
	{
		n: "02",
		eyebrow: "Job Feed",
		Icon: Search,
		title: "Intelligent Opportunity Discovery",
		description:
			"A curated feed of roles matched to your resume and job-hunt intent — each ranked by an explainable Outmail Score so you spend energy only on the opportunities worth it.",
		features: [
			"Resume- and intent-matched roles",
			"Explainable Outmail Score with “why matched”",
			"Ranked by fit, hiring urgency, and momentum",
			"Filter by role, level, and location",
		],
		highlight: "The Outmail Score helps you prioritize high-probability, high-quality opportunities.",
		Demo: OpportunityDiscoveryDemo,
	},
	{
		n: "03",
		eyebrow: "Autofill",
		Icon: FileCheck,
		title: "One-Click Job Applications",
		description:
			"Set up your profile once on the Outmail dashboard. Our browser extension then fills most application fields for you — so every application takes seconds, not minutes.",
		features: [
			"One-time profile setup",
			"Chrome extension autofills applications",
			"Apply to many roles at scale",
			"No more repetitive form filling",
		],
		highlight: "Apply faster and at scale — spend your energy on preparation, not paperwork.",
		Demo: AutoApplyDemo,
	},
	{
		n: "04",
		eyebrow: "Analytics",
		Icon: BarChart3,
		title: "Your Outreach, Measured",
		description:
			"A clean dashboard shows exactly what your outreach is doing — emails sent, companies reached, open rates, and opportunities discovered — so you can double down on what works.",
		features: [
			"Live outreach + open-rate tracking",
			"Companies reached and applications sent",
			"Opportunities discovered, updated daily",
			"See what's working at a glance",
		],
		highlight: "Complete transparency into your job hunt — no more guessing whether it's working.",
		Demo: PlacementAnalyticsDemo,
	},
	{
		n: "05",
		eyebrow: "Mentorship",
		Icon: GraduationCap,
		title: "Industry Mentorship & Guidance",
		description:
			"Connect with working professionals across tech, non-tech, and core roles through structured mentorship — resume reviews, hiring-trend sessions, and targeted Q&A.",
		features: [
			"Live sessions with industry professionals",
			"Resume reviews + profile-building workshops",
			"Hiring-trend discussions and market insight",
			"Group Q&A for targeted preparation",
		],
		highlight: "Prepare for the exact roles and companies you're targeting — with people who've been there.",
		Demo: MentorshipDemo,
	},
];

/* -------------------------------------------------------------- Section --- */

function FeatureSection({ item, reverse }) {
	const { n, eyebrow, Icon, title, description, features, highlight, Demo } = item;
	return (
		<motion.section
			className="max-w-6xl mx-auto px-6 lg:px-8 py-14 lg:py-20"
			initial={fadeUp.initial}
			whileInView={fadeUp.whileInView}
			viewport={fadeUp.viewport}
			transition={fadeUp.transition}
		>
			<div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
				<div className={reverse ? "lg:order-2" : ""}>
					<div className="flex items-center gap-3 mb-4">
						<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-primary text-white shadow-lg shadow-accent/30">
							<Icon className="h-5 w-5" />
						</span>
						<span className="font-display text-xs uppercase tracking-[0.25em] text-accent-light">
							{n} · {eyebrow}
						</span>
					</div>
					<h2 className="font-syne text-2xl sm:text-3xl font-semibold text-white leading-tight mb-4">
						{title}
					</h2>
					<p className="text-white/65 leading-relaxed mb-6 max-w-xl">{description}</p>
					<ul className="space-y-2.5 mb-6">
						{features.map((f) => (
							<li key={f} className="flex items-start gap-2.5 text-sm text-white/85">
								<CheckCircle2 className="mt-[2px] h-4 w-4 flex-shrink-0 text-success" />
								<span>{f}</span>
							</li>
						))}
					</ul>
					<div className="note-box text-sm text-white/90 max-w-xl">{highlight}</div>
				</div>
				<div className={reverse ? "lg:order-1" : ""}>
					<Demo />
				</div>
			</div>
		</motion.section>
	);
}

/* ----------------------------------------------------------------- Page --- */

function Page() {
	return (
		<div className="min-h-screen bg-surface-page text-white">
			<Navbar variant="dark" />

			{/* Hero — matches the Contact hero treatment (font-syne + gradient) */}
			<section className="relative overflow-hidden pt-32 pb-16 px-6 lg:px-8">
				<div className="absolute inset-0 pointer-events-none">
					<div className="hero-glow" />
				</div>
				<motion.div
					animate={{ y: [0, -18, 0] }}
					transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-24 left-[10%] w-36 h-36 rounded-2xl border border-white/10 bg-primary/20 rotate-12 blur-[1px]"
				/>
				<motion.div
					animate={{ y: [0, 16, 0] }}
					transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
					className="absolute top-32 right-[12%] w-20 h-20 rounded-full border border-white/15 bg-accent-light/20"
				/>

				<div className="relative max-w-4xl mx-auto text-center">
					<p className="text-xs uppercase tracking-[4px] text-accent-light font-display font-medium mb-5 inline-flex items-center gap-2 justify-center">
						<Rocket className="h-3.5 w-3.5" /> Core Features
					</p>

					<h1 className="text-4xl sm:text-5xl font-syne font-semibold text-white leading-tight mb-6">
						What Outmail Does
						<br />
						<span className="gradient-hero">for Students.</span>
					</h1>

					<p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10">
						Recruiter outreach, resume-matched opportunities, one-click applications, real analytics, and
						industry mentorship — everything you need to land the right job, in one platform.
					</p>

					<div className="flex flex-wrap items-center justify-center gap-4">
						<a
							href={oauthUrl}
							className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-accent to-primary px-6 py-2.5 text-sm sm:text-base font-display font-semibold text-white shadow-lg shadow-accent/40 hover:brightness-110 transition"
						>
							Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
						</a>
						<Link
							href="/pricing"
							className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm sm:text-base font-display font-medium text-white/80 hover:bg-white/10 transition"
						>
							See Pricing
						</Link>
					</div>
				</div>
			</section>

			{/* At a glance — orientation strip */}
			<section className="max-w-5xl mx-auto px-6 lg:px-8 pb-6">
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
					{offerings.map((o) => (
						<div
							key={o.n}
							className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-4 text-center backdrop-blur-sm"
						>
							<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/25 border border-purple-500/30 text-purple-200">
								<o.Icon className="h-4 w-4" />
							</span>
							<span className="font-display text-[11px] uppercase tracking-wider text-white/70">
								{o.eyebrow}
							</span>
						</div>
					))}
				</div>
			</section>

			{/* Alternating feature showcases */}
			<div className="divide-y divide-white/5">
				{offerings.map((item, idx) => (
					<FeatureSection key={item.n} item={item} reverse={idx % 2 === 1} />
				))}
			</div>

			{/* Closing CTA */}
			<section className="px-6 pb-24 pt-8 lg:px-8">
				<div className="max-w-3xl mx-auto text-center">
					<h2 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight mb-4">
						Start landing the right interviews.
					</h2>
					<p className="text-white/60 text-base max-w-xl mx-auto mb-8">
						Cold outreach is free, forever. Add resume-matched jobs, autofill, and mentorship whenever you want more.
					</p>
					<div className="flex flex-wrap items-center justify-center gap-4">
						<a
							href={oauthUrl}
							className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-accent to-primary px-6 py-2.5 text-sm sm:text-base font-display font-semibold text-white shadow-lg shadow-accent/40 hover:brightness-110 transition"
						>
							Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
						</a>
						<Link
							href="/partnership"
							className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm sm:text-base font-display font-medium text-white/80 hover:bg-white/10 transition"
						>
							<Mail className="mr-2 h-4 w-4" /> For universities
						</Link>
					</div>
				</div>
			</section>

			<Footer variant="dark" />
		</div>
	);
}

export default Page;
